
import {
   // IAuthSocket,
   IPlayerClass
} from "../utils/interfaces";

import { appServer }       from "../_Server";
import { PlayerClass }     from "../classes/_Export";
import { Server, Socket }  from "socket.io";
// import jwt                 from "jsonwebtoken";
import dotenv              from "dotenv";
dotenv.config();


// =====================================================================
// Variables
// =====================================================================
const socketIO:   Server                   = new Server(appServer);
const socketsMap: Map<number, Socket>      = new Map<number, Socket>();
const playersMap: Map<number, PlayerClass> = new Map<number, PlayerClass>();
// const syncRate:   number              = Math.floor(1000 / Number(process.env.FRAME_RATE));


// =====================================================================
// TEST --- Variables
// =====================================================================
let userID = 0;

const battle_1 = {
   id: 12,
   hostPlayerID: 2,
   playersList:  {} as IPlayerClass,
}

const user_1 = {
   id:    1,
   name: "Arckrøn",
};

const user_2 = {
   id:    2,
   name: "Belphegor",
};

const user_3 = {
   id:    3,
   name: "Gorgoroth",
};

const setUser = () => {

   userID++;

   if(userID > 3) userID = 1;
   
   if(userID === 1 ) return user_1;
   if(userID === 2 ) return user_2;
   if(userID === 3 ) return user_3;
}


// =====================================================================
// SocketIO Connect
// =====================================================================
const connectPlayer = (socket: any) => {
   console.log("Player Connected");
   
   const user = setUser();

   const Player: PlayerClass = new PlayerClass(user);
   
   socket.id = user!.id;

   socketsMap.set(user!.id, socket);
   playersMap.set(user!.id, Player);

   battle_1.playersList[user!.id] = Player;
}


// =====================================================================
// SocketIO Disconnect
// =====================================================================
const disconnectPlayer = (socket: any) => {
   socket.on("disconnect", () => {

      const playerID: number = socket.id;
      
      if(socketsMap.get(playerID) === undefined
      || playersMap.get(playerID) === undefined) {
         return;
      }

      playersMap.delete(playerID);
      socketsMap.delete(playerID);
      
      console.log("Player disconnected");
   });
}


// =====================================================================
// Methods
// =====================================================================
const updateAll_Players = () => {

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

const sendSyncPack = () => {
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

const sync = () => {

   // setInterval(() => {

   //    this.updateAll_Players();
   //    this.sendSyncPack();

   // }, this.syncRate);
}


// =====================================================================
// Export Manager
// =====================================================================
export const Manager = {

   start() {
      socketIO.on("connection", (socket) => {
      
         connectPlayer   (socket);
         disconnectPlayer(socket);
      });
   },

}