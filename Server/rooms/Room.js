class Room {
	constructor(roomID, creatorSocket, creatorMarker, boardFactory, turnTime) {
		const opponentMarker = creatorMarker == "X" ? "O" : "X";

		this.roomID = roomID;
		this.players = {
			[creatorMarker]: creatorSocket,
			[opponentMarker]: null,
		};
		this.board = boardFactory();
		this.currentTurn = Math.random() < 0.5 ? "X" : "O";
		this.timeLeft = turnTime;
		this.gameResult = "NONE";
	}

	addPlayer(socket) {
		if (this.players.X === null) {
			this.players.X = socket;
			return "X";
		}
		if (this.players.O === null) {
			this.players.O = socket;
			return "O";
		}
		return null;
	}

	broadcast(message) {
		Object.values(this.players).forEach((p) => {
			if (p) p.send(JSON.stringify(message));
		});
	}
}

module.exports = Room;
