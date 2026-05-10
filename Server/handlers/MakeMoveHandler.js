const { checkWinner } = require("../utils/WinChecker");
const { gameState } = require("../messages/ServerMessages");

function handleMakeMove(ws, msg, roomManager) {
	const { index } = msg;
	const roomID = ws.roomID;
	const room = roomManager.getRoom(roomID);

	if (!room) return;
	if (room.gameResult !== "NONE") return;
	if (index < 0 || index > 8) return;

	const playerMarker = room.getPlayerMarker(ws);
	if (!playerMarker) return;
	if (room.currentTurn !== playerMarker) return;
	if (room.board[index] !== null) return;

	room.board[index] = playerMarker;

	const winner = checkWinner(room.board);

	if (winner === "DRAW") {
		room.gameResult = "DRAW";
	} else if (winner) {
		room.gameResult = winner === playerMarker ? "WIN" : "LOSE";
	}

	room.currentTurn = room.currentTurn === "X" ? "O" : "X";

	room.timeLeft = room.timeLeft;

	room.broadcast(gameState(room));
}

module.exports = handleMakeMove;
