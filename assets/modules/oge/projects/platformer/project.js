{
	sprites:{
		hero_down: {
			src:"/sprites/hero_down.png",
			frames:4,
			speed:0.5,
			center_x:64,
			center_y:64
		},
		hero_up: {
			src:"/sprites/hero_up.png",
			frames:4,
			speed:0.5,
			center_x:64,
			center_y:64
		},
		hero_right: {
			src:"/sprites/hero_right.png",
			frames:4,
			speed:0.5,
			center_x:64,
			center_y:64
		},
		hero_left: {
			src:"/sprites/hero_left.png",
			frames:4,
			speed:0.5,
			center_x:64,
			center_y:64
		},
		wall: {
			src:"/sprites/wall.png",
			center_x:0,
			center_y:0
		}
	},
	scenes:{
		room: "/scenes/room.js"
	},
	objects:{
		hero: "/objects/hero.js",
		wall: "/objects/wall.js",
	},
	cameras:{
		default:{
			width:0,
			height:0
		}
	},

	FPSLimit:0,
	defaultScene:"room"
}