
import {
   // IAuthSocket,
   IPlayer,
} from "../utils/interfaces";

import {
   User,
   Player,
   Grid,
} from "../classes/_Export";

import { unitParams } from "../utils/unitParams";
import { Socket     } from "socket.io";
import jwt            from "jsonwebtoken";
import dotenv         from "dotenv";
dotenv.config();



// =====================================================================
// Manager Class
// =====================================================================
export class Manager {

   socketsMap: Map<number, Socket> = new Map<number, Socket>();
   playersMap: Map<number, Player> = new Map<number, Player>();
   syncRate:   number              = Math.floor(1000 / Number(process.env.FRAME_RATE));

   Grid: Grid;

   constructor() {
      
      this.Grid = new Grid();
   }
   
   start(socket: Socket) {
      this.connectPlayer   (socket);
      this.disconnectPlayer(socket);
      // sync(socket);
   }


   // =====================================================================
   // SocketIO Connect
   // =====================================================================
   connectPlayer(socket: any) {
   
      console.log("Player Connected --SocketIO");
      socket.emit("connected");

      socket.on("getParams", () => {
         socket.emit("sendParams", unitParams);
      });
   
      socket.on("startGame", (data: any) => {
         const { socketsMap, playersMap } = this;
   
         const userID: number = socket.id;
         const user:   User   = new User  ({ id: userID, name: data.name }); // For DB save ==> later
         const player: Player = new Player(user);
   
         socketsMap.set(userID, socket);
         playersMap.set(userID, player);

         this.Grid.init(data);
      });
   }
   
   
   // =====================================================================
   // SocketIO Disconnect
   // =====================================================================
   disconnectPlayer(socket: any) {
      socket.on("disconnect", () => {
         const { socketsMap, playersMap } = this;
   
         const userID: number = socket.id;
         
         if(!socketsMap.get(userID) || !playersMap.get(userID)) return;
   
         playersMap.delete(userID);
         socketsMap.delete(userID);
         
         console.log("Player disconnected --SocketIO");
      });
   }
   
   
   // =====================================================================
   // Methods
   // =====================================================================
   updateAll_Players() {
   
      // cyclePlayersMap((socket, player, playerID) => {
   
      //    player.update(socketList);
   
      //    cyclePlayersMap((unSocket, unPlayer, otherPlayerID) => {
      //       if(playerID !== otherPlayerID) {
      //          let otherPlayer = playersList[playerID];
   
      //          player.enterViewport(otherPlayer, socket, () => {
      //             if(!player.detectPlayersList[playerID]) player.detectPlayersList[playerID] = otherPlayer;
      //             if(!player.renderPlayersList[playerID]) player.renderPlayersList[playerID] = otherPlayer.lightPack();
   
      //          }, () => {
      //             if(player.detectPlayersList[playerID]) delete player.detectPlayersList[playerID];
      //             if(player.renderPlayersList[playerID]) delete player.renderPlayersList[playerID];
      //          });
      //       }
      //    });
      // });
   }
   
   sendSyncPack() {
      // ===================================
      // Sending Light Packs
      // ( Update: Enemies, Players, NPCs only inside Client viewport )
      // ===================================
   
      // this.cyclePlayersMap((socket, player) => {
      //    socket.emit("serverSync", player.renderPlayersList, player.renderMobsList);
   
      //    player.renderPlayersList = {};
      //    player.renderMobsList    = {};
      // });
   }
   
   sync(socket: Socket) {
   
      setInterval(() => {
   
         // this.updateAll_Players();
         // this.sendSyncPack();
         
         socket.emit("sync", { playerID: 123, success: true, message: "syncEvent" });
   
      }, 1000);
   }

}