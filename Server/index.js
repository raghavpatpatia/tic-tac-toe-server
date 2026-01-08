const WebSocket = require("ws");
const { PORT, TURN_TIME } = require("./config");

const RoomManager = require("./rooms/RoomManager");
const handleCreateRoom = require("./handlers/CreateRoomHandler");
const handleJoinRoom = require("./handlers/JoinRoomHandler");

const wss = WebSocket.Server({ port: PORT });
const roomManager = new RoomManager(TURN_TIME);

console.log("WebSocket server running on port", PORT);

wss.on("connection", (ws) => {
	ws.on("message", (data) => {
		let msg;
		try {
			JSON.parse(data);
		} catch {
			return;
		}

		switch (msg.type) {
			case "CREATE_ROOM":
				handleCreateRoom(ws, msg, roomManager);
				break;

			case "JOIN_ROOM":
				handleJoinRoom(ws, msg, roomManager);
				break;
		}
	});

	ws.on("close", () => {
		console.log("Client disconnected");
	});
});
