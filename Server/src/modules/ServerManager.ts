
import {
   // IAuthSocket,
   INumber,
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
   playersList: Map<string, Player> = new Map();
   battlesList: Map<string, Battle> = new Map();

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
         socket.on("loadBattle",   (data: any) => this.loadBattle  (socket, data));
      });
   }


   // =====================================================================
   // Methods
   // =====================================================================
   connect(socket: Socket) {

      this.socketsList.set(socket.id, socket);
      socket.emit("connected");
      console.log({ message: "--SocketIO-- Player Connected !" });
   }

   disconnect(socket: Socket) {

      const { socketsList, playersList, battlesList } = this;
      const userID = socket.id;

      const player =          playersList.get(userID);
      const battle = player ? battlesList.get(player.id) : null;

      if(!player
      || !battle
      || !playersList.has(userID)) {

         return;
      }

      playersList.delete(userID);
      battlesList.delete(userID);
      socketsList.delete(userID);
      
      console.log({ message: "--SocketIO-- Player disconnected" });
   }

   generateBattleID(): string { // ==> Need to add logic
      
      return "47";
   }

   createBattle(
      socket: Socket,
      data:   any,
   ) {

      const { mapSettings, ...playerProps } = data;

      const newBattle      = new Battle({
         ServerIO: this.ServerIO,
         id:       this.generateBattleID(),
         maxPop:   this.maxPopSpec [mapSettings.maxPop ],
         gridSize: this.mapSizeSpec[mapSettings.mapSize],
      }), { id: battleID } = newBattle;

      const newPlayer = newBattle.createNewPlayer(socket, playerProps), { id: playerID } = newPlayer;

      this.playersList.set(playerID, newPlayer);
      this.battlesList.set(battleID, newBattle);

      
      socket.join(battleID);
      socket.emit("battleCreated", battleID); // Need to add Client logic
   }

   joinBattle  (
      socket: Socket,
      data:   any,
   ) {

      const { battleID, ...playerProps } = data;
      const battle = this.battlesList.get(battleID);

      if(!battle) return console.log({ error: "No battle found !" });

      const newPlayer = battle.createNewPlayer(socket, playerProps), { id: playerID } = newPlayer;

      this.playersList.set(playerID, newPlayer);
      socket.join(battleID);
   }

   loadBattle  (
      socket: Socket,
      data:   any,
   ) {
      const { battleID } = data;
      const battle = this.battlesList.get(battleID);
      const player = this.playersList.get(socket.id);

      if(!battle || !player) return console.log({ error: "Could not load battle !" });
      
      player.watch(battle);
   }

}