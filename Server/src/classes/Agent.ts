
import {
   INumber,
   IPosition,
} from "../utils/interfaces";

import {
   Cell,
   Grid,
   Pathfinder,
} from "./_Export";

import dotenv from "dotenv";
dotenv.config();


// =====================================================================
// Agent Class
// =====================================================================
export class Agent {

   id:          number;
   playerID:    string;
   teamID:      number;
   teamColor:   string;
   name:        string;
   basePath:    string;
   
   popCost:     number;
   health:      number;
   armor:       number;
   damages:     number;
   moveSpeed:   number;
   buildSpeed:  number;
   attackSpeed: number;
   animDelay:   number;

   position:    IPosition;
   collider:    INumber;
   oldCell:     Cell | null = null;
   curCell:     Cell;
   
   hasUpdated:  boolean = false;

   hasArrived:  boolean = true;
   isMoving:    boolean = false;
   isSelected:  boolean = false;
   isAttacking: boolean = false;

   Pathfinder: Pathfinder;

   
   constructor(params: any) {
      const { stats } = params;

      this.id          = params.id;
      this.playerID    = params.playerID;
      this.teamID      = params.teamID;
      this.teamColor   = params.teamColor;
      this.position    = params.position;
      this.curCell     = params.curCell;
      
      this.name        = stats.name;
      this.collider    = stats.collider;
      this.popCost     = stats.popCost;
      this.health      = stats.health;
      this.armor       = stats.armor;
      this.damages     = stats.damages;
      this.moveSpeed   = this.setMoveSpeed(stats.moveSpeed);
      this.buildSpeed  = stats.buildSpeed;
      this.attackSpeed = stats.attackSpeed;
      this.animDelay   = stats.animDelay;
      this.basePath    = stats.basePath;

      this.Pathfinder  = new Pathfinder(this);
   }


   initPack() {
      return {
         id:            this.id,
         playerID:      this.playerID,
         teamID:        this.teamID,
         teamColor:     this.teamColor,
         popCost:       this.popCost,
         curCell:       this.curCell,
         position:      this.position,
         collider:      this.collider,
         health:        this.health,
         armor:         this.armor,
         damages:       this.damages,
         moveSpeed:     this.moveSpeed,
         buildSpeed:    this.buildSpeed,
         attackSpeed:   this.attackSpeed,
         animDelay:     this.animDelay,
         basePath:      this.basePath,
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

   mathFloor_100(value: number): number {

      return Math.floor( value *100 ) /100;
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

   walkPath(Grid: Grid) {

      if(!this.isMoving) return;
      
      const { path, nextCell, goalCell } = this.Pathfinder;
      
      this.moveTo(nextCell!);
      this.hasArrived = false;
      
      if(!this.hasReached(nextCell!)) return;
         
      this.hasUpdated = false; // **************************
      this.hasArrived = true;
      this.oldCell    = this.curCell;
      this.curCell    = path[0];
      
      this.reloadSearchPath(Grid.cellsList); // instead ==> need to update if path became compromize
      
      this.Pathfinder.path.shift();
      this.Pathfinder.nextCell = path[0];
      this.oldCell.setVacant  (this.id, Grid);
      this.curCell.setOccupied(this.id, Grid);

      if(nextCell!.id !== goalCell!.id) return;

      this.isMoving   = false;
      this.hasArrived = true;
   }

   moveTo(nextCell: Cell) {

      const { x: posX,  y: posY  } = this.position;
      const { x: nextX, y: nextY } = nextCell.center;
      
      const deltaX = this.mathFloor_100(nextX -posX);
      const deltaY = this.mathFloor_100(nextY -posY);

      const dist = Math.round( Math.hypot(deltaX,  deltaY));

      if(dist === 0) {
         this.position.x = nextX;
         this.position.y = nextY;
         return;
      }

      const moveX = this.mathFloor_100(deltaX /dist * Math.min(dist, this.moveSpeed));
      const moveY = this.mathFloor_100(deltaY /dist * Math.min(dist, this.moveSpeed));

      this.position.x += moveX;
      this.position.y += moveY;
   }
   
}