{
	sprites:{
		hero_right: {
			src:"/sprites/hero_right.png",
			center_x:51,
			center_y:188
		},
		hero_left: {
			src:"/sprites/hero_left.png",
			center_x:51,
			center_y:188
		},
		wall: {
			src:"/sprites/wall.png",
			center_x:0,
			center_y:0
		},
		device_pc: {
			src:"/sprites/device_pc.png",
			frames:2,
			speed:0.5,
			center_x:81,
			center_y:102
		},
		device_router: {
			src:"/sprites/device_router.png",
			frames:2,
			speed:0.5,
			center_x:37,
			center_y:42
		}
	},
	backgrounds:{
		room_0: {
			src:"/sprites/room_0.png"
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