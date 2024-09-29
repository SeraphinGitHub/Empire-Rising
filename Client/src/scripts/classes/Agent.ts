
import {
   INumber,
   IPosition,
   ICost,
} from "../utils/interfaces";

import {
   Cell
} from "./_Export";

import { glo } from "../utils/_GlobalVar";


// =====================================================================
// Agent Class
// =====================================================================
export class Agent {

   // ----- Debug -----
   startDate_1:  number = 0;
   startDate_2:  number = 0;
   // ----- Debug -----


   // Basic Information
   id:          number;
   popCost:     number;
   moveSpeed:   number;
   unitType:    string;
   imgSrc:      string;
   collider:    INumber;
   position:    IPosition;

   // Pathfinding
   startCell:   Cell;
   currentCell: Cell;
   nextCell:    Cell | undefined = undefined;
   goalCell:    Cell | undefined = undefined;
   openSet:     Set<Cell>        = new Set();
   closedSet:   Set<Cell>        = new Set();
   costMap:     Map<string, ICost>    = new Map();
   path:        Cell[]           = [];
   emptyCost:   ICost = {
      hCost: 0,
      gCost: 0,
      fCost: 0,
      cameFromCell: undefined,
   };

   // Image and Animation
   img:         HTMLImageElement | undefined = undefined;
   frameX:      number = 0;
   frameY:      number = 11;
   lastFrameY:  number = 11;
   animState:   number = 0;

   // States
   isMoving:    boolean = false;
   isSelected:  boolean = false;
   isAttacking: boolean = false;

   // Animation Specifications
   animSpecs = {
      idle:    { index: 6, spritesNumber: 1  },
      walk:    { index: 6, spritesNumber: 9  },
      attack:  { index: 6, spritesNumber: 5  },
      died:    { index: 1, spritesNumber: 10 },
   };

   // Sprite Sizes
   sprites:        INumber = { height: 64, width: 64, offsetY: 25 };
   specialSprites: INumber = { height: 64, width: 192 };


   constructor(params: any) {

      this.id        = params.id;
      this.popCost   = params.popCost;
      this.moveSpeed = params.moveSpeed;
      this.unitType  = params.unitType;
      this.imgSrc    = params.imgSrc;
      this.collider  = params.collider;

      this.position  = {
         x: params.startCell.center.x, // Temporary
         y: params.startCell.center.y, // Temporary
      };
      
      this.startCell   = params.startCell;
      this.currentCell = params.startCell;

      this.init();
   }

   init() {
      this.img     = new Image();
      this.img.src = this.imgSrc;

      this.startCell.isVacant = false;
      this.startCell.agentIDset.add(this.id);

      glo.Grid!.addToOccupiedMap(this.startCell);
   }

   Debug_SearchTime(presentCell: Cell) {

      console.log(
         "hCost: ", Math.floor(this.costMap.get(this.path[1].id)!.hCost),
         "gCost: ", Math.floor(this.costMap.get(presentCell.id)!.gCost),
         "fCost: ", Math.floor(this.costMap.get(presentCell.id)!.fCost),
         "                                                                 ",
         `Path was found in: ${ Date.now() -this.startDate_1 } ms`,
         "                                                                 ",
         `Unit moved: ${ this.path.length } cells`,
      );
   }

   Debug_MoveTime() {

      console.log(`Unit spend: ${ (Date.now() -this.startDate_2) /1000 } s to reach goal`);
   }

   hasArrived(
      cell: Cell,
   ): boolean {
      
      const { x: posX,  y: posY  } = this.position;
      const { x: cellX, y: cellY } = cell.center;
  
      if(posX !== cellX
      || posY !== cellY) {

         return false;
      }

      return true;
   }

   mathFloor_100(
      value: number,
   ): number {

      return Math.floor( value *100 ) /100;
   }

   calcHeuristic(
      neighbor: Cell,
   ): number {

      const { x: goalX, y: goalY } = this.goalCell!.center;
      const { x: nebX,  y: nebY  } = neighbor.center;
      
      const deltaX = Math.abs(goalX -nebX);
      const deltaY = Math.abs(goalY -nebY);
      const dist   = Math.hypot(deltaX, deltaY);

      return dist;
   }
    

   // =========================================================================================
   // Pathfinder
   // =========================================================================================
   searchPath() {

      // ***************************
      // this.startDate_1 = Date.now();
      // ***************************

      this.costMap.clear();
      this.costMap.set(this.startCell.id, this.emptyCost);

      this.openSet   = new Set([this.startCell]);
      this.closedSet = new Set();
      this.path      = [];

      while(this.openSet.size > 0) {

         const presentCell = this.lowestFCostCell()!;

         this.scanNeighbors(presentCell);

         // If reached destination
         if(presentCell.id === this.goalCell!.id) {
            
            this.foundPath(presentCell);
            this.isMoving = true;

            // ***************************
            // this.startDate_2 = Date.now();
            // this.Debug_SearchTime(presentCell);
            // ***************************

            return;
         }
      }

      this.isMoving = false;
   }

   lowestFCostCell(): Cell | null {

      // Bring up lowest fCost cell
      let lowestFCost: number           = Infinity;
      let presentCell: Cell | null = null;

      this.openSet.forEach((cell: Cell) => {
         const cellData: ICost = this.costMap.get(cell.id)!;
         
         if(cellData.fCost  <  lowestFCost
         || cellData.fCost === lowestFCost
         && cellData.hCost  <  this.costMap.get(presentCell!.id)!.hCost) {

            lowestFCost = cellData.fCost;
            presentCell = cell;
         }
      });

      return presentCell;
   }

   scanNeighbors(presentCell: Cell) {

      const nebList       = presentCell.neighborsList;
      const cellsList     = glo.Grid!.cellsList;
      const straightValue = presentCell.size *0.5;
      const diagValue     = 1.4 *straightValue;
      
      // Cycle all neighbors if exists
      for(const sideName in nebList) {

         const { id: nebID, isDiagonal } = nebList[sideName];
         const neighbor: Cell       = cellsList.get(nebID)!;

         // If this neighbor hasn't been scanned yet
         if(!this.closedSet.has(neighbor)
         && !neighbor.isBlocked
         &&  neighbor.isVacant) {
            
            const gCost:       number = this.costMap.get(presentCell.id)!.gCost;
            const gValue:      number = isDiagonal ? diagValue : straightValue;
            const new_gCost:   number = gCost +gValue;
            const nebCostData: ICost | undefined = this.costMap.get(nebID);
            
            // If neighbor already valid && worse gCost || blockedDiag ==> skip this neb
            if((this.openSet.has(neighbor) && nebCostData && new_gCost > nebCostData.gCost)
            || presentCell.isBlockedDiag(cellsList, neighbor)) {

               continue;
            }

            this.openSet.add(neighbor);
            const hCost = this.calcHeuristic(neighbor);
            
            this.costMap.set(nebID, {
               hCost,
               gCost:        new_gCost,
               fCost:        hCost +new_gCost,
               cameFromCell: presentCell,
            });
         }
      }

      this.openSet.delete(presentCell);
      this.closedSet.add(presentCell);
   }

   foundPath(presentCell: Cell) {
            
      this.path.push(presentCell);
      let cameFromCell = this.costMap.get(presentCell.id)!.cameFromCell;
      
      // Set found path
      while(cameFromCell) {

         this.path.push(cameFromCell);
         cameFromCell = this.costMap.get(cameFromCell.id)!.cameFromCell;
      }

      this.path.reverse();
      this.nextCell  = this.path[0];
      this.animState = 1;
   }


   // =========================================================================================
   // Walk through path
   // =========================================================================================
   walkPath() {

      if(!this.isMoving) return;

      if(!this.hasArrived(this.nextCell!)) {
         this.moveToNextCell();
         return;
      }

      this.setCellVacancy();
   
      if(this.path.length > 1) this.path.shift();
      if(this.path.length > 0) this.startCell = this.nextCell = this.path[0];

      if(this.hasArrived(this.goalCell!)) {
   
         this.isMoving  = false;
         this.animState = 0;
         this.frameY    = this.lastFrameY;
         
         // this.searchVacancy(this.currentCell);

         // ***************************
         // this.Debug_MoveTime();
         // ***************************
      }
   }

   moveToNextCell() {

      const { x: posX,  y: posY  } = this.position;
      const { x: nextX, y: nextY } = this.nextCell!.center;
      
      const deltaX = this.mathFloor_100(nextX -posX);
      const deltaY = this.mathFloor_100(nextY -posY);

      const isLeft  = deltaX < 0;
      const isRight = deltaX > 0;
      const isUp    = deltaY < 0;
      const isDown  = deltaY > 0;

      let moveSpeed = this.moveSpeed;

      // if(isDown && isLeft
      // || isDown && isRight
      // || isUp   && isLeft
      // || isUp   && isRight) {
         
      //    moveSpeed = this.sqrtSpeed;
      // }

      const dist = Math.round( Math.hypot(deltaX,  deltaY));

      if(dist === 0) {
         this.position.x = nextX;
         this.position.y = nextY;
         return;
      }

      const moveX = this.mathFloor_100(deltaX /dist * Math.min(dist, moveSpeed));
      const moveY = this.mathFloor_100(deltaY /dist * Math.min(dist, moveSpeed));

      this.position.x += moveX;
      this.position.y += moveY;

      if(isDown)  this.frameY = 11;
      if(isUp)    this.frameY = 8; // 9
      if(isLeft)  this.frameY = 9;
      if(isRight) this.frameY = 8; // 11

      if(isDown && isLeft)  this.frameY = 10;
      if(isDown && isRight) this.frameY = 11;
      if(isUp   && isLeft ) this.frameY = 9;
      if(isUp   && isRight) this.frameY = 8;
    
      this.lastFrameY = this.frameY;
   }

   setCellVacancy() {

      // Set old cell as Vacant
      if(this.currentCell !== this.startCell) {
         this.currentCell.agentIDset.delete(this.id);
         
         if(this.currentCell.agentIDset.size === 0) {
            glo.Grid!.occupiedCells.delete(this.currentCell);
            this.currentCell.isVacant = true;
         }

         this.currentCell = this.startCell;
      }
      
      // Set new cell as Occupied
      this.currentCell.agentIDset.add(this.id);
      this.currentCell.isVacant = false;
      this.startCell = this.path[1];
      
      glo.Grid!.addToOccupiedMap(this.currentCell);
   }

   searchVacancy(currentCell: Cell) { // <== Tempory (Need Recast)

      if(currentCell.isVacant || currentCell.agentIDset.has(this.id)) return;

      const nebList  = currentCell.neighborsList;
      let vacantPath = [];

      for(const sideName in nebList) {
         const nebID:    string    = nebList[sideName].id;
         const neighbor: Cell = glo.Grid!.cellsList.get(nebID)!;
         
         vacantPath.push(neighbor);
      }
      
      vacantPath.sort((neb: Cell) => this.costMap.get(neb.id)!.fCost);

      while(vacantPath.length > 0) {
      
         this.goalCell = vacantPath[0];
         this.searchPath();
         vacantPath.shift();
      }
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawPath(ctx: CanvasRenderingContext2D) {
      
      if(glo.Params.isGridHidden) return;
      if(this.path.length <= 0  ) return;

      // Display path
      for(let i = 0; i < this.path.length; i++) {
         const currentCell = this.path[i];
         
         if(i +1 < this.path.length) {
            const nextCell = this.path[i +1];
            this.drawPathLine(ctx, currentCell, nextCell);
         }
      }

      this.drawScanNebs(ctx);
   }

   drawScanNebs(ctx: CanvasRenderingContext2D) {
      
      // Display scanned neighbors   
      this.closedSet.forEach(cell => {
         cell.drawColor(ctx, "rgba(255, 145, 0, 0.6)");
         
         // const costData = this.costMap.get(cell.id)!;
         // cell.drawData (ctx, costData);
      });
   }

   drawPathLine(
      ctx:         CanvasRenderingContext2D,
      currentCell: Cell,
      nextCell:    Cell,
   ) {
      
      ctx.strokeStyle = "lime";
      ctx.beginPath();
      ctx.moveTo(
         currentCell.center.x,
         currentCell.center.y
      );
      ctx.lineTo(
         nextCell.center.x,
         nextCell.center.y
      );
      ctx.lineWidth = 6;
      ctx.stroke();
   }

   drawCollider(
      ctx:     CanvasRenderingContext2D,
      gridPos: IPosition,
      scroll:  IPosition,
   ) {

      ctx.fillStyle = "lime";
      ctx.beginPath();
      ctx.arc(
         gridPos.x + scroll.x,
         gridPos.y + this.collider.offsetY +scroll.y,
         this.collider.radius, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
   }

   drawSprite(
      ctx:      CanvasRenderingContext2D,
      position: IPosition,
      scroll:   IPosition,
   ) {
      
      let spritesWidth  = this.sprites.width;
      let spritesHeight = this.sprites.height;

      if(this.isAttacking) spritesWidth = this.specialSprites.width;

      ctx.drawImage(
         this.img!,

         // Source
         (this.frameX +this.animState) * spritesWidth,
         this.frameY * spritesHeight,
         spritesWidth,
         spritesHeight,      
         
         // Destination
         position.x - spritesWidth /2 +scroll.x,
         position.y - spritesHeight/2 - this.sprites.offsetY +scroll.y,
         spritesWidth,
         spritesHeight,
      );
   }

   drawSelect(
      ctx:   CanvasRenderingContext2D,
      color: string,
   ) {
   
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
         this.position.x,
         this.position.y,
         this.popCost *30, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
   }

   updateState(frame: number) {

      switch(this.animState) {

         // Walking
         case 1: {
            this.animation(
               frame,
               this.animSpecs.walk.index,
               this.animSpecs.walk.spritesNumber
            );
         } break;

         // Attacking
         case 2: {
            this.animation(
               frame,
               this.animSpecs.attack.index,
               this.animSpecs.attack.spritesNumber
            );
         } break;
      
         // Died
         case 3: {
            this.animation(
               frame,
               this.animSpecs.died.index,
               this.animSpecs.died.spritesNumber
            );
         } break;

         // Idle
         default: {
            this.animation(frame,
               this.animSpecs.idle.index,
               this.animSpecs.idle.spritesNumber
            );
         } break;
      }
   }

   animation(
      frame:         number,
      index:         number,
      spritesNumber: number,
   ) {
      
      if(frame % index === 0) {         
         if(this.frameX < spritesNumber -2) this.frameX++;
   
         else {
            this.frameX = 0;
            // if(!this.isAnimable) this.isAnimable = true;
         }
      }
   }
   
}