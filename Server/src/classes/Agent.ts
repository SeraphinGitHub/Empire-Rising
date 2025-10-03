
import {
   INumber,
   IPosition,
} from "../utils/interfaces";

import {
   Cell,
   Grid,
   Pathfinder,
   Player,
   Node,
} from "./_Export";

import dotenv from "dotenv";
dotenv.config();


// =====================================================================
// Agent Class
// =====================================================================
export class Agent {
   
   id:            number;
   playerID:      string;
   teamID:        number;
   teamColor:     string;
   name:          string;
   basePath:      string; // for sprite img folder  
   nodeNebName:   string = "";
   harvNodeID:    number = -1;
   
   popCost:       number;
   health:        number;
   armor:         number;
   damages:       number;

   buildSpeed:    number;
   gatherSpeed:   number;
   gatherAmount:  number = 0;
   carryAmount:   number;
   gatherIntID:   NodeJS.Timeout | null = null;

   baseSpeed:     number;
   moveSpeed:     number;
   attackSpeed:   number;
   animDelay:     number;
   lastUpdate:    number = Date.now();

   position:      IPosition;
   collider:      INumber;
   oldCell:       Cell | null = null;
   curCell:       Cell;
   
   isUnit:        boolean;
   isWorker:      boolean;
   
   hasArrived:    boolean = true;
   hasReachNext:  boolean = true;
   hasUpdated:    boolean = false;
   isMoving:      boolean = false;
   isSelected:    boolean = false;
   isAttacking:   boolean = false;
   isGatherable:  boolean = false;
   isGathering:   boolean = false;

   // **********************************************
   hasGathered: boolean = false;
   // **********************************************

   Pathfinder:    Pathfinder;

   
   constructor(params: any) {
      const { stats }    = params;

      this.id            = params.id;
      this.playerID      = params.playerID;
      this.teamID        = params.teamID;
      this.teamColor     = params.teamColor;
      this.position      = params.position;
      this.curCell       = params.curCell;
      
      this.name          = stats.name;
      this.collider      = stats.collider;
      this.popCost       = stats.popCost;
      this.health        = stats.health;
      this.armor         = stats.armor;
      this.damages       = stats.damages;

      this.buildSpeed    = stats.buildSpeed;
      this.gatherSpeed   = stats.gatherSpeed;
      this.carryAmount   = stats.carryAmount;
      
      this.baseSpeed     = stats.moveSpeed;
      this.moveSpeed     = this.setMoveSpeed(stats.moveSpeed);
      this.buildSpeed    = stats.buildSpeed;
      this.attackSpeed   = stats.attackSpeed;
      this.animDelay     = stats.animDelay;
      this.basePath      = stats.basePath;
      this.isWorker      = stats.isWorker;
      this.isUnit        = stats.isUnit;

      this.Pathfinder    = new Pathfinder(this);
   }


   initPack() {
      return {
         id:            this.id,
         playerID:      this.playerID,
         teamID:        this.teamID,
         teamColor:     this.teamColor,
         popCost:       this.popCost,
         cellID:        this.curCell.id,
         name:          this.name,
         position:      this.position,
         collider:      this.collider,
         health:        this.health,
         armor:         this.armor,
         damages:       this.damages,
         moveSpeed:     this.baseSpeed,
         buildSpeed:    this.buildSpeed,
         attackSpeed:   this.attackSpeed,
         animDelay:     this.animDelay,
         basePath:      this.basePath,
         isUnit:        this.isUnit,
         isWorker:      this.isWorker,
      }
   }

   setMoveSpeed(moveSpeed: number): number {
      
      const clientFPS: number = Number(process.env.CLIENT_FRAME_RATE);
      const serverFPS: number = Number(process.env.SERVER_FRAME_RATE);

      return moveSpeed * Math.floor( clientFPS / serverFPS );
   }
   
   hasReached(cell: Cell): boolean {
      
      const { x: posX,  y: posY  } = this.position;
      const { x: cellX, y: cellY } = cell.center;
  
      if(posX !== cellX
      || posY !== cellY) {
         return false;
      }
      
      return true;
   }


   // =========================================================================================
   // Walk through path
   // =========================================================================================
   reloadSearchPath(cellsList: Map<string, Cell>) {

      const { path, goalCell } = this.Pathfinder;
      const nextCell = path[1] ? path[1] : path[0];
      
      if(nextCell!.id === goalCell!.id) return;

      const neighbors = [
         "topLeft",
         "top",
         "topRight",
         "right",
         "bottomRight",
         "bottom",
         "bottomLeft",
         "left",
      ].map((name) => {
         const neb = nextCell.nebStatusList[name];
         if(neb) return cellsList.get(neb.id);
      });

      if(nextCell.isBlocked
      || neighbors.some((neb) => nextCell.isBlockedDiag(cellsList, neb!) )) {

         this.Pathfinder.searchPath(cellsList);
      }
   }

   gatherRessource(
      playersList: Map<string, Player>,
      nodesList:   Map<number, Node>,
   ) {

      if(!this.isGatherable) return;
      
      if(!this.gatherSpeed || !this.carryAmount) {
         console.log({ message: "No gatherSpeed or carryAmount stat !" });
         return;
      }
      
      this.isGathering = true;
      
      this.gatherIntID = setInterval(() => {
         this.gatherAmount++

         const node   = nodesList.get(this.harvNodeID);
         const player = playersList.get(this.playerID);
         
         if(!node || !player) return;
         
         node  .updateAmount();
         player.updateYield (node.yieldType);
         
         
         // ******************
         console.log({ message: this.carryAmount, gatherAmount: this.gatherAmount }); // ******************************************************
         
         if(this.gatherAmount >= this.carryAmount) {
            
            // ******************
            console.log({ message: "clear !" }); // ******************************************************
            
            if(this.gatherIntID) clearInterval(this.gatherIntID);
            this.hasGathered = true;
            this.isGathering = false;
            return;
         };

      }, this.gatherSpeed);
      
   }

   walkPath(
      Grid:        Grid,
      playersList: Map<string, Player>,
      nodesList:   Map<number, Node>,
   ) {
      
      const { nextCell, goalCell, hasPath } = this.Pathfinder;
      
      if(!nextCell || !goalCell) return;
      
      if(this.gatherIntID) clearInterval(this.gatherIntID);
      this.isGathering  = false;

      if(!hasPath) {
         this.hasReachNext = true;
         this.hasArrived   = true;
         this.isMoving     = false;
         this.position.x   = nextCell.center.x;
         this.position.y   = nextCell.center.y;
         this.hasUpdated   = false;
         return;
      };
      
      this.moveTo(nextCell);
      this.hasReachNext = false;
      
      if(!this.hasReached(nextCell)) return;
      
      this.oldCell    = this.curCell;
      this.curCell    = this.Pathfinder.path[0];

      this.reloadSearchPath(Grid.cellsList); // instead ==> need to update if path became compromize

      this.Pathfinder.path.shift();
      this.Pathfinder.nextCell = this.Pathfinder.path[0] ?? null;
      this.oldCell.setVacant  (this.id);
      this.curCell.setOccupied(this.id);

      if(!this.hasReached(goalCell!)) return;
      
      this.hasArrived = true;
      this.isMoving   = false;
      
      if(this.isWorker) this.gatherRessource(playersList, nodesList);
   }

   moveTo(nextCell: Cell) {

      const now = Date.now();
      const dt  = (now -this.lastUpdate) /1000;
      this.lastUpdate = now;

      const { x: posX,  y: posY  } = this.position;
      const { x: nextX, y: nextY } = nextCell.center;

      const deltaX = nextX - posX;
      const deltaY = nextY - posY;
      const dist   = Math.hypot(deltaX, deltaY);

      if(dist === 0) {
         this.position.x = nextX;
         this.position.y = nextY;
         return;
      }

      const step  = Math.round(this.moveSpeed + this.moveSpeed * dt);
      const moveX = deltaX / dist * Math.min(dist, step);
      const moveY = deltaY / dist * Math.min(dist, step);

      this.position.x += moveX;
      this.position.y += moveY;
   }
   
}