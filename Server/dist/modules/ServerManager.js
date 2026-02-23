"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerManager = void 0;
const socket_io_1 = require("socket.io");
const Battle_1 = require("./Battle");
// =====================================================================
// ServerManager Class
// =====================================================================
class ServerManager {
    ServerIO;
    socketsList = new Map();
    battlesList = new Map();
    playBatList = new Map();
    maxPopSpec = {
        _200: 200,
        _500: 500,
        _1000: 1000,
        _1500: 1500,
        _2000: 2000,
    };
    mapSizeSpec = {
        small: 2000,
        medium: 5000,
        big: 8000,
    };
    constructor(httpServer) {
        this.ServerIO = new socket_io_1.Server(httpServer, {
            cors: {
                origin: "https://empire-rising.netlify.app/",
                methods: ["GET", "POST", "PUT", "DELETE"],
                allowedHeaders: [
                    "Origin",
                    "X-Requested-With",
                    "Content",
                    "Accept",
                    "Content-Type",
                    "Authorization"
                ],
                credentials: true
            }
        });
    }
    // =====================================================================
    // Socket Connect / Disconnect
    // =====================================================================
    start() {
        this.ServerIO.on("connection", (socket) => {
            this.connect(socket);
            socket.on("disconnect", () => this.disconnect(socket));
            socket.on("createBattle", (data) => this.createBattle(socket, data));
            socket.on("joinBattle", (data) => this.joinBattle(socket, data));
            socket.on("loadBattle", (data) => this.loadBattle(data));
        });
    }
    // =====================================================================
    // Methods
    // =====================================================================
    connect(socket) {
        this.socketsList.set(socket.id, socket);
        socket.emit("connected");
        console.log({ connect: "--SocketIO-- Player Connected !" });
    }
    disconnect(socket) {
        const { socketsList, battlesList, playBatList } = this;
        const playerID = socket.id;
        const battleID = playerID ? playBatList.get(playerID) : null;
        const battle = battleID ? battlesList.get(battleID) : null;
        const player = battle ? battle.playersList.get(playerID) : null;
        if (!battle || !player)
            return;
        socketsList.delete(playerID);
        battlesList.delete(playerID);
        playBatList.delete(playerID);
        battle.playersList.delete(playerID);
        for (const unit of battle.unitsList.values()) {
            if (unit && unit.playerID === playerID)
                battle.unitsList.delete(unit.id);
        }
        console.log({ disconnect: "--SocketIO-- Player disconnected" });
    }
    generateBattleID() {
        return "47";
    }
    createBattle(socket, data) {
        const { playerProps, mapSettings } = data;
        playerProps["socket"] = socket;
        const newBattle = new Battle_1.Battle({
            ServerIO: this.ServerIO,
            id: this.generateBattleID(),
            maxPop: this.maxPopSpec[mapSettings.maxPop],
            gridSize: this.mapSizeSpec[mapSettings.mapSize],
            playerProps,
        }), { id: battleID } = newBattle;
        this.battlesList.set(battleID, newBattle);
        this.playBatList.set(socket.id, battleID);
        socket.join(battleID);
        socket.emit("battleCreated", battleID); // Need to add Client logic
    }
    joinBattle(socket, data) {
        const { battleID, playerProps } = data;
        playerProps["socket"] = socket;
        const battle = this.battlesList.get(battleID);
        if (!battle)
            return console.log({ joinBattle: "No battle found !" });
        battle.createNewPlayer(playerProps);
        this.playBatList.set(socket.id, battleID);
        socket.join(battleID);
    }
    loadBattle(data) {
        const { battleID } = data;
        const battle = this.battlesList.get(battleID);
        if (!battle)
            return console.log({ loadBattle: "Could not load battle !" });
        // ******************************************************
        // for(const [ playerID ] of this.playBatList) {
        //    const player = battle.playersList.get(playerID);
        //    if(!player) continue;
        //    player.teamID    = this.socketsList.size;
        //    player.teamColor = this.socketsList.size -1;
        // }
        // ******************************************************
        battle.start();
    }
}
exports.ServerManager = ServerManager;
