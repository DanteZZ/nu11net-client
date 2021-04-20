{
	sprites:{
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
		},
		old_pc: {
			src:"/sprites/old_pc.png",
			frames:2,
			speed:0.5,
			center_x:104,
			center_y:66
		},
		old_router: {
			src:"/sprites/old_router.png",
			frames:2,
			speed:0.5,
			center_x:46,
			center_y:26
		}
	},
	scenes:{
		room: "/scenes/room.js"
	},
	objects:{
		hero: "/objects/hero.js",
		wall: "/objects/wall.js",
		device: "/objects/device.js"
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