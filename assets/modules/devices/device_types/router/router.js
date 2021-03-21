class router {
	constructor(a,b,c,d) {
		this._init(a,b,c,d);
		this._powerON();
	}
	_powerON() { // Включить устройство
		if (this.__boot) { // Проверка BOOT накопителя
			let b_list = [];
			if (this.__boot.priority) { // Если есть BOOT запись накопителей
				for (var k in this.__boot.priority) { // Проверяем записи, и заменяем ID на интерфейсы
					let st = this.__boot.priority[k];
					if (typeof(st) == "string") {
						let intr = this.interfaces[st];
						if (!intr || intr.__type !== "storage") { // Если интерфейса не существует или интерфейс не является накопителем, сбрасываем записи
							b_list = [];
						} else {
							b_list.push(intr);
						}
					};
				};
			};

			if (!b_list.length) { // Если бут лист пустой, пытаемся сгенерить его
				let ints = this._getInterfacesByType("storage");
				for (var k in ints) {
					b_list.push(ints[k]);
				};
			};

			if (b_list.length) { // Если накопители с возможность загрузки, пытаемся их бутнуть
				this.b_list = b_list; 
				/*
		
					Здесь будет код с попыткой бута каждого носителя
					Так же надо откнуть b_list в BOOT секцию прямо с интерфейсами, а не просто ID, шобы потом проще было грузиться

				*/

			} else { // Если ничерта не нашли, ничего не делаем :/
				return false;
			};

		} else { // Если нет BOOT секции, то и не пытаемся его грузить, а вообще тут надо будет сделать генератор BOOT записи
			return false;
		}
	}
}
module.exports = router