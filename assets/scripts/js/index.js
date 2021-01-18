const _vm = require("vm");
const _fs = require("fs");
const _util = require("util");


// Create Seemple objects
var BIOS = new Vue({
  el: '#__bios',
  data: {
    title: "HIOS - Настройка CMOS",
	footer: "v0.1 (C) Copyright 2015-2021, H4CK-IT, Inc",
	selItem: 0,
	selSection: 0,
	menuList: [
		{
			title: "Основное",
			defaultSections:"auth",
			sections:[
				{
					title:"Авторизация",
					action:function(){
						alert("Авторизация");
					}
				}
			]
		},
		{
			title: "Настройки",
			defaultSections:"auth",
			sections:[
				{
					title:"Авторизация",
					action:function(){
						alert("Авторизация");
					}
				}
			]
		}
	]
  },
  mounted: function() {
  	// Проверка нажати клавиш
  	this.onkeyup = window.addEventListener('keyup', function(e) {
  		let b = BIOS;
  		if (e.which == "39") {//Right arrow
  			if (b.selItem+1 == b.menuList.length) { b.selItem = 0;} else {b.selItem++;};
  		} else if (e.which == "37") {//Right arrow
  			if (b.selItem-1 == -1) { b.selItem = b.menuList.length-1;} else {b.selItem--;};
  		};
  	});
  }
});