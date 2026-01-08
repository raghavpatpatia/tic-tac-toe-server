const Room = require("./Room");
const { createEmptyBoard } = require("../utils/BoardFactory");

class RoomManager {
	constructor(turnTime) {
		this.rooms = {};
		this.turnTime = turnTime;
	}

	createRoom(roomID, ws, marker) {
		if (this.rooms[roomID]) return null;
		const room = new Room(roomID, ws, marker, createEmptyBoard, this.turnTime);
		this.rooms[roomID] = room;
		return room;
	}

	getRoom(roomID) {
		return this.rooms[roomID];
	}
}

module.exports = RoomManager;
