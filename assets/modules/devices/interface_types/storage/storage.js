class storage {

	// t = 0 - Директория
	// t = 1 - Файл

	#__fs = require("fs");
	#__pth = require("path");
	__mapped = true;
	__map = {};

	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
		this.#__initMap(); // Инициализируем MAP
	};

	#__dir = function() {
		return this.#__pth.join(global.__cfg.get().serversDir,global.__connectedServer.address,"devices",this.__device._id,this._id);
	};

	#__initMap = function() { // Инициализировать MAP
		/* Функция которую надо будет переписать под серверную */
		let pmap = this.#__pth.join(this.#__dir(),".map");
		if (!this.#__fs.existsSync(pmap)) {
			this.__mapped = false;
		} else {
			try {
				this.__map = JSON.parse(this.#__fs.readFileSync(pmap,"utf-8"));
				this.__mapped = true;
			} catch (e) {
				this.#__err("0x000102",e);
				this.__mapped = false;
			};
		};
	};

	__writeMap = function() { // Обновить MAP 
		/* Функция которую надо будет переписать под серверную */
		let mp = {};
		if (typeof(this.__map) == "object") {mp = this.__map;}; // Проверяем чтобы нам не посылали всякую шляпу в MAP

		try {
			this.#__fs.writeFileSync(this.#__pth.join(this.#__dir(),".map"),JSON.stringify(mp));
			return true;
		} catch (e) {
			this.#__err("0x000101",e);
		}

	};

	_calcByte(string) {
		if (typeof(string) == "string") {
			return Buffer.from(string).length
		};
	};


	#__err = function(code,err) { // Вернуть ошибку
		alert("Error: "+code+"\n"+err);
	};

	_getMapPath(path) {
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		if (path) {
			let _pt = path.split("/");
			let res = {"~":this.__map};
			for (var k in _pt) {
				let _p = _pt[k];
				res = res["~"];
				if (res[_p]) {
					res = res[_p]
				} else {
					res = false;
					break;
				}
			};
			return res;
		} else {
			return {"t":0,"~":this.__map};
		}
	};

	/*
		Работа с директориями
	*/
	_scanDir(path,more=false) {
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 0) { // Если это директория
			let res = [];
			for (var k in map["~"]) {
				if (more) { // Если нужно получить доп.информацию
					res.push({name:k,type:map["~"][k].t,attributes:(map["~"][k]?.attributes || {})});
				} else {
					res.push(k);
				};
				
			};
			return res;
		} else { // Если в мапах нет такой директории
			return false;
		}; 
	};

	_isDir(path) { //Проверить директория ли это
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 0) { // Если это директория
			return true;
		} else { // Если в мапах нет такой директории
			return false;
		}; 
	};

	_rmDir(path) { // Удалить директорию
		if (["",".",".."].indexOf(path) >= 0) {return false;} // Проверка на корневой каталог
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 0) { // Если это директория
			if (!Object.keys(map["~"]).length) { // Если в папке ничего нет
				let ppath = this.#__pth.dirname(path);
				ppath = ppath.replace(/\\/g, "/");
				if (ppath == ".") {ppath = "";};
				let pmap = this._getMapPath(ppath); // Получаем родительскую директорию
				if (pmap) { // Если родительская категория существует
					delete(pmap["~"][this.#__pth.basename(path)]); // Удаляем директорию
					this.__writeMap(); // Обновляем MAP
					return true;
				} else { // Если родителя нет, значит какая то трабла с MAP
					return false;
				}
			} else { // Если в папке есть что то
				return false;
			};
		} else { // Если в мапах нет такой директории
			return false;
		}; 
	};

	_mkDir(path) { // Создать директорию
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		
		if (this._getMapPath(path)) { // Если это название занято
			return false;
		};

		let dir = this.#__pth.dirname(path);
		dir = dir.replace(/\\/g, "/");
		if (dir == ".") {dir = "";};
		
		let map = this._getMapPath(dir); // Получаем мапу нашего пути
		if (map && map.t == 0) { // Если это директория
			if (typeof(map["~"]) !== "object") {map["~"] = {};};
			map["~"][this.#__pth.basename(path)] = {
				"t":0,
				"~":{}
			};
			this.__writeMap(); // Обновляем MAP
			return true;
		} else { // Если в мапах нет такой директории
			return false;
		}; 
	};

	_mkDirAsync(path,func) { // Создать директорию асинхронно

		if (typeof(func) !== "function") {func = function(){};};
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		if (this._getMapPath(path)) { // Если это название занято
			func(false);
		};

		let dir = this.#__pth.dirname(path);
		dir = dir.replace(/\\/g, "/");
		if (dir == ".") {dir = "";};
		
		let map = this._getMapPath(dir); // Получаем мапу нашего пути
		if (map && map.t == 0) { // Если это директория
			if (typeof(map["~"]) !== "object") {map["~"] = {};};
			map["~"][this.#__pth.basename(path)] = {
				"t":0,
				"~":{}
			};
			this.__writeMap(); // Обновляем MAP
			func(true);
		} else { // Если в мапах нет такой директории
			func(false);
		};
	};

	/*
		Работа с файлами
	*/

	/* Удаление данных */
	_rmData(path) {
		if (["",".",".."].indexOf(path) >= 0) {return false;} // Проверка на корневой каталог
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 1) { // Если это файл
			let ppath = this.#__pth.dirname(path);
			ppath = ppath.replace(/\\/g, "/");
			if (ppath == ".") {ppath = "";};
			let pmap = this._getMapPath(ppath); // Получаем родительскую директорию
			if (pmap) { // Если родительский каталог существует
				let p = this.#__pth.join(this.#__dir(),map['~'].substr(0, 1),map['~']);
				p = p.replace(/\\/g, "/");
				try {
				  this.#__fs.unlinkSync(p)
				} catch(e) {
				  alert(e)
				  return false;
				};
				delete(pmap["~"][this.#__pth.basename(path)]); // Удаляем директорию
				this.__writeMap(); // Обновляем MAP
				return true;
			} else { // Если родителя нет, значит какая то трабла с MAP
				return false;
			}
		} else { // Если в мапах нет такого файла
			return false;
		}; 
	};

	_rmDataAsync(path,func=function(){}) {
		if (["",".",".."].indexOf(path) >= 0) {return false;} // Проверка на корневой каталог
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 1) { // Если это файл
			let ppath = this.#__pth.dirname(path);
			ppath = ppath.replace(/\\/g, "/");
			if (ppath == ".") {ppath = "";};
			let pmap = this._getMapPath(ppath); // Получаем родительскую директорию
			if (pmap) { // Если родительский каталог существует
				let p = this.#__pth.join(this.#__dir(),map['~'].substr(0, 1),map['~']);
				p = p.replace(/\\/g, "/");
				
				delete(pmap["~"][this.#__pth.basename(path)]); // Удаляем директорию
				this.__writeMap(); // Обновляем MAP
				this.#__fs.unlink(p,function(){func(true);});
			} else { // Если родителя нет, значит какая то трабла с MAP
				func(false);
			}
		} else { // Если в мапах нет такого файла
			func(false);
		}; 
	};


	/* Чтение данных */
	_readData(path) {
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 1) { // Если это файл
			let fn = map["~"]; // Название физического файла
			let p = this.#__pth.join(this.#__dir(),fn.substr(0, 1),fn); // Собираем путь к файлу
			p = p.replace(/\\/g, "/"); // Меняем ебаные виндовсовские слешы на человеческие юниксовые
			
			if (this.#__fs.existsSync(p)) { // Если физически файл существует
				return this.#__fs.readFileSync(p,"utf-8"); // Возвращаем его
			} else { 
				/*

					А здесь надо будет воткнуть ошибку жёсткого диска. Физически файла не существует.
					Да и вообще, стоит сделать доп. проверку на контрольную сумму файлов, чтобы их никто не подменял.

				*/
				return false;
			}
		} else { // Если файла в мапах нет
			return false;
		}; 
	};

	_readDataAsync(path,func) {
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 1) { // Если это файл
			let fn = map["~"]; // Название физического файла
			let p = this.#__pth.join(this.#__dir(),fn.substr(0, 1),fn); // Собираем путь к файлу
			p = p.replace(/\\/g, "/"); // Меняем ебаные виндовсовские слешы на человеческие юниксовые
			
			if (this.#__fs.existsSync(p)) { // Если физически файл существует
				this.#__fs.readFile(p,"utf-8",function(err,data){func(data)}); // Возвращаем его
			} else { 
				/*

					А здесь надо будет воткнуть ошибку жёсткого диска. Физически файла не существует.
					Да и вообще, стоит сделать доп. проверку на контрольную сумму файлов, чтобы их никто не подменял.

				*/
				func(false);
			}
		} else { // Если файла в мапах нет
			func(false);
		}; 
	};

	/* Запись данных */
	_writeData(path,data) {
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		if (!path) {return false;};
		if (!data) {var data = "";};
		let _dir = this.#__pth.dirname(path);
		_dir = _dir.replace(/\\/g, "/");
		let _file = this.#__pth.basename(path);
		if (_dir == ".") {_dir = "";};
		let map = this._getMapPath(_dir); // Получаем мапу нашего пути
		if (map && map.t == 0) { // Если это директория
			let mapf_p = this.#__pth.join(_dir,_file)
			mapf_p = mapf_p.replace(/\\/g, "/");
			let mapf = this._getMapPath(mapf_p);
			let p = ""; // Будущий путь файла
			let hash = "" // Будущий хеш
			let attributes = {} //Будущие аттрибуты
			if (!mapf) { // Если такого файла не существует, и нет директории с таким же названием, начинаем создавать файл
				do { // Генерим незанятый хеш
					hash = this.#_randomHash();
					p = this.#__pth.join(this.#__dir(),hash.substr(0, 1),hash);
					p = p.replace(/\\/g, "/");
				} while (this.#__fs.existsSync(p));
				let hdir = this.#__pth.join(this.#__dir(),hash.substr(0, 1));
				hdir = hdir.replace(/\\/g, "/");
				if (!this.#__fs.existsSync(hdir)) {
					// Создаём директорию если не существует
					try {
						this.#__fs.mkdirSync(hdir);
					} catch (e) {
						/* Тут надо вернуть ошибку */
						alert(e);
						return false;
					};
				};
			} else if (mapf.t !== 0) { //Если такой файл уже существует
				hash = mapf['~'];
				attributes = mapf?.['attributes'] || {};
				p = this.#__pth.join(this.#__dir(),mapf['~'].substr(0, 1),mapf['~']);
				p = p.replace(/\\/g, "/");
			} else { // Если это директория
				return false;
			};
			this.#__fs.writeFileSync(p,data);
			if (typeof(map["~"]) !== "object") {map["~"] = {};};
				map["~"][_file] = {"t":1,"~":hash,attributes};
			this.__writeMap(); // Обновляем MAP
		} else { // Если такой директории нет
			return false;
		}; 
	};

	_writeDataAsync(path,data,func) {
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		if (typeof(func) !== "function") {var func = function(){};};
		if (!path) {return false;};
		if (!data) {var data = "";};
		let _dir = this.#__pth.dirname(path);
		_dir = _dir.replace(/\\/g, "/");
		let _file = this.#__pth.basename(path);
		if (_dir == ".") {_dir = "";};
		let map = this._getMapPath(_dir); // Получаем мапу нашего пути
		if (map && map.t == 0) { // Если это директория
			let mapf_p = this.#__pth.join(_dir,_file)
			mapf_p = mapf_p.replace(/\\/g, "/");
			let mapf = this._getMapPath(mapf_p);
			let p = ""; // Будущий путь файла
			let hash = "" // Будущий хеш
			let attributes = {} //Будущие аттрибуты
			if (!mapf) { // Если такого файла не существует, и нет директории с таким же названием, начинаем создавать файл
				do { // Генерим незанятый хеш
					hash = this.#_randomHash();
					p = this.#__pth.join(this.#__dir(),hash.substr(0, 1),hash);
					p = p.replace(/\\/g, "/");
				} while (this.#__fs.existsSync(p));
				let hdir = this.#__pth.join(this.#__dir(),hash.substr(0, 1));
				hdir = hdir.replace(/\\/g, "/");
				if (!this.#__fs.existsSync(hdir)) {
					// Создаём директорию если не существует
					try {
						this.#__fs.mkdirSync(hdir);
					} catch (e) {
						/* Тут надо вернуть ошибку */
						global.__csl.error(e);
						func(false);
					};
				};
			} else if (mapf.t !== 0) { //Если такой файл уже существует
				p = this.#__pth.join(this.#__dir(),mapf['~'].substr(0, 1),mapf['~']);
				hash = mapf['~'];
				attributes = mapf?.['attributes'] || {};
				p = p.replace(/\\/g, "/");
			} else { // Если это директория
				func(false);
			};
			if (typeof(map["~"]) !== "object") {map["~"] = {};};
				map["~"][_file] = {"t":1,"~":hash,attributes};
			this.__writeMap();
			this.#__fs.writeFile(p,data,function(err){
				func(true);
			});
		} else { // Если такой директории нет
			func(false);
		}; 
	};

	/* Прочие функции */

	_isData(path) { //Проверить директория ли это
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 1) { // Если это директория
			return true;
		} else { // Если в мапах нет такой директории
			return false;
		}; 
	};

	_getAttributes(path) { //Получить аттрибуты
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		return map?.attributes || {};
	};

	_setAttributes(path,attributes) { // Создать директорию
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		
		if (this._getMapPath(path)) { // Если этот путь существует			
			let map = this._getMapPath(path); // Получаем мапу нашего пути
			map.attributes = attributes;
			this.__writeMap(); // Обновляем MAP
			return true; 
		} else {
			return false;
		};
	};

	_rename(oldpath,newpath) {
		if (["",".",".."].indexOf(oldpath) >= 0) {return false;} // Проверка на корневой каталог
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		
		let map = this._getMapPath(oldpath); // Получаем мапу нашего пути
		let nmap = this._getMapPath(newpath); // Получаем мапу нашего пути
		if (map && !nmap) { // Если старое имя существует в мапах, а новое нет
			
			/* CHECK OLDPATH */
			let ppath = this.#__pth.dirname(oldpath);
			ppath = ppath.replace(/\\/g, "/");
			if (ppath == ".") {ppath = "";};
			let pmap = this._getMapPath(ppath); // Получаем родительскую директорию oldpath
			
			/* CHECK NEWPATH */
			let npath = this.#__pth.dirname(newpath);
			npath = npath.replace(/\\/g, "/");
			if (npath == ".") {npath = "";};
			let nmap = this._getMapPath(npath); // Получаем родительскую директорию oldpath

			if (pmap && nmap) { // Если родительские категории существуют
				
				let mp = pmap["~"][this.#__pth.basename(oldpath)]; // Удаляем директорию
				delete(pmap["~"][this.#__pth.basename(oldpath)]);
				if (typeof(nmap["~"])!== "object") {nmap['~'] == {};};
				nmap["~"][this.#__pth.basename(newpath)] = mp;
				this.__writeMap(); // Обновляем MAP
				return true;
			} else { // Если родителя нет, значит какая то трабла с MAP
				return false;
			}
		} else { // Если в мапах нет такой директории
			return false;
		}; 
	}

	#_randomHash = function(len) {
		len = len || 32;
	    let charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
	    var randomString = '';
	    for (var i = 0; i < len; i++) {
	        var randomPoz = Math.floor(Math.random() * charSet.length);
	        randomString += charSet.substring(randomPoz,randomPoz+1);
	    }
	    return randomString;
	};

	__initCommands = function() {
		/* Запишем путь к командам и путь с конечным слешом */
		let cat = "interfaces/"+this.__type+"/"+this._id;
		let catf = cat+"/";
		let cmd = this.__device._cmd;
		cmd._regCat(cat); //Регаем каталог

		/* DIR */
		cmd._reg(catf+"scdir",function(d) {
			return this._scanDir(d.path,d.more);
		},this,false);
		cmd._reg(catf+"isdir",function(d) {
			return this._isDir(d.path);
		},this,false);
		cmd._reg(catf+"rmdir",function(d) {
			return this._rmDir(d.path);
		},this,false);
		cmd._reg(catf+"mkdir",function(d) {
			return this._mkDir(d.path);
		},this,false);
		cmd._reg(catf+"mkdirasync",function(d,cb) {
			this._mkDirAsync(d.path,cb);
		},this,true);

		/* DATA */
		cmd._reg(catf+"rmdata",function(d) {
			return this._rmData(d.path);
		},this,false);
		cmd._reg(catf+"rmdataasync",function(d,cb) {
			this._rmDataAsync(d.path,cb);
		},this,true);
		cmd._reg(catf+"writedata",function(d) {
			return this._writeData(d.path,d.data);
		},this,false);
		cmd._reg(catf+"writedataasync",function(d,cb) {
			this._writeDataAsync(d.path,d.data,cb);
		},this,true);
		cmd._reg(catf+"readdata",function(d) {
			return this._readData(d.path);
		},this,false);
		cmd._reg(catf+"readdataasync",function(d,cb) {
			this._readDataAsync(d.path,cb);
		},this,true);
		cmd._reg(catf+"isdata",function(d) {
			return this._isData(d.path);
		},this,false);
		
		/* ANOTHER */
		cmd._reg(catf+"getattributes",function(d) {
			return this._getAttributes(d.path);
		},this,false);
		cmd._reg(catf+"setattributes",function(d) {
			return this._setAttributes(d.path,d.attributes);
		},this,false);
		cmd._reg(catf+"rename",function(d) {
			return this._rename(d.oldpath,d.newpath);
		},this,false);
	}
}

module.exports = storage