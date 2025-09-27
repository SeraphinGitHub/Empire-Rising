
import {
   Agent,
   Cell,
} from "../classes/_Export";

import { Server, Socket } from "socket.io";
import { Battle         } from "modules/Battle";
import { UNIT_STATS     } from "../utils/unitStats";
import { INumber } from "utils/interfaces";


// =====================================================================
// Player Class
// =====================================================================
export class Player {
   
   private socket: Socket;
   
   id:        string;
   battleID:  string;
   name:      string;
   teamColor: string;

   teamID:    number;
   maxPop:    number = 0;
   curPop:    number = 0;

   ressources: INumber = {
      food:    100,
      stone:   50,
      wood:    75,
      coal:    200,
      ironOre: 150,
      ironBar: 0,
      goldOre: 60,
      goldBar: 20,
   }

   constructor(params: any) {
      
      this.id        = params.socket.id;
      this.socket    = params.socket;
      this.battleID  = params.battleID;
      this.name      = params.name;
      this.teamColor = params.teamColor;
      this.teamID    = params.teamID;
   }


   initPack() {
      return {
         name:       this.name,
         teamID:     this.teamID,
         teamColor:  this.teamColor,
         ressources: this.ressources,
      }
   }

   watch(battle: Battle) {
      
      this.socket.on("recruitUnit",  (data: any) => this.recruitUnit    (data, battle));
      this.socket.on("startAgentPF", (data: any) => battle.startAgentPF (data));
   }
   
   // =========================================================================================
   // Methods
   // =========================================================================================
   initBattle(
      gridPack:   any,
      battlePack: any,
   ) {
      
      this.socket.emit("initBattle", {
         gridPack,
         battlePack,
         playerPack: this.initPack(),
      });
   }

   updatePop(popCost: number) {
      
      this.curPop += popCost;
      this.socket.emit("updatePop", this.curPop);
   }

   recruitUnit(
      data:   any,
      battle: Battle,
   ) {

      const { popCost, initPack } = battle.createNewAgent(data);

      this.updatePop(popCost);

      battle.spread("recruitUnit", initPack);
   }

}