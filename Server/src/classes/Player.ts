
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

   yield:     INumber = {
      food:    0,
      stone:   0,
      wood:    0,
      coal:    0,
      ironOre: 0,
      ironBar: 0,
      goldOre: 0,
      goldBar: 0,
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
         yield:      this.yield,
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

      const { popCost, initPack } = battle.createNewAgent(data, this.id);

      this.updatePop(popCost);

      battle.spread("recruitUnit", initPack);
   }

   updateYield(yieldType: number) {
      
      switch(yieldType) {
         case 1: this.yield.food    ++; break;
         case 2: this.yield.stone   ++; break;
         case 3: this.yield.wood    ++; break;
         case 4: this.yield.coal    ++; break;
         case 5: this.yield.ironOre ++; break;
         case 6: this.yield.ironBar ++; break;
         case 7: this.yield.goldOre ++; break;
         case 8: this.yield.goldBar ++; break;
      }

      this.socket.emit("updateYield", this.yield);
   }

}