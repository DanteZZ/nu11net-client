class storage {

	// t = 0 - Директория
	// t = 1 - Файл

	#__fs = require("fs");
	#__pth = require("path");
	constructor(a,b,c,d) {
		this._init(a,b,c,d) // Инициализация интерфейса
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
			return false;
		}
	};

	_readFileSync(path) {
		let map = this._getMapPath(path); // Получаем мапу нашего пути
		if (map && map.t == 1) { // Если это файл
			let fn = map["~"]; // Название физического файла
			let p = this.#__pth.join(global.__cfg.get().devicesDir,this.__device._id,this._id,fn.substr(0, 2),fn); // Собираем путь к файлу
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
}

module.exports = storage