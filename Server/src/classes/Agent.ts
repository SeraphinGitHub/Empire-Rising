
import {
   INumber,
   INumberList,
   IPosition,
} from "../utils/interfaces";

import {
   Cell,
   Pathfinder,
   Player,
} from "./_Export";

import {
   Battle,
} from "../modules/Battle";

import dotenv from "dotenv";
dotenv.config();


// =====================================================================
// Agent Class
// =====================================================================
export class Agent {
   
   id:            number;
   playerID:      string;
   teamID:        number;
   teamColor:     number;
   
   name:          string;
   nodeNebName:   string = "";
   spritePath:    string;
   spriteSpecs:   INumberList;
   
   state:         number = 1;
   oldHarvNodeID:    number = 0;
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
   pathID:        string[]    = [];
   oldCell:       Cell | null = null;
   curCell:       Cell;

   gatherCell:    Cell | null = null;
   dropOffCell:   Cell | null = null;
   
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
   isPathReload:  boolean = false;

   // -----------------
   // States
   // -----------------
   // die    => 0
   // idle   => 1
   // walk   => 2
   // attack => 3
   // gather => 4

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
      this.spritePath    = stats.spritePath;
      this.spriteSpecs   = stats.spriteSpecs;
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
         spritePath:    this.spritePath,
         spriteSpecs:   this.spriteSpecs,
         isUnit:        this.isUnit,
         isWorker:      this.isWorker,
      }
   }

   updatePack() {
      return {
         id:            this.id,
         state:         this.state,
         position:      this.position,
         cellID:        this.curCell.id,
         isVacant:      this.curCell.isVacant,
         nodeNebName:   this.nodeNebName,
         isGathering:   this.isGathering,
         isGatherable:  this.isGatherable,
         pathID:        this.pathID,
      }
   }

   setMoveSpeed            (moveSpeed: number): number {
      
      const clientFPS: number = Number(process.env.CLIENT_FRAME_RATE);
      const serverFPS: number = Number(process.env.SERVER_FRAME_RATE);

      return moveSpeed * Math.floor( clientFPS / serverFPS );
   }
   
   hasArrivedTo            (cell: Cell): boolean {
      
      const { x: posX,  y: posY  } = this.position;
      const { x: cellX, y: cellY } = cell.center;
  
      if(posX === cellX
      && posY === cellY) {
         return true;
      }
      
      return false;
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   setState                (newState: string) {

      let tempState = null;

      switch(newState) {
         case "die":    tempState = 0; break
         case "idle":   tempState = 1; break
         case "walk":   tempState = 2; break
         case "attack": tempState = 3; break
         case "gather": tempState = 4; break
      }
      
      if(tempState === null
      || tempState === this.state) {
         return
      }

      this.state = tempState;
   }

   setCellState            (battle: Battle) {

      this.oldCell = this.curCell;
      this.curCell = this.Pathfinder.path[0];

      const isPathCompromized = this.Pathfinder.path.some(cell => cell.isBlocked === true);

      if(isPathCompromized && !this.isPathReload) {

         this.Pathfinder.searchPath(battle.Grid.cellsList);
         this.hasUpdated   = false;
         this.isPathReload = true;
      }

      this.Pathfinder.path.shift();
      this.Pathfinder.nextCell = this.Pathfinder.path[0] ?? null;
      this.oldCell.setVacant  (this.id);
      this.curCell.setOccupied(this.id);
   }

   cancelWalking           (nextCell: Cell) {

      this.position.x   = nextCell.center.x;
      this.position.y   = nextCell.center.y;

      this.isMoving     = false;
      this.hasUpdated   = false;
      this.hasArrived   = true;
      this.hasReachNext = true;
   }

   cancelGathering         () {

      clearInterval(this.gatherIntID!);

      this.isGathering = false;
      this.gatherIntID = null;
   }
   
   gatherRessource         (
      battle: Battle,
   ) {

      if(!this.isGatherable) return;
      
      if(!this.gatherSpeed || !this.carryAmount) {
         console.log({ gatherRessource: "No gatherSpeed or carryAmount stat !" });
         return;
      }

      const { Grid, playersList, nodesList } = battle;
      
      this.isGathering = true;

      this.gatherIntID = setInterval(() => {
         this.gatherAmount++

         const node   = nodesList.get(this.harvNodeID);
         const player = playersList.get(this.playerID);
         
         if(!node || !player) return;
         
         node.updateAmount();
         
         if(this.gatherAmount >= this.carryAmount) {
            
            this.isGathering  = false;
            this.isGatherable = false;
            this.hasGathered  = true;

            if(this.gatherIntID) clearInterval(this.gatherIntID);
            
            if(this.dropOffCell
            && this.oldHarvNodeID === this.harvNodeID) {
               
               this.setTargetTo(this.dropOffCell, Grid.cellsList);
            }
            
            else this.searchNearestWarehouse(player, Grid.cellsList);
         };

      }, this.gatherSpeed);
   }

   searchNearestWarehouse  (
      player:    Player,
      cellsList: Map<string, Cell>,
   ) {

      let bottomNebList = [];
      let pathList      = [];

      for(const [, {name, cellID}] of player.buildsID_List) {
         if(name !== "Warehouse") continue;

         const warehouseCell = cellsList.get(cellID);
         if(!warehouseCell) continue;

         for(const [nebName, neb] of Object.entries(warehouseCell.nebStatusList)) {
            if(nebName === "bottom") bottomNebList.push( cellsList.get(neb.id) );
         }
      }

      for(const cell of bottomNebList) {
         if(!cell) continue;

         this.Pathfinder.goalCell = cell;
         this.Pathfinder.searchPath(cellsList);

         if(!this.Pathfinder.hasPath) continue;
         
         pathList.push(this.Pathfinder.path);
      }

      const nearestPath    = pathList.sort((a, b) => a.length - b.length)[0];
      const dropOffCell    = nearestPath[ nearestPath.length -1 ];
      this.Pathfinder.path = nearestPath;

      if(this.dropOffCell   !== dropOffCell    ) this.dropOffCell   = dropOffCell;
      if(this.oldHarvNodeID !== this.harvNodeID) this.oldHarvNodeID = this.harvNodeID;

      this.setTargetTo(dropOffCell);
   }

   setTargetTo             (
      targetCell: Cell,
      cellsList?:  Map<string, Cell>,
   ) {

      targetCell!.isTargeted    = true;
      this.Pathfinder.hasTarget = true;
      this.Pathfinder.goalCell  = targetCell;
      
      if(cellsList) this.Pathfinder.searchPath(cellsList);

      this.hasArrived = false;
      this.hasUpdated = false;
   }

   dropAndReturn           (
      battle:   Battle,
      goalCell: Cell,
   ) {

      const { Grid, playersList, nodesList } = battle;

      if(!this.dropOffCell
      || !this.gatherCell
      || goalCell.id !== this.dropOffCell.id) {
         
         return;
      }

      this.setTargetTo(this.gatherCell, Grid.cellsList);
      this.isGatherable = true;
      
      const node   = nodesList.get(this.harvNodeID);
      const player = playersList.get(this.playerID);
      
      if(!node || !player) return;

      player.updateYield(node.yieldType, this.gatherAmount);
      this.gatherAmount = 0;
   }

   walkPath                (battle: Battle) {
      const { nextCell, goalCell, hasPath } = this.Pathfinder;
      
      if(!nextCell || !goalCell) return;
      if(this.isGathering && this.gatherIntID) this.cancelGathering();
      if(!hasPath) return this.cancelWalking(nextCell);

      this.moveTo(nextCell);
      
      if(!this.isMoving   ) this.isMoving     = true;
      if(this.hasReachNext) this.hasReachNext = false;
      if(!this.hasArrivedTo(nextCell)) return;
      
      this.setCellState(battle);

      if(!this.hasArrivedTo(goalCell)) return;

      this.isMoving   = false;
      this.hasArrived = true;
      this.Pathfinder.resetPath();
      
      if(!this.isWorker) return;

      this.gatherRessource(battle);
      this.dropAndReturn  (battle, goalCell);
   }

   moveTo                  (nextCell: Cell) {

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
   

   // =========================================================================================
   // Update (Every frame)
   // =========================================================================================
   update(battle: Battle) {

      if(this.hasArrived) return;
      
      this.walkPath(battle);
      
      if(this.hasArrived
      && !this.isMoving
      && !this.isGathering
      && !this.isAttacking) this.setState("idle");

      if(this.isGathering) this.setState("gather");

      // Skip sending pathID if already sent once (Not every tick)
      if(this.hasUpdated) return;

      this.hasUpdated   = true;
      this.isPathReload = false;

      this.pathID = this.Pathfinder.path.map((cell: Cell) => cell.id);

      if(this.isMoving) this.setState("walk");
   }

}