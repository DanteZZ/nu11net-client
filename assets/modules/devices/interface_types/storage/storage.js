class storage {

	// t = 0 - Директория
	// t = 1 - Файл

	#__fs = require("fs");
	#__pth = require("path");
	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
	};

	md5(d) {

	};

	_getMapPath(path) {
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

	_readFile(path) {
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 1) { // Если это файл
			let fn = map["~"]; // Название физического файла
			let p = this.#__pth.join(global.__cfg.get().devicesDir,this.__device._id,this._id,fn.substr(0, 1),fn); // Собираем путь к файлу
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

	_readFileAsync(path,func) {
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 1) { // Если это файл
			let fn = map["~"]; // Название физического файла
			let p = this.#__pth.join(global.__cfg.get().devicesDir,this.__device._id,this._id,fn.substr(0, 1),fn); // Собираем путь к файлу
			p = p.replace(/\\/g, "/"); // Меняем ебаные виндовсовские слешы на человеческие юниксовые
			
			if (this.#__fs.existsSync(p)) { // Если физически файл существует
				this.#__fs.readFile(p,"utf-8",func); // Возвращаем его
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

	_writeFile(path,data) {
		if (!data) {var data = "";};
		let _dir = this.#__pth.dirname(path);
		let _file = this.#__pth.basename(path);
		if (_dir == ".") {_dir = "";};
		let map = this._getMapPath(_dir); // Получаем мапу нашего пути
		if (map && map.t == 0) { // Если это директория
			
			//let fn = map["~"]; // Название физического файла
			//let p = this.#__pth.join(global.__cfg.get().devicesDir,this.__device._id,this._id,fn.substr(0, 2),fn); // Собираем путь к файлу
			//p = p.replace(/\\/g, "/"); // Меняем ебаные виндовсовские слешы на человеческие юниксовые
			
			alert(JSON.stringify(map));
			let mapf = this._getMapPath(this.#__pth.join(_dir,_file));
			if (!mapf || mapf.t !== 0) { // Если такого файла не существует, и нет директории с таким же названием, начинаем создавать файл
				let hash = "" // Будущий хеш
				let p = ""; // Будущий путь файла
				do { // Генерим незанятый хеш
					hash = this.#_randomHash();
					p = this.#__pth.join(global.__cfg.get().devicesDir,this.__device._id,this._id,hash.substr(0, 1),hash);
				} while (this.#__fs.existsSync(p));
				let hdir = this.#__pth.join(global.__cfg.get().devicesDir,this.__device._id,this._id,hash.substr(0, 1));
				if (!this.#__fs.existsSync(hdir)) {
					// Создаём директорию если не существует
					this.#__fs.mkdirSync(hdir);
				};

				this.#__fs.writeFileSync(p,data);
				
				if (typeof(map["~"]) !== "object") {map["~"] = {};};

				map["~"][_file] = {"t":1,"~":hash};

				return true;
			} else { //Если есть директория под таким названием
				return false;
			};

			
		} else { // Если такой директории нет
			return false;
		}; 
	};

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
}

module.exports = storage