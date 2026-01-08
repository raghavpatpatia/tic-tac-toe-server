const { roomJoined, gameState } = require("../messages/ServerMessages");

function handleCreateRoom(ws, msg, roomManager) {
	const { roomID, userMarker } = msg;
	const room = roomManager.createRoom(roomID, ws, userMarker);
	if (!room) {
		ws.send(JSON.stringify({ type: "ERROR", message: "Room already exists" }));
		return;
	}
	ws.roomID = roomID;
	ws.userMarker = userMarker;

	const opponentMarker = userMarker == "X" ? "O" : "X";

	ws.send(JSON.stringify(roomJoined(roomID, userMarker, opponentMarker)));
	room.broadcast(gameState(room));
}

module.exports = handleCreateRoom;
