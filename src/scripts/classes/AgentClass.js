
"use strict"

const glo  = require("../modules/globalVar.js");


// =====================================================================
// Agent Class
// =====================================================================
class AgentClass {
   constructor(params) {

      this.id         = params.id;
      this.unitType   = params.unitType;
      this.imgSrc     = params.imgSrc;
      this.popCost    = params.popCost;
      this.collider   = params.collider;
      this.moveSpeed  = params.moveSpeed;
      this.sqrtSpeed  = Math.floor(this.moveSpeed / Math.sqrt(2) *100) /100;
      
      this.isSelected = false;
      this.isMoving   = false;

      // Position
      this.position = {
         x: params.startCell.center.x, // Tempory
         y: params.startCell.center.y, // Tempory
      };
      
      // Pathfinding
      this.startCell   = params.startCell;
      this.currentCell = params.startCell;
      this.nextCell    = undefined;
      this.goalCell    = undefined;
      this.path        = [];
      this.openSet     = new Set();
      this.closedSet   = new Set();

      this.img         = undefined;
      this.frameX      = 0;
      this.frameY      = 0;
      this.lastFrameY  = 3;
      this.animState   = 0;

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
      }

      this.sprites = {
         height:  64,
         width:   64,
         offsetY: 20,
      }

      this.specialSprites = {
         height:  64,
         width:   192,
      }

      this.init();
   }

   init() {
      this.img     = new Image();
      this.img.src = this.imgSrc;

      this.startCell.isVacant = false;
   }

   isBlockedDiag(cellsList, nebID_List, neighbor) {

      const {
         topLeft:     _0,
         top:         _1,
         topRight:    _2,
         right:       _3,
         bottomRight: _4,
         bottom:      _5,
         bottomLeft:  _6,
         left:        _7 
      } = nebID_List;
       
      const {
         [_0]: topLeftNeb,
         [_1]: topNeb,
         [_2]: topRightNeb,
         [_3]: rightNeb,
         [_4]: bottomRightNeb,
         [_5]: bottomNeb,
         [_6]: bottomLeftNeb,
         [_7]: leftNeb
      } = cellsList;

      const isBlocked = {
         topLeft:     () => topNeb    && leftNeb  && topNeb.isBlocked    && leftNeb.isBlocked  && neighbor === topLeftNeb,
         topRight:    () => topNeb    && rightNeb && topNeb.isBlocked    && rightNeb.isBlocked && neighbor === topRightNeb,
         bottomLeft:  () => bottomNeb && leftNeb  && bottomNeb.isBlocked && leftNeb.isBlocked  && neighbor === bottomLeftNeb,
         bottomRight: () => bottomNeb && rightNeb && bottomNeb.isBlocked && rightNeb.isBlocked && neighbor === bottomRightNeb,
      }
      
      return isBlocked.topLeft() || isBlocked.topRight() || isBlocked.bottomLeft() || isBlocked.bottomRight();
   }

   hasArrived(cell) {
      
      const { x: posX,  y: posY  } = this.position;
      const { x: cellX, y: cellY } = cell.center;
  
      if(posX !== cellX
      || posY !== cellY) {

         return false;
      }

      return true;
   }

   mathFloor_100(value) {

      return Math.floor( value *100 ) /100;
   }

   calcHeuristic(neighbor) {

      const { x: goalX, y: goalY } = this.goalCell.center;
      const { x: nebX,  y: nebY  } = neighbor.center;
      
      const deltaX = Math.abs(goalX -nebX);
      const deltaY = Math.abs(goalY -nebY);
      const dist   = Math.floor(Math.hypot(deltaX, deltaY));

      return dist;
   }
    

   // Pathfinder
   searchPath() {

      const ownID = this.id;

      this.openSet   = new Set([this.startCell]);
      this.closedSet = new Set();
      this.path      = [];

      while(this.openSet.size > 0) {

         const presentCell = this.lowerFCostCell(ownID);

         this.scanNeighbors(presentCell, ownID);

         // If reached destination
         if(presentCell.id === this.goalCell.id) {
            
            this.foundPath(presentCell, ownID);
            this.resetNeighbors(ownID);
            this.isMoving = true;
            return;
         }
      }

      this.isMoving = false;
   }

   lowerFCostCell(ownID) {

      // Bring up lowest fCost cell
      let presentCell = null;
      let lowestFCost = Infinity;

      for(let cell of this.openSet) {
         const cellData = cell.agentList[ownID];
         
         if(cellData.fCost < lowestFCost) {
            lowestFCost = cellData.fCost;
            presentCell = cell;
         }
      }

      return presentCell;
   }

   scanNeighbors(presentCell, ownID) {

      let nebID_List = presentCell.neighborsList;
      const cellsList = glo.Grid.cellsList;

      for(let i in nebID_List) {
         let neighbor = cellsList[ nebID_List[i] ];

         // If this neighbor hasn't been scanned yet
         if(!this.closedSet.has(neighbor)
         && !neighbor.isBlocked
         && !neighbor.hasBuilding
         && neighbor.isVacant) {

            let possibleG = presentCell.agentList[ownID].gCost + 1;
            let nebData   = neighbor.agentList[ownID];
   
            if(!this.openSet.has(neighbor)
            && !this.isBlockedDiag(cellsList, nebID_List, neighbor)) {
               
               this.openSet.add(neighbor);
            }
            else if(possibleG >= nebData.gCost) continue;

            nebData.hCost = this.calcHeuristic(neighbor);
            nebData.gCost = possibleG;
            nebData.fCost = nebData.gCost +nebData.hCost;
            nebData.cameFromCell = presentCell;

            neighbor.agentList[ownID] = nebData;
         }
      }

      this.openSet.delete(presentCell);
      this.closedSet.add(presentCell);
   }

   foundPath(presentCell, ownID) {
            
      this.path.push(presentCell);
      let cameFromCell = presentCell.agentList[ownID].cameFromCell;
      
      // Set found path
      while(cameFromCell) {

         this.path.push(cameFromCell);
         cameFromCell = cameFromCell.agentList[ownID].cameFromCell;
      }

      this.path.reverse();
      this.nextCell  = this.path[0];
      this.animState = 1;
   }

   resetNeighbors(ownID) {

      this.closedSet.forEach(cell => {
         let cellData = cell.agentList[ownID];

         cellData.hCost = 0;
         cellData.gCost = 0;
         cellData.fCost = 0;
         cellData.cameFromCell = undefined;

         cell.agentList[ownID] = cellData;
      });
   }


   // Walk through path
   walkPath() {

      if(!this.isMoving) return;

      if(!this.hasArrived(this.nextCell)) {
         this.moveToNextCell();
         return;
      }

      this.setCellVacancy();
   
      if(this.path.length > 1) this.path.shift();
      if(this.path.length > 0) this.startCell = this.nextCell = this.path[0];

      if(this.hasArrived(this.goalCell)) {
   
         this.isMoving  = false;
         this.animState = 0;
         this.frameY    = this.lastFrameY;
         
         // this.searchVacancy(this.currentCell);
      }
   }

   moveToNextCell() {

      const { x: posX,  y: posY  } = this.position;
      const { x: nextX, y: nextY } = this.nextCell.center;
      
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

      // Vacant Cell
      if(this.currentCell !== this.startCell) {
         
         this.currentCell.agentID  = undefined;
         this.currentCell.isVacant = true;
         this.currentCell = this.startCell;
      }
      
      // Occupied Cell
      if(this.currentCell.agentID === undefined) this.currentCell.agentID = this.id;
      this.currentCell.isVacant = false;

      this.startCell = this.path[1];
   }

   searchVacancy(currentCell) { // <== Tempory (Need Recast)

      if(currentCell.isVacant || currentCell.agentID === this.id) return;

      let nebID_List = currentCell.neighborsList;
      let vacantPath = [];

      for(let i in nebID_List) {
         let neighbor = glo.Grid.cellsList[ nebID_List[i] ];
         vacantPath.push(neighbor);
      }

      vacantPath.sort((neb) => neb.agentList[this.id].fcost);

      while(vacantPath.length > 0) {
      
         this.goalCell = vacantPath[0];
         this.searchPath();
         vacantPath.shift();
      }
      
   }


   // Draw
   drawPath(ctx) {
      if(this.path.length > 0) {

         // Display scanned neighbors   
         this.closedSet.forEach(cell => {
            cell.drawColor(ctx, "rgba(255, 145, 0, 0.4)");
            // cell.drawData(ctx);
         });
   
         // Display path
         for(let i = 0; i < this.path.length; i++) {
   
            let currentCell = this.path[i];
            this.drawWalkPath(ctx, i, currentCell);
            
            if(i +1 < this.path.length) {
               let nextCell = this.path[i +1];
               this.drawPathLine(ctx, currentCell, nextCell);
            }
         }
      }
   }

   drawPathLine(ctx, currentCell, nextCell) {
      
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
      ctx.lineWidth = 4;
      ctx.stroke();
   }

   drawWalkPath(ctx, i, currentCell) {
      
      let ratio = 0.7; // 70%
      
      setTimeout(() => {
         
         ctx.fillStyle = "blue";
         ctx.fillRect(
            currentCell.center.x -currentCell.size /2 *ratio,
            currentCell.center.y -currentCell.size /2 *ratio,
            currentCell.size *ratio,
            currentCell.size *ratio
         );

         currentCell.drawData(ctx);         

      }, 100 *i);
   }

   drawCollider(ctx, gridPos, scrollOffset) {

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(
         gridPos.x + scrollOffset.x,
         gridPos.y + this.collider.offsetY +scrollOffset.y,
         this.collider.radius, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
   }

   drawSprite(ctx, position, scrollOffset) {
      
      let spritesWidth  = this.sprites.width;
      let spritesHeight = this.sprites.height;

      if(this.isAttacking) spritesWidth = this.specialSprites.width;

      ctx.drawImage(
         this.img,

         // Source
         (this.frameX +this.animState) * spritesWidth,
         this.frameY * spritesHeight,
         spritesWidth,
         spritesHeight,      
         
         // Destination
         position.x - spritesWidth /2 +scrollOffset.x,
         position.y - spritesHeight/2 - this.sprites.offsetY +scrollOffset.y,
         spritesWidth,
         spritesHeight,
      );
   }

   drawSelect(ctx, color) {
   
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

   updateState(frame) {

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

   animation(frame, index, spritesNumber) {
      
      if(frame % index === 0) {         
         if(this.frameX < spritesNumber -2) this.frameX++;
   
         else {
            this.frameX = 0;
            // if(!this.isAnimable) this.isAnimable = true;
         }
      }
   }
}

module.exports = AgentClass;