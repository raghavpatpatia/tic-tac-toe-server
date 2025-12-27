const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log("WebSocket server running on port", PORT);

// In-memory room storage
const rooms = {};

wss.on("connection", (ws) => {
	console.log("Client connected");

	ws.on("message", (data) => {
		const msg = JSON.parse(data);

		switch (msg.type) {
			case "CREATE_ROOM":
				rooms[msg.roomId] = {
					players: [ws],
					state: Array(9).fill(null),
					turn: "X",
				};
				ws.roomId = msg.roomId;
				ws.send(JSON.stringify({ type: "ROOM_CREATED" }));
				break;

			case "JOIN_ROOM":
				const room = rooms[msg.roomId];
				if (!room || room.players.length >= 2) {
					ws.send(JSON.stringify({ type: "ERROR", message: "Room full or not found" }));
					return;
				}
				room.players.push(ws);
				ws.roomId = msg.roomId;
				room.players.forEach((p) => p.send(JSON.stringify({ type: "GAME_START", state: room.state })));
				break;

			case "MAKE_MOVE":
				const r = rooms[ws.roomId];
				if (!r) return;

				r.state[msg.index] = msg.marker;
				r.turn = r.turn === "X" ? "O" : "X";

				r.players.forEach((p) =>
					p.send(
						JSON.stringify({
							type: "STATE_UPDATE",
							state: r.state,
							turn: r.turn,
						})
					)
				);
				break;
		}
	});

	ws.on("close", () => {
		console.log("Client disconnected");
	});
});
