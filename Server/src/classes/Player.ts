
import {
   Agent,
   Cell,
} from "../classes/_Export";

import { Server, Socket } from "socket.io";
import { BattleManager  } from "modules/BattleManager";
import { UNIT_STATS     } from "../utils/unitStats";


// =====================================================================
// Player Class
// =====================================================================
export class Player {
   
   id:        string;
   battleID:  string;
   name:      string;
   teamColor: string;

   team:      number;
   maxPop:    number = 0;
   curPop:    number = 0;
   
   unitsList: Map<number, Agent   > = new Map();
   // buildList: Map<number, Building> = new Map();

   constructor(params: any) {
      
      this.id        = params.id;
      this.battleID  = params.battleID;
      this.name      = params.name;
      this.teamColor = params.teamColor;
      this.team      = params.team;

      this.init();
   }

   init() {
      
      // ******************** TEST ********************
      // if(this.team === 1) { 
      //    BM.createNewAgent(this, "_0101", "17-21");
      //    BM.createNewAgent(this, "_0101", "19-21");
      //    BM.createNewAgent(this, "_0101", "21-21");
      //    BM.createNewAgent(this, "_0101", "20-23");
      //    BM.createNewAgent(this, "_0101", "18-23");
      // }

      // if(this.team === 2) {
      //    BM.createNewAgent(this, "_0101", "17-27");
      //    BM.createNewAgent(this, "_0101", "19-27");
      //    BM.createNewAgent(this, "_0101", "21-27");
      //    BM.createNewAgent(this, "_0101", "20-29");
      //    BM.createNewAgent(this, "_0101", "18-29");
      // }
      // ******************** TEST ********************
   }

   watch(
      ServerIO: Server,
      socket:   Socket,
      battle:   BattleManager,
   ) {
      this.setMaxPop(battle);
      socket.emit("initBattle", battle.initPack());

      socket.on("recruitUnit", (data: any) => this.recruitUnit(ServerIO, battle, data));
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   setMaxPop(battle: BattleManager) {
      this.maxPop = battle.getMaxPop();
   }

   recruitUnit(
      ServerIO: Server,
      battle:   BattleManager,
      data:     any,
   ) {
      
      // Add create unit timer here ==> Later on !

      const { unitID, cellID } = data;
      const newUnit = this.createNewAgent(battle, unitID, cellID);

      ServerIO.to(battle.id).emit("unitRecruited", newUnit);
   }

   createNewAgent(
      battle: BattleManager,
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
         team:       this.team,
         teamColor:  this.teamColor,
         stats:      agentStats,
         position: { x: cellX, y: cellY }, // ==> Tempory until create rally point !
         curCell:    startCell,            // ==> Tempory until create BuildingsClass with spawn position
      });
      
      this.unitsList.set(vacantID, newAgent);

      return newAgent.initPack();
   }

}