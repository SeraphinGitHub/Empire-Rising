
import {
   // IAuthSocket,
   INumber,
} from "../utils/interfaces";

import {
   Player,
} from "../classes/_Export";

import { Server,  Socket } from "socket.io";
import { BattleManager   } from "./_Export";
import dotenv              from "dotenv";
dotenv.config();


// =====================================================================
// ServerManager Class
// =====================================================================
export class ServerManager {

   io:           Server;

   socketsList: Map<string, Socket       > = new Map();
   playBatList: Map<string, string       > = new Map();
   battlesList: Map<string, BattleManager> = new Map();
   
   syncRate:     number  = Math.floor(1000 / Number(process.env.FRAME_RATE));

   maxPopSpec:   INumber = {
      _200:      200,
      _500:      500,
      _1000:     1000,
      _1500:     1500,
      _2000:     2000,
   };

   mapSizeSpec:  INumber = {
      small:     2000,
      medium:    5000,
      big:       8000,
   };


   constructor(httpServer: any) {

      this.io = new Server(httpServer, {
         cors: {
            origin:         "https://empire-rising.netlify.app/",
            methods:        ["GET", "POST", "PUT", "DELETE"],
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

      this.start();
   }

   
   // =====================================================================
   // Socket Connect / Disconnect
   // =====================================================================
   start() {
      this.io.on("connection", (socket) => {
         socket.on("disconnect", () => this.disconnect(socket));

         socket.emit("connected");
         console.log({ message: "--SocketIO-- Player Connected !" });

         socket.on("createBattle", (data: any) => this.createBattle(socket, data));
         socket.on("joinBattle",   (data: any) => this.joinBattle  (socket, data));
         socket.on("loadBattle",   (data: any) => this.loadBattle  (        data));


         socket.on("createAgent",  (data: any) => this.createAgent(data)); // ==> TEST
      });
   }

   createAgent(data: any) {

      this.battleState("addNewAgent", "47", data);
   }


   // =====================================================================
   // Methods
   // =====================================================================
   disconnect(socket: Socket) {

      const { socketsList, playBatList, battlesList } = this;
      const userID = socket.id;

      const battleID    =            playBatList.get(userID);
      const battle      = battleID ? battlesList.get(battleID) : null;
      const playersList = battle   ? battle.playersList        : null;

      if(!battleID
      || !battle
      || !playersList
      || !playersList.has(userID)) {

         return;
      }

      socketsList.delete(userID);
      playersList.delete(userID);
      battlesList.delete(userID);
      playersList.delete(userID);
      
      console.log({ message: "--SocketIO-- Player disconnected" });
   }

   generateBattleID(): string { // ==> Need to add logic
      
      return "47";
   }

   createBattle(socket: Socket, data: any) {

      const { mapSettings, ...playerProps } = data;

      const newBattle      = new BattleManager({
         id:       this.generateBattleID(),
         maxPop:   this.maxPopSpec [mapSettings.maxPop ],
         gridSize: this.mapSizeSpec[mapSettings.mapSize],

      }), { id: battleID } = newBattle;

      const newPlayer      = new Player({
         id: socket.id,
         battleID,
         ...playerProps
      }), { id: playerID } = newPlayer;

      newBattle.addNewPlayer(newPlayer);

      this.playBatList.set(playerID, battleID);
      this.battlesList.set(battleID, newBattle);
      
      socket.join(battleID);
      socket.emit("battleCreated", battleID); // Need to add Client logic
   }

   joinBattle(socket: Socket, data: any) {

      const { battleID, ...playerProps } = data;
      const battle = this.battlesList.get(battleID);

      if(!battle) return console.log({ error: "No battle found !" });

      const newPlayer      = new Player({
         id: socket.id,
         ...playerProps
      }), { id: playerID } = newPlayer;

      battle.addNewPlayer(newPlayer);

      this.playBatList.set(playerID, battleID);
      socket.join(battleID);
   }

   loadBattle(data: any) {

      const { battleID } = data;
      const battle = this.battlesList.get(battleID);

      if(!battle) return console.log({ error: "No battle found !" });

      this.battleState("initBattle", battleID, battle.initPack());
   }

   battleState(
      channel:  string,
      battleID: string,
      dataPack: any,
   ) {
      this.io.to(battleID).emit(channel, dataPack);
   }


}