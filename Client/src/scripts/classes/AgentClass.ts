
import {
   INumber,
   IPosition,
   ICost,
} from "../utils/interfaces";

import {
   CellClass
} from "./_Export";

import { glo } from "../utils/_GlobalVar";

// =====================================================================
// Agent Class
// =====================================================================
export class AgentClass {

   updateSet:      Set<any>;
   skipSet:        Set<any>;


   id:             number;
   unitType:       string;
   imgSrc:         string;
   collider:       INumber;
   popCost:        number;
   moveSpeed:      number;

   position:       IPosition;

   startCell:      CellClass;
   currentCell:    CellClass;
   nextCell:       CellClass | undefined;
   goalCell:       CellClass | undefined;
   openSet:        Set<CellClass>;
   closedSet:      Set<CellClass>;
   costMap:        Map<string, ICost>;
   emptyCost:      ICost;
   path:           CellClass[];

   img:            HTMLImageElement | undefined;
   frameX:         number;
   frameY:         number;
   lastFrameY:     number;
   animState:      number;

   isMoving:       boolean;
   isSelected:     boolean;
   isAttacking:    boolean;

   animSpecs:      any;
   sprites:        INumber;
   specialSprites: INumber;

   constructor(params: any) {
      
      this.updateSet     = new Set();
      this.skipSet       = new Set();

      this.id         = params.id;
      this.unitType   = params.unitType;
      this.imgSrc     = params.imgSrc;
      this.collider   = params.collider;
      this.popCost    = params.popCost;
      this.moveSpeed  = params.moveSpeed;

      // Position
      this.position = {
         x: params.startCell.center.x, // Tempory
         y: params.startCell.center.y, // Tempory
      };
      
      // Pathfinding
      this.startCell   = params.startCell;
      this.currentCell = params.startCell;
      this.costMap     = new Map();
      this.emptyCost   = {
         hCost: 0,
         gCost: 0,
         fCost: 0,
         cameFromCell: undefined,
      }

      this.nextCell    = undefined;
      this.goalCell    = undefined;
      this.openSet     = new Set();
      this.closedSet   = new Set();
      this.path        = [];

      this.img         = undefined;
      this.frameX      = 0;
      this.frameY      = 11;
      this.lastFrameY  = 11;
      this.animState   = 0;

      this.isMoving    = false;
      this.isSelected  = false;
      this.isAttacking = false;

      this.animSpecs   = {
         idle: {
            index: 6,
            spritesNumber: 1,
         },
      
         walk: {
            index: 6,
            spritesNumber: 9,
         },
      
         attack: {
            index: 6,
            spritesNumber: 5,
         },
      
         died: {
            index: 1,
            spritesNumber: 10,
         },
      };
   
      this.sprites = {
         height:  64,
         width:   64,
         offsetY: 25,
      };
   
      this.specialSprites = {
         height:  64,
         width:   192,
      };

      this.init();
   }

   init() {
      this.img     = new Image();
      this.img.src = this.imgSrc;

      this.startCell.isVacant = false;
      this.startCell.agentID  = this.id;
      glo.Grid!.addToOccupiedMap(this.startCell);
   }

   hasArrived(
      cell: CellClass,
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
      neighbor: CellClass,
   ): number {

      const { x: goalX, y: goalY } = this.goalCell!.center;
      const { x: nebX,  y: nebY  } = neighbor.center;
      
      const deltaX = Math.abs(goalX -nebX);
      const deltaY = Math.abs(goalY -nebY);
      const dist   = Math.floor(Math.hypot(deltaX, deltaY));

      return dist;
   }
    

   // Pathfinder
   searchPath() {

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
            return;
         }
      }

      this.isMoving = false;
   }

   lowestFCostCell(): CellClass | null {

      // Bring up lowest fCost cell
      let lowestFCost: number           = Infinity;
      let presentCell: CellClass | null = null;

      this.openSet.forEach((cell: CellClass) => {
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

   scanNeighbors(presentCell: CellClass) {

      const nebList   = presentCell.neighborsList;
      const cellsList = glo.Grid!.cellsList;
      
      // Cycle all neighbors if exists
      for(const sideName in nebList) {
         const { id: nebID, isDiagonal } = nebList[sideName];
         const neighbor: CellClass       = cellsList.get(nebID)!;

         // If this neighbor hasn't been scanned yet
         if(!this.closedSet.has(neighbor)
         && !neighbor.isBlocked
         &&  neighbor.isVacant) {
            
            const gValue:      number = isDiagonal ? 1.5 : 1;
            const new_gCost:   number = (this.costMap.get(presentCell.id)!.gCost +gValue) *2;
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

   foundPath(presentCell: CellClass) {
            
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


   // Walk through path
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

      // Set as Vacant
      if(this.currentCell !== this.startCell) {
         glo.Grid!.occupiedCells.delete(this.currentCell);

         this.currentCell.agentID  = undefined;
         this.currentCell.isVacant = true;
         this.currentCell = this.startCell;
      }
      
      // Set as Occupied
      this.currentCell.agentID  = this.id;
      this.currentCell.isVacant = false;
      this.startCell = this.path[1];
      
      glo.Grid!.addToOccupiedMap(this.currentCell);
   }

   searchVacancy(currentCell: CellClass) { // <== Tempory (Need Recast)

      if(currentCell.isVacant || currentCell.agentID === this.id) return;

      const nebList  = currentCell.neighborsList;
      let vacantPath = [];

      for(const sideName in nebList) {
         const nebID:    string    = nebList[sideName].id;
         const neighbor: CellClass = glo.Grid!.cellsList.get(nebID)!;
         
         vacantPath.push(neighbor);
      }
      
      vacantPath.sort((neb: CellClass) => this.costMap.get(neb.id)!.fCost);

      while(vacantPath.length > 0) {
      
         this.goalCell = vacantPath[0];
         this.searchPath();
         vacantPath.shift();
      }
   }


   // Draw
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

      // this.drawScanNebs(ctx);
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
      currentCell: CellClass,
      nextCell:    CellClass,
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