const { WebSocketServer } = require("ws");
const { PORT, TURN_TIME } = require("./config");

const RoomManager = require("./rooms/RoomManager");
const handleCreateRoom = require("./handlers/CreateRoomHandler");
const handleJoinRoom = require("./handlers/JoinRoomHandler");

const wss = new WebSocketServer({ port: PORT });
const roomManager = new RoomManager(TURN_TIME);

console.log("WebSocket server running on port", PORT);

wss.on("connection", (ws) => {
	ws.on("message", (data) => {
		let msg;
		try {
			msg = JSON.parse(data.toString());
		} catch {
			return;
		}

		console.log("RECEIVED FROM CLIENT:", msg);

		switch (msg.type) {
			case "CREATE_ROOM":
				handleCreateRoom(ws, msg, roomManager);
				break;

			case "JOIN_ROOM":
				handleJoinRoom(ws, msg, roomManager);
				break;
			default:
				console.warn("Unknown message type:", msg.type);
		}
	});

	ws.on("close", () => {
		console.log("Client disconnected");
	});

	console.log("Client connected");
});
