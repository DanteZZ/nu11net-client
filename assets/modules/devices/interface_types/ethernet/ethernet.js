class ethernet {
	up = true;
	events = {
		tx: {},
		rx: {}
	};
	constructor(a,b) {
		this._init(a,b) // Инициализация интерфейса
	}
}
module.exports = ethernet