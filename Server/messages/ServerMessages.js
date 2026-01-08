function roomJoined(roomID, yourMarker, opponentMarker) {
	return {
		type: "ROOM_JOINED",
		roomID,
		yourMarker,
		opponentMarker,
	};
}

function gameState(room) {
	return {
		type: "GAME_STATE",
		board: room.board,
		currentTurn: room.currentTurn,
		timeLeft: room.timeLeft,
		gameResult: room.gameResult,
	};
}

module.exports = {
	roomJoined,
	gameState,
};
