
import { Socket  } from "socket.io";
import { Battle  } from "../modules/Battle";
import { INumber } from "../utils/interfaces";


// =====================================================================
// Player Class
// =====================================================================
export class Player {
   
   private socket:   Socket;
   
   id:               string;
   battleID:         string;
   name:             string;
   
   buildsID_List:    Map<number, {name: string, cellID: string}> = new Map<number, {name: string, cellID: string}>();
   
   teamID:           number;
   teamColor:        number;
   maxPop:           number  = 0;
   curPop:           number  = 0;

   yield:            INumber = {
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
      
      this.socket.on("recruitUnit",   (data: any) => this.recruitUnit    (data, battle));
      this.socket.on("placeBuilding", (data: any) => this.placeBuilding  (data, battle));
      this.socket.on("placeWall",     (data: any) => this.placeWall      (data, battle));
      this.socket.on("startAgentPF",  (data: any) => battle.startAgentPF (data));
   }
   
   // =========================================================================================
   // Methods
   // =========================================================================================
   initBattle(
      gridPack:   any,
      battlePack: any,
   ) {
      
      for(const { id, name, teamID, cellID } of battlePack.buildsList) {
         
         if(teamID === this.teamID) this.buildsID_List.set(id, {name, cellID});
      }

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

   placeBuilding(
      data:   any,
      battle: Battle,
   ) {
      const { ghostZone } = data;

      const hasBlocked = ghostZone.some((cellID: string) => {
         const cell    = battle.getCell(cellID);
         return !cell || cell.isBlocked
      });

      if(hasBlocked) return;

      const result = battle.createNewBuilding(data, this.id);

      if(!result) return;
      
      battle.spread("placeBuilding", result.initPack);
      battle.spread("updateCells",   {
         cellsIDlist: result.footPrint,
         property:   "isBlocked",
         state:       true,
      });
   }

   placeWall(
      data:   any,
      battle: Battle,
   ) {
      const { wallsListID } = data;
      
      for(const cellID of wallsListID) {
         const cell = battle.getCell(cellID);
         
         if(cell?.isBlocked) continue;
         
         const result = battle.createNewBuilding({ buildType: "wall", cellID }, this.id);
   
         if(!result) return;
         
         battle.spread("placeBuilding", result.initPack);
         battle.spread("updateCells",   {
            cellsIDlist: result.footPrint,
            property:   "isBlocked",
            state:       true,
         });
      }
   }

   updateYield(
      yieldType: number,
      amount:    number   
   ) {
      
      switch(yieldType) {
         case 1: this.yield.food    += amount; break;
         case 2: this.yield.stone   += amount; break;
         case 3: this.yield.wood    += amount; break;
         case 4: this.yield.coal    += amount; break;
         case 5: this.yield.ironOre += amount; break;
         case 6: this.yield.ironBar += amount; break;
         case 7: this.yield.goldOre += amount; break;
         case 8: this.yield.goldBar += amount; break;
      }

      this.socket.emit("updateYield", this.yield);
   }

}