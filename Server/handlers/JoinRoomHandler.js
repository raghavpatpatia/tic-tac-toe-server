const { gameState, roomJoined } = require("../messages/ServerMessages");

function handleJoinRoom(ws, message, roomManager) {
	const { roomID } = message;
	const room = roomManager.getRoom(roomID);
	if (!room) {
		ws.send(JSON.stringify({ type: "ERROR", message: "Room not found" }));
		return;
	}
	const marker = room.addPlayer(ws);
	if (!marker) {
		ws.send(JSON.stringify({ type: "ERROR", message: "Room full" }));
		return;
	}
	ws.roomID = roomID;
	ws.marker = marker;

	const opponentMarker = marker === "X" ? "O" : "X";

	ws.send(JSON.stringify(roomJoined(roomID, marker, opponentMarker)));
	room.broadcast(gameState(room));
}

module.exports = handleJoinRoom;
