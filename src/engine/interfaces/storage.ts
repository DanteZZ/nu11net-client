import _path from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { ensureDir, ensureDirSync } from "fs-extra";
import Interface, { iInterface } from "../utils/interface";
import CFG from "../../utils/conf";
import { basedir } from "../../utils/consts";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import { randomHash } from "../../utils/hash";
import Socket from "../utils/socket";
import Device from "../utils/device";

interface iMapAttributes {
    [key: string]: any;
}
interface iMapData {
    t?: number;
    "~": string | iMapDir;
    attributes?: iMapAttributes;
}

interface iMapDir {
    [key: string]: iMapData;
}

interface iResultData {
    name?: string;
    type?: number;
    attributes?: iMapAttributes;
}

export default class Storage extends Interface {
    protected mapped: Boolean = true;
    protected map: iMapDir = {};
    protected initialized: Boolean = false;
    readonly mapType: string;

    constructor(info: iInterface, controller: Socket) {
        super(info, controller);
        this.mapType = info.mapType;
    }

    #__dir(): string {
        // return _path.join(global._basedir,CFG.get().serversDir, global._ws.srvInfo.hash, String(global._ws.userInfo.id), "interfaces", this.id);
        return _path.join(basedir, CFG.get().serversDir, "interfaces", this.id);
    }

    protected _throwError(code: string, error: any) {
        console.error("Error: " + code, error);
    }

    protected _initMap(): Boolean {
        // Инициализировать MAP
        /* Функция которую надо будет переписать под серверную */
        let pmap = _path.join(this.#__dir(), "map");
        if (!existsSync(pmap)) {
            this.mapped = false;
            return false;
        } else {
            try {
                this.map = JSON.parse(readFileSync(pmap, "utf-8"));
                this.mapped = true;
                return true;
            } catch (e) {
                this._throwError("0x000102", e);
                this.mapped = false;
                return false;
            }
        }
    }

    protected _writeMap(): Boolean {
        // Обновить MAP
        /* Функция которую надо будет переписать под серверную */
        let mp = {};
        if (typeof this.map == "object") {
            mp = this.map;
        } // Проверяем чтобы нам не посылали всякую шляпу в MAP

        try {
            writeFileSync(_path.join(this.#__dir(), "map"), JSON.stringify(mp));
            return true;
        } catch (e) {
            this._throwError("0x000101", e);
            return false;
        }
    }

    protected _calcByte(str: string) {
        if (typeof str == "string") {
            return Buffer.from(str).length;
        }
    }

    protected _getMapPath(path: string): null | iMapData {
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return null;
        }
        if (path) {
            let _pt = typeof path == "string" ? path?.split("/") : [];
            let res: iMapData = { "~": this.map };
            for (const k in _pt) {
                if (res?.["~"]) {
                    let _p = _pt[k];
                    let tempRes = res["~"];
                    if (typeof tempRes == "object" && tempRes[_p]) {
                        res = tempRes[_p];
                    } else {
                        return null;
                    }
                }
            }
            return res;
        } else {
            return { t: 0, "~": this.map };
        }
    }

    public async _saveBuffer(path: string, data: any) {
        const dirPath = _path.join(path, "..");
        ensureDirSync;
        if (!existsSync(dirPath)) {
            await ensureDir(dirPath);
        }
        writeFile(path, Buffer.from(data), "binary");
        return true;
    }
    /*
        Directory functions
    */

    public scanDir(
        path: string,
        more: Boolean = false
    ): iResultData[] | String[] | Boolean {
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return false;
        }
        let map = this._getMapPath(path); // Получаем мапу нашего пути
        if (map && map?.t === 0 && typeof map["~"] == "object") {
            // Если это директория
            let moreRes: iResultData[] = [];
            let res: String[] = [];
            for (const k in map["~"]) {
                if (more) {
                    // Если нужно получить доп.информацию
                    const result: iResultData = {
                        name: k,
                        type: map["~"][k].t,
                        attributes: map["~"][k]?.attributes || {},
                    };
                    moreRes.push(result);
                } else {
                    res.push(k);
                }
            }
            return more ? moreRes : res;
        } else {
            // Если в мапах нет такой директории
            return false;
        }
    }

    public isDir(path: string): Boolean {
        //Проверить директория ли это
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return false;
        }
        let map = this._getMapPath(path); // Получаем мапу нашего пути
        if (map && map?.t == 0) {
            // Если это директория
            return true;
        } else {
            // Если в мапах нет такой директории
            return false;
        }
    }

    public rmDir(path: string): Boolean {
        // Удалить директорию
        if (["", ".", ".."].indexOf(path) >= 0) {
            return false;
        } // Проверка на корневой каталог
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return false;
        }
        let map = this._getMapPath(path); // Получаем мапу нашего пути
        if (map && map.t == 0) {
            // Если это директория
            if (!Object.keys(map["~"]).length) {
                // Если в папке ничего нет
                let ppath = _path.dirname(path);
                ppath = ppath.replace(/\\/g, "/");
                if (ppath == ".") {
                    ppath = "";
                }
                let pmap = this._getMapPath(ppath); // Получаем родительскую директорию
                if (pmap && typeof pmap["~"] === "object") {
                    // Если родительская категория существует
                    delete pmap["~"][_path.basename(path)]; // Удаляем директорию
                    this._writeMap(); // Обновляем MAP
                    return true;
                } else {
                    // Если родителя нет, значит какая то трабла с MAP
                    return false;
                }
            } else {
                // Если в папке есть что то
                return false;
            }
        } else {
            // Если в мапах нет такой директории
            return false;
        }
    }
    public mkDir(path: string) {
        return new Promise((res, rej) => {
            if (!this.mapped) {
                this._throwError("0x000101", "Unmapped storage");
                rej(false);
            }
            const map = this._getMapPath(path);
            if (!map) {
                // Если это название занято
                rej(false);
            }

            let dir = _path.dirname(path);
            dir = dir.replace(/\\/g, "/");
            if (dir == ".") {
                dir = "";
            }
            if (map && map.t == 0) {
                // Если это директория
                if (typeof map["~"] !== "object") {
                    map["~"] = {};
                }
                map["~"][_path.basename(path)] = {
                    t: 0,
                    "~": {},
                };
                this._writeMap(); // Обновляем MAP
                res(true);
            } else {
                // Если в мапах нет такой директории
                rej(false);
            }
        });
    }

    /* Data working */

    public async rmData(path: string) {
        if (["", ".", ".."].indexOf(path) >= 0) {
            return false;
        } // Проверка на корневой каталог
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return false;
        }
        let map = this._getMapPath(path); // Получаем мапу нашего пути
        if (map && map.t == 1) {
            // Если это файл
            let ppath = _path.dirname(path);
            ppath = ppath.replace(/\\/g, "/");
            if (ppath == ".") {
                ppath = "";
            }
            let pmap = this._getMapPath(ppath); // Получаем родительскую директорию
            if (pmap) {
                // Если родительский каталог существует
                let p = _path.join(
                    this.#__dir(),
                    typeof map["~"] === "string" ? map["~"].substr(0, 1) : "",
                    typeof map["~"] === "string" ? map["~"] : ""
                );
                p = p.replace(/\\/g, "/");

                typeof pmap["~"] === "object" &&
                    delete pmap["~"][_path.basename(path)]; // Удаляем директорию
                this._writeMap(); // Обновляем MAP
                return await unlink(p);
            } else {
                // Если родителя нет, значит какая то трабла с MAP
                return false;
            }
        } else {
            // Если в мапах нет такого файла
            return false;
        }
    }

    public async readData(path: string) {
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return false;
        }

        const map = this._getMapPath(path); // Получаем мапу нашего пути

        if (map && map.t == 1) {
            // Если это файл
            let fn = typeof map["~"] === "string" ? map["~"] : ""; // Название физического файла
            let p = _path.join(this.#__dir(), fn.substr(0, 1), fn); // Собираем путь к файлу
            p = p.replace(/\\/g, "/"); // Меняем ебаные виндовсовские слешы на человеческие юниксовые
            if (existsSync(p)) {
                // Если физически файл существует
                const data = await readFile(p, "utf-8"); // Возвращаем его
                return data;
            } else {
                /*

					А здесь надо будет воткнуть ошибку жёсткого диска. Физически файла не существует.
					Да и вообще, стоит сделать доп. проверку на контрольную сумму файлов, чтобы их никто не подменял.

				*/
                return false;
            }
        } else {
            // Если файла в мапах нет
            return false;
        }
    }

    public async writeData(path: string, data: string) {
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return false;
        }
        if (!path) {
            return false;
        }
        if (!data) {
            data = "";
        }
        let _dir = _path.dirname(path);
        _dir = _dir.replace(/\\/g, "/");
        let _file = _path.basename(path);
        if (_dir == ".") {
            _dir = "";
        }
        let map = this._getMapPath(_dir); // Получаем мапу нашего пути
        if (map && map.t == 0) {
            // Если это директория
            let mapf_p = _path.join(_dir, _file);
            mapf_p = mapf_p.replace(/\\/g, "/");
            let mapf = this._getMapPath(mapf_p);
            let p = ""; // Будущий путь файла
            let hash = ""; // Будущий хеш
            let attributes = {}; //Будущие аттрибуты
            if (!mapf) {
                // Если такого файла не существует, и нет директории с таким же названием, начинаем создавать файл
                do {
                    // Генерим незанятый хеш
                    hash = randomHash();
                    p = _path.join(this.#__dir(), hash.substr(0, 1), hash);
                    p = p.replace(/\\/g, "/");
                } while (existsSync(p));
                let hdir = _path.join(this.#__dir(), hash.substr(0, 1));
                hdir = hdir.replace(/\\/g, "/");
                if (!existsSync(hdir)) {
                    // Создаём директорию если не существует
                    try {
                        await mkdir(hdir);
                    } catch (e) {
                        /* Тут надо вернуть ошибку */
                        console.error(e);
                        return false;
                    }
                }
            } else if (mapf.t !== 0) {
                //Если такой файл уже существует
                const pp = typeof mapf["~"] === "string" ? mapf["~"] : "";
                p = _path.join(this.#__dir(), pp.substr(0, 1), pp);
                hash = pp;
                attributes = mapf?.["attributes"] || {};
                p = p.replace(/\\/g, "/");
            } else {
                // Если это директория
                return false;
            }
            if (typeof map["~"] !== "object") {
                map["~"] = {};
            }
            map["~"][_file] = { t: 1, "~": hash, attributes };
            this._writeMap();
            await writeFile(p, data);
            return true;
        } else {
            // Если такой директории нет
            return false;
        }
    }

    /*
        Another functions
    */
    public isData(path: string): Boolean {
        //Проверить директория ли это
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return false;
        }
        let map = this._getMapPath(path); // Получаем мапу нашего пути
        if (map && map.t == 1) {
            // Если это директория
            return true;
        } else {
            // Если в мапах нет такой директории
            return false;
        }
    }

    public getAttributes(path: string): iMapAttributes | null {
        //Получить аттрибуты
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return null;
        }
        let map = this._getMapPath(path); // Получаем мапу нашего пути
        return map?.attributes || {};
    }

    public setAttributes(path: string, attributes: iMapAttributes): Boolean {
        // Создать директорию
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return false;
        }
        const map = this._getMapPath(path);
        if (map) {
            // Если этот путь существует
            map.attributes = attributes;
            this._writeMap(); // Обновляем MAP
            return true;
        } else {
            return false;
        }
    }

    public rename(oldpath: string, newpath: string): Boolean {
        if (["", ".", ".."].indexOf(oldpath) >= 0) {
            return false;
        } // Проверка на корневой каталог
        if (!this.mapped) {
            this._throwError("0x000101", "Unmapped storage");
            return false;
        }

        let map = this._getMapPath(oldpath); // Получаем мапу нашего пути
        let nmap = this._getMapPath(newpath); // Получаем мапу нашего пути
        if (map && !nmap) {
            // Если старое имя существует в мапах, а новое нет

            /* CHECK OLDPATH */
            let ppath = _path.dirname(oldpath);
            ppath = ppath.replace(/\\/g, "/");
            if (ppath == ".") {
                ppath = "";
            }
            let pmap = this._getMapPath(ppath); // Получаем родительскую директорию oldpath

            /* CHECK NEWPATH */
            let npath = _path.dirname(newpath);
            npath = npath.replace(/\\/g, "/");
            if (npath == ".") {
                npath = "";
            }
            let nmap = this._getMapPath(npath); // Получаем родительскую директорию oldpath

            if (
                pmap &&
                typeof pmap["~"] === "object" &&
                nmap &&
                typeof nmap["~"] === "object"
            ) {
                // Если родительские категории существуют
                let mp = pmap["~"][_path.basename(oldpath)]; // Удаляем директорию
                typeof pmap["~"] === "string" &&
                    delete pmap["~"][_path.basename(oldpath)];
                if (typeof nmap["~"] !== "object") {
                    nmap["~"] = {};
                }
                nmap["~"][_path.basename(newpath)] = mp;
                this._writeMap(); // Обновляем MAP
                return true;
            } else {
                // Если родителя нет, значит какая то трабла с MAP
                return false;
            }
        } else {
            // Если в мапах нет такой директории
            return false;
        }
    }

    public async _initStorage() {
        // const pmap = _path.join(this.#__dir(), "map");

        if (!existsSync(this.#__dir())) {
            // Check storageDir
            await ensureDir(this.#__dir());
        }

        // if (!existsSync(pmap)) {
        //     // Check mapping
        //     const type = mapType || this.mapType || "";
        //     const { files, map } = await _ws.sendResponsableCommand(
        //         "get_storage",
        //         { type }
        //     );
        //     await writeFile(pmap, JSON.stringify(map));
        //     for (let i in files) {
        //         const name = files[i];
        //         const {
        //             data: { data },
        //         } = await _ws.sendResponsableCommand("get_storage_file", {
        //             type,
        //             name,
        //         });
        //         await this._saveBuffer(
        //             _path.join(this.#__dir(), name.charAt(0), name),
        //             data
        //         );
        //     }
        // }
        try {
            this.initialized = true;
            this._initMap();
            return true;
        } catch (e) {
            return false;
        }
    }

    public async _init(device: Device) {
        await this._initStorage();
        const catf = "interfaces/" + this.type + "/" + this.id + "/";
        const cmd = device?.vm?.commandRunner || null;
        if (cmd) {
            cmd.registerCommand(
                catf + "initialize",
                () => this._initStorage(),
                true
            );
            cmd.registerCommand(
                catf + "scdir",
                (attrs: { path: string; more?: boolean }) =>
                    this.scanDir(attrs.path, attrs?.more)
            );
            cmd.registerCommand(catf + "isdir", (p: string) => this.isDir(p));
            cmd.registerCommand(
                catf + "mkdir",
                (p: string) => this.mkDir(p),
                true
            );
            cmd.registerCommand(catf + "rmdir", (p: string) => this.rmDir(p));
            cmd.registerCommand(
                catf + "rmdata",
                (p: string) => this.rmData(p),
                true
            );
            cmd.registerCommand(
                catf + "writedata",
                (attrs: { path: string; data: string }) =>
                    this.writeData(attrs.path, attrs.data),
                true
            );
            cmd.registerCommand(
                catf + "readdata",
                (p: string) => this.readData(p),
                true
            );
            cmd.registerCommand(catf + "isdata", (p: string) => this.isData(p));
            cmd.registerCommand(catf + "getattributes", (p: string) =>
                this.getAttributes(p)
            );
            cmd.registerCommand(
                catf + "setattributes",
                (attrs: { path: string; attributes: iMapAttributes }) =>
                    this.setAttributes(attrs.path, attrs.attributes)
            );
            cmd.registerCommand(
                catf + "rename",
                (attrs: { oldpath: string; newpath: string }) =>
                    this.rename(attrs.oldpath, attrs.newpath)
            );
        }
        return true;
    }

    public async _terminate(device: Device) {
        const catf = "interfaces/" + this.type + "/" + this.id + "/";
        const cmd = device?.vm?.commandRunner || null;
        if (cmd) {
            [
                "getattributes",
                "initialize",
                "isdata",
                "isdir",
                "mkdir",
                "readdata",
                "rename",
                "rmdata",
                "rmdir",
                "scdir",
                "setattributes",
                "writedata",
            ].forEach((c) => cmd.removeCommand(catf + c));
        }
        return true;
    }
}
