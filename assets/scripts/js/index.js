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
					title:"Авторизация 2",
					action:function(){
						console.log(this);
					}
				},
				{
					title:"Авторизация 2",
					action:function(){
						alert("Авторизация");
					}
				},
				{
					title:"Авторизация 2",
					action:function(){
						alert("Авторизация");
					}
				}
			]
		}
	]
  },

  methods: {
  	enterSection: function(section) {
  		section.action();
  	}
  },

  mounted: function() {
  	// Проверка нажати клавиш
  	this.onkeyup = window.addEventListener('keyup', function(e) {
  		let b = BIOS;
  		if (e.which == 39) {//Right arrow
  			if (b.selItem+1 == b.menuList.length) { b.selItem = 0;} else {b.selItem++;};
  			b.selSection = 0;
  		} else if (e.which == 37) {//Left arrow
  			if (b.selItem-1 == -1) { b.selItem = b.menuList.length-1;} else {b.selItem--;};
  			b.selSection = 0;
  		};
  		if (e.which == 40) {//Down arrow
  			if (b.selSection+1 == b.menuList[b.selItem].sections.length) { b.selSection = 0;} else {b.selSection++;};
  		} else if (e.which == 38) {//Up arrow
  			if (b.selSection-1 == -1) { b.selSection = b.menuList[b.selItem].sections.length-1;} else {b.selSection--;};
  		};

  		if (e.which == 13) {//Enter
  			b.enterSection(b.menuList[b.selItem].sections[b.selSection]);
  		}
  	});
  }
});