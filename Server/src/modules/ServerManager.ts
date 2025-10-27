
import {
   // IAuthSocket,
   INumber, IString,
} from "../utils/interfaces";

import {
   Player,
} from "../classes/_Export";

import { Server,  Socket } from "socket.io";
import { Battle          } from "./_Export";


// =====================================================================
// ServerManager Class
// =====================================================================
export class ServerManager {

   ServerIO:    Server;

   socketsList: Map<string, Socket> = new Map();
   battlesList: Map<string, Battle> = new Map();
   playBatList: Map<string, string> = new Map();

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

      this.ServerIO = new Server(httpServer, {
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
   }

   
   // =====================================================================
   // Socket Connect / Disconnect
   // =====================================================================
   start() {
      this.ServerIO.on("connection", (socket) => {
         
         this.connect(socket);
         socket.on("disconnect",   () => this.disconnect(socket));

         socket.on("createBattle", (data: any) => this.createBattle(socket, data));
         socket.on("joinBattle",   (data: any) => this.joinBattle  (socket, data));
         socket.on("loadBattle",   (data: any) => this.loadBattle  (data));
      });
   }


   // =====================================================================
   // Methods
   // =====================================================================
   connect           (socket: Socket) {

      this.socketsList.set(socket.id, socket);
      socket.emit("connected");
      console.log({ connect: "--SocketIO-- Player Connected !" });
   }

   disconnect        (socket: Socket) {

      const { socketsList, battlesList, playBatList } = this;
      
      const playerID = socket.id;
      const battleID = playerID ? playBatList.get(playerID)        : null;
      const battle   = battleID ? battlesList.get(battleID)        : null;
      const player   = battle   ? battle.playersList.get(playerID) : null;

      if(!battle || !player) return;

      socketsList       .delete(playerID);
      battlesList       .delete(playerID);
      playBatList       .delete(playerID);
      battle.playersList.delete(playerID);
      
      console.log({ disconnect: "--SocketIO-- Player disconnected" });
   }

   generateBattleID  (): string { // ==> Need to add logic
      
      return "47";
   }

   createBattle      (
      socket: Socket,
      data:   any,
   ) {

      const { playerProps, mapSettings } = data;
      playerProps["socket"] = socket;

      const newBattle      = new Battle({
         ServerIO: this.ServerIO,
         id:       this.generateBattleID(),
         maxPop:   this.maxPopSpec [mapSettings.maxPop ],
         gridSize: this.mapSizeSpec[mapSettings.mapSize],
         playerProps,
      }), { id: battleID } = newBattle;

      this.battlesList.set(battleID, newBattle);
      this.playBatList.set(socket.id, battleID);
      
      socket.join(battleID);
      socket.emit("battleCreated", battleID); // Need to add Client logic
   }

   joinBattle        (
      socket: Socket,
      data:   any,
   ) {

      const { battleID, playerProps } = data;
      playerProps["socket"] = socket;

      const battle = this.battlesList.get(battleID);

      if(!battle) return console.log({ joinBattle: "No battle found !" });

      battle.createNewPlayer(playerProps);
      this.playBatList.set(socket.id, battleID);

      socket.join(battleID);
   }

   loadBattle        (data:   any) {
      const { battleID } = data;
      const battle = this.battlesList.get(battleID);

      if(!battle) return console.log({ loadBattle: "Could not load battle !" });
      
      battle.start();
   }

}