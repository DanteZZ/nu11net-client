class storage {

	// t = 0 - Директория
	// t = 1 - Файл

	#__fs = require("fs");
	#__pth = require("path");
	#__dir = "";
	__mapped = true;
	__map = {};

	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
		this.#__dir = this.#__pth.join(global.__cfg.get().serversDir,global.__connectedServer.address,"devices",this.__device._id,this._id);
		this.#__initMap(); // Инициализируем MAP
	};

	#__initMap = function() { // Инициализировать MAP
		/* Функция которую надо будет переписать под серверную */
		let pmap = this.#__pth.join(this.#__dir,".map");
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
			this.#__fs.writeFileSync(this.#__pth.join(this.#__dir,".map"),JSON.stringify(mp));
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

	_readData(path) {
		if (!this.__mapped) {this.#__err("0x000101","Unmapped storage"); return false;};
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 1) { // Если это файл
			let fn = map["~"]; // Название физического файла
			let p = this.#__pth.join(this.#__dir,fn.substr(0, 1),fn); // Собираем путь к файлу
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
			let p = this.#__pth.join(this.#__dir,fn.substr(0, 1),fn); // Собираем путь к файлу
			p = p.replace(/\\/g, "/"); // Меняем ебаные виндовсовские слешы на человеческие юниксовые
			
			if (this.#__fs.existsSync(p)) { // Если физически файл существует
				this.#__fs.readFile(p,"utf-8",function(err,data){func(false,data)}); // Возвращаем его
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
			let mapf = this._getMapPath(this.#__pth.join(_dir,_file));
			if (!mapf || mapf.t !== 0) { // Если такого файла не существует, и нет директории с таким же названием, начинаем создавать файл
				let hash = "" // Будущий хеш
				let p = ""; // Будущий путь файла
				do { // Генерим незанятый хеш
					hash = this.#_randomHash();
					p = this.#__pth.join(this.#__dir,hash.substr(0, 1),hash);
					p = p.replace(/\\/g, "/");
				} while (this.#__fs.existsSync(p));
				let hdir = this.#__pth.join(this.#__dir,hash.substr(0, 1));
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

				this.#__fs.writeFileSync(p,data);
				
				if (typeof(map["~"]) !== "object") {map["~"] = {};};

				map["~"][_file] = {"t":1,"~":hash};

				this.__writeMap(); // Обновляем MAP

				return true;
			} else { //Если есть директория под таким названием
				return false;
			};
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
			let mapf = this._getMapPath(this.#__pth.join(_dir,_file));
			if (!mapf || mapf.t !== 0) { // Если такого файла не существует, и нет директории с таким же названием, начинаем создавать файл
				let hash = "" // Будущий хеш
				let p = ""; // Будущий путь файла
				do { // Генерим незанятый хеш
					hash = this.#_randomHash();
					p = this.#__pth.join(this.#__dir,hash.substr(0, 1),hash);
					p = p.replace(/\\/g, "/");
				} while (this.#__fs.existsSync(p));
				let hdir = this.#__pth.join(this.#__dir,hash.substr(0, 1));
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

				this.#__fs.writeFile(p,data,function(err,data){
					this.__writeMap();
					func(false,data);
				});
				
				if (typeof(map["~"]) !== "object") {map["~"] = {};};

				map["~"][_file] = {"t":1,"~":hash};

				this.__writeMap(); // Обновляем MAP

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