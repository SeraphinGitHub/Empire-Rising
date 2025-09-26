
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
      
      this.id        = params.id;
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

   start(battle: Battle) {

      this.maxPop = battle.setPlayerMaxPop();
   
      this.socket.emit("initBattle", {
         gridPack:   battle.Grid.initPack(),
         battlePack: battle.initPack(),
         playerPack: this.initPack(),
      });

      this.watch(battle);
   }
   
   watch(battle: Battle) {
      
      this.socket.on("recruitUnit",  (data: any) => this.recruitUnit(battle, data));
      this.socket.on("startAgentPF", (data: any) => battle.startAgentPF(data));

      this.TEST_Unit(battle); // ==> Test ******************
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   recruitUnit(
      battle: Battle,
      data:   any,
   ) {
      
      // Add "create unit timer" here ==> Later on !

      const { unitID, cellID } = data;
      const newUnit = this.createNewAgent(battle, unitID, cellID);

      battle.spread("recruitUnit", newUnit);
   }

   createNewAgent(
      battle: Battle,
      unitID: string,
      cellID: string,
   ) {
      const agentStats: any    = UNIT_STATS[unitID],      { popCost            } = agentStats;      
      const startCell:  Cell   = battle.getCell(cellID)!, { x: cellX, y: cellY } = startCell.center;
      const vacantID:   number = battle.vacantIDsList[0];

      startCell.agentIDset.add(vacantID);
      startCell.isVacant = false;

      battle.Grid.addToOccupiedMap(startCell);
      battle.vacantIDsList.splice(0, popCost);
      battle.curPop += popCost;
      this.curPop   += popCost;

      const newAgent = new Agent({
         id:         vacantID,
         playerID:   this.id,
         teamID:     this.teamID,
         teamColor:  this.teamColor,
         stats:      agentStats,
         position: { x: cellX, y: cellY }, // ==> Tempory until create rally point !
         curCell:    startCell,            // ==> Tempory until create BuildingsClass with spawn position
      });
      
      battle.unitsList.set(vacantID, newAgent);

      this.socket.emit("updatePop", this.curPop);

      return newAgent.initPack();
   }


   // =========================================================================================
   // TEST
   // =========================================================================================
   TEST_Unit(battle: Battle) {

      if(this.teamID === 1) {
         this.recruitUnit(battle, { unitID: "_0101", cellID: "17-21" });
         this.recruitUnit(battle, { unitID: "_0101", cellID: "19-21" });
         this.recruitUnit(battle, { unitID: "_0101", cellID: "21-21" });
         this.recruitUnit(battle, { unitID: "_0101", cellID: "20-23" });
         this.recruitUnit(battle, { unitID: "_0101", cellID: "18-23" });
      }

      if(this.teamID === 2) {
         this.recruitUnit(battle, { unitID: "_0101", cellID: "17-27" });
         this.recruitUnit(battle, { unitID: "_0101", cellID: "19-27" });
         this.recruitUnit(battle, { unitID: "_0101", cellID: "21-27" });
         this.recruitUnit(battle, { unitID: "_0101", cellID: "20-29" });
         this.recruitUnit(battle, { unitID: "_0101", cellID: "18-29" });
      }

      this.socket.emit("updatePop",  this.curPop);
   }

}