
import {
   // IAuthSocket,
   INumber,
} from "../utils/interfaces";

import {
   Player,
   Battle,
} from "../classes/_Export";

import { Server,  Socket } from "socket.io";
import { unitParams      } from "../utils/unitParams";
import dotenv              from "dotenv";
dotenv.config();


// =====================================================================
// ServerManager Class
// =====================================================================
export class ServerManager {

   socketsList:  Map<string, Socket> = new Map<string, Socket>();
   playersList:  Map<string, Player> = new Map<string, Player>();
   battlesList:  Map<string, Battle> = new Map<string, Battle>();
   
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

   
   // =====================================================================
   // Socket Connect / Disconnect
   // =====================================================================
   start(httpServer:  any) {

      const serverIO: Server = new Server(httpServer, {
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

      serverIO.on("connection", (socket) => this.connect(socket));
   }

   connect(socket: Socket) {

      const eventList: { [key: string]: (data: any) => void } = {
         "disconnect": () => this.disconnect(socket),
         "initClient": () => this.initClient(socket),
      };
      
      for(const [ channel, callback ] of Object.entries(eventList)) {
         socket.on(channel, callback);
      }

      const userID = socket.id;

      this.socketsList.set(userID, socket);
      this.playersList.set(userID, new Player(userID));

      socket.emit("connected");
      console.log("Player Connected --SocketIO");
   }


   // =====================================================================
   // Socket Methods
   // =====================================================================
   disconnect(socket: Socket) {

      const { socketsList, playersList, battlesList } = this;
      const userID = socket.id;

      const player      =          playersList.get(userID);
      const battle      = player ? battlesList.get(player.battleID) : null;
      const playID_List = battle ? battle.playID_List               : null;

      if(!player
      || !battle
      || !playID_List
      || !playID_List.has(userID)) {

         return;
      }

      socketsList.delete(userID);
      playersList.delete(userID);
      battlesList.delete(userID);
      playID_List.delete(userID);
      
      console.log("Player disconnected --SocketIO");
   }

   initClient(socket: Socket) {

      console.log("Game is starting !");
      socket.emit("startGame");
   }


   // =====================================================================
   // Methods
   // =====================================================================
   setPlayer(
      battleID:    string,
      playerInfos: any,
   ): Player {

      const { id, name, faction } = playerInfos;

      const player = this.playersList.get(id)!;

      player.battleID = battleID;
      player.name     = name;
      player.faction  = faction;

      this.playersList.set(id, player);

      return player;
   }

   createBattle(params: any) {

      const { id: battleID, playersList } = params;

      const newBattle = new Battle({
         id:       battleID,
         maxPop:   this.maxPopSpec [params.maxPop ],
         gridSize: this.mapSizeSpec[params.mapSize],
      });

      for(const playerInfos of playersList) {
         
         const player = this.setPlayer(battleID, playerInfos), { id: playerID } = player;
         newBattle.playID_List.add(playerID);
      }

      this.battlesList.set(battleID, newBattle);
   }

   startBattle(battleID: string) {

      const battle = this.battlesList.get(battleID)!;
      battle.start();
   }


}