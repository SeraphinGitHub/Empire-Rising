
"use strict"

// =====================================================================
// Agent Class
// =====================================================================
class AgentClass {
   constructor(params) {

      this.id       = params.id;
      this.type     = params.type;
      this.imgSrc   = params.imgSrc;
      this.popCost  = params.popCost;
      this.collider = params.collider;
      this.isSelected = false;

      // Position
      this.position = {
         x: params.startCell.center.x, // Tempory
         y: params.startCell.center.y, // Tempory
      };

      this.target = undefined;

      // Pathfinding
      this.startCell   = params.startCell;
      this.currentCell = params.startCell;
      this.endCell;
      this.path        = [];
      this.openList    = new Set();
      this.closedList  = new Set();
      this.isEuclidean = params.isEuclidean;

      this.img         = undefined;
      this.frameX      = 0;
      this.frameY      = 3;
      this.lastFrameY  = 3;
      this.animState   = 0;
      this.speed       = 3;
      this.sqrtSpeed   = Math.floor(this.speed / Math.sqrt(2) *100) /100;

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
   }

   calcHeuristic(currentCell) {
      
      let distX = Math.abs(this.endCell.center.x -currentCell.center.x);
      let distY = Math.abs(this.endCell.center.y -currentCell.center.y);
      let hypotenuse = Math.floor(Math.sqrt(distX * distX + distY * distY));

      if(!this.isEuclidean) return distX + distY;
      else return hypotenuse;
   }
    
   searchPath(cellsList) {

      const ownID = this.id;

      this.openList   = new Set([this.startCell]);
      this.closedList = new Set();
      this.path       = [];

      while(this.openList.size > 0) {

         // Bring up lowest fCost cell
         let currentCell = Array.from(this.openList).reduce(
            (lowestIndex, cell) => {

               if(cell.agentList[ownID].fCost < lowestIndex.agentList[ownID].fCost) return cell;
               else return lowestIndex;

            }, this.openList.values().next().value
         );

         let nebList = currentCell.neighborsList;
            
         // Scan cell neighbors
         for(let i in nebList) {
            let neighbor = cellsList[ nebList[i] ];

            // If this neighbor hasn't been scanned yet
            if(!this.closedList.has(neighbor) && !neighbor.isBlocked) {
               let possibleG = currentCell.agentList[ownID].gCost + 1;
               let nebData   = neighbor.agentList[ownID];
      
               if(!this.openList.has(neighbor)) this.checkBlockedDiag(currentCell.neighborsList, neighbor);
               else if(possibleG >= nebData.gCost) continue;

               nebData.hCost = this.calcHeuristic(neighbor);
               nebData.gCost = possibleG;
               nebData.fCost = nebData.gCost +nebData.hCost;
               nebData.cameFromCell = currentCell;

               neighbor.agentList[ownID] = nebData;
            }
         }


         // Transfert currentCell to closedList
         this.openList.delete(currentCell);
         this.closedList.add(currentCell);
         

         // If reached destination
         if(currentCell.id === this.endCell.id) {
            
            let temporyCell = currentCell;
            this.path.push(temporyCell);
            
            // Set found path
            while(temporyCell.agentList[ownID].cameFromCell) {
               
               this.path.push(temporyCell.agentList[ownID].cameFromCell);
               temporyCell = temporyCell.agentList[ownID].cameFromCell;
            }

            // Reset neighbors data
            this.closedList.forEach(cell => {
               let cellData = cell.agentList[ownID];

               cellData.hCost = 0;
               cellData.gCost = 0;
               cellData.fCost = 0;
               cellData.cameFromCell = undefined;

               cell.agentList[ownID] = cellData;
            });

            this.path.reverse();
            this.target = this.path[0].center; // <== Set Target Cell
            this.animState = 1;

            return this.path;
         }
      }

      return[];
   }

   searchPath_OLD(cellsList) {

      this.openList = [this.startCell];
      this.closedList = [];
      this.path = [];

      while(this.openList.length > 0) {

         let lowestIndex = 0;

         // Bring up lowest fCost index
         for(let i = 0; i < this.openList.length; i++) {
            if(this.openList[lowestIndex].fCost > this.openList[i].fCost) {
               lowestIndex = i;
            }
         }

         let currentCell = this.openList[lowestIndex];
         let nebList = currentCell.neighborsList;

         // Scan cell neighbors
         for(let i in nebList) {
            let neighbor = cellsList[ nebList[i] ];
            
            // If this neighbor hasn't been scanned yet
            if(!this.closedList.includes(neighbor)
            && !neighbor.isBlocked) {

               let possibleG = currentCell.gCost +1;
               
               if(!this.openList.includes(neighbor)) this.checkBlockedDiag(nebList, neighbor);
               else if(possibleG >= neighbor.gCost) continue;
               
               neighbor.hCost = this.calcHeuristic(neighbor);
               neighbor.gCost = possibleG;
               neighbor.fCost = neighbor.gCost +neighbor.hCost;
               neighbor.cameFromCell = currentCell;
            }
         }


         // Transfert currentCell to closedList
         this.openList.splice(lowestIndex, 1);
         this.closedList.push(currentCell);


         // If reached destination
         if(currentCell.id === this.endCell.id) {
            
            let temporyCell = currentCell;
            this.path.push(temporyCell);
            
            // Set found path
            while(temporyCell.cameFromCell) {
               this.path.push(temporyCell.cameFromCell);
               temporyCell = temporyCell.cameFromCell;
            }

            // Reset neighbors data
            this.closedList.forEach(cell => {
               cell.hCost = 0;
               cell.gCost = 0;
               cell.fCost = 0;
               cell.cameFromCell = undefined;
            });

            this.path.reverse();
            this.target = this.path[0].center; // <== Set Target Cell
            this.animState = 1;

            return this.path;
         }
      }

      return [];
   }
   
   checkBlockedDiag(nebList, neighbor) {
      
      let topNeb    = nebList["top"];
      let rightNeb  = nebList["right"];
      let bottomNeb = nebList["bottom"];
      let leftNeb   = nebList["left"];

      let topLeftNeb     = nebList["topLeft"];
      let topRightNeb    = nebList["topRight"];
      let bottomRightNeb = nebList["bottomRight"];
      let bottomLeftNeb  = nebList["bottomLeft"];

      if( !(topNeb    && leftNeb  && topNeb.isBlocked    && leftNeb.isBlocked  && neighbor === topLeftNeb
         || topNeb    && rightNeb && topNeb.isBlocked    && rightNeb.isBlocked && neighbor === topRightNeb
         || bottomNeb && leftNeb  && bottomNeb.isBlocked && leftNeb.isBlocked  && neighbor === bottomLeftNeb
         || bottomNeb && rightNeb && bottomNeb.isBlocked && rightNeb.isBlocked && neighbor === bottomRightNeb )
      && this.isEuclidean
      || !this.isEuclidean) {

         this.openList.add(neighbor);
      }
   }

   walkPath() {

      if(this.path.length === 0) return;

      if(this.position.x !== this.target.x
      || this.position.y !== this.target.y) {
            
         this.moveToPosition(this.target);
         return;
      }

      this.startCell = this.path[1];
      
      if(this.path.length > 1) this.path.shift();

      if(this.path.length > 0) {
         this.target    = this.path[0].center;
         this.startCell = this.path[0];
      }

      // Has arrived
      if(this.startCell.x === this.endCell.x
      && this.startCell.y === this.endCell.y
      && this.position.x  === this.target.x
      && this.position.y  === this.target.y) {
            
         this.animState = 0;
         this.frameY = this.lastFrameY;
      }
   }

   moveToPosition(target) {

      let walkSpeed = this.speed;

      let isUp    = false;
      let isDown  = false;
      let isLeft  = false;
      let isRight = false;

      if(target.x > this.position.x && target.y > this.position.y
      || target.x < this.position.x && target.y > this.position.y
      || target.x > this.position.x && target.y < this.position.y
      || target.x < this.position.x && target.y < this.position.y) {
         
         walkSpeed = this.sqrtSpeed;
      }

      // Go Right
      if(target.x > this.position.x) {
         isRight = true;
         this.position.x += walkSpeed;
         if(this.position.x + walkSpeed > target.x) this.position.x = target.x;
      }

      // Go Left
      if(target.x < this.position.x) {
         isLeft = true;
         this.position.x -= walkSpeed;
         if(this.position.x - walkSpeed < target.x) this.position.x = target.x;
      }

      // Go Down
      if(target.y > this.position.y) {
         isDown = true;
         this.position.y += walkSpeed;
         if(this.position.y + walkSpeed > target.y) this.position.y = target.y;
      }

      // Go Up
      if(target.y < this.position.y) {
         isUp = true;
         this.position.y -= walkSpeed;
         if(this.position.y - walkSpeed < target.y) this.position.y = target.y;
      }

      if(isDown)  this.frameY = 11;
      if(isUp)    this.frameY = 8;
      if(isLeft)  this.frameY = 9;
      if(isRight) this.frameY = 8;

      if(isDown && isLeft)  this.frameY = 10;
      if(isDown && isRight) this.frameY = 11;
      if(isUp   && isLeft ) this.frameY = 9;
      if(isUp   && isRight) this.frameY = 8;

      this.lastFrameY = this.frameY;
   }

   displayPath(ctx) {
      if(this.path.length > 0) {

         // Display scanned neighbors
         let neighborsColor = "rgba(255, 145, 0, 0.4)";
   
         this.closedList.forEach(cell => {
            cell.drawCellColor(ctx, neighborsColor);
            // cell.drawData(ctx);
         });
   
         // Display path
         for(let i = 0; i < this.path.length; i++) {
   
            let currentCell = this.path[i];
            this.drawWalkPath(ctx, i, currentCell);
            
            if(i +1 < this.path.length) {
               let nextCell = this.path[i +1];
               this.drawPath(ctx, currentCell, nextCell);
            }
         }
      }
   }

   drawPath(ctx, currentCell, nextCell) {
      
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

   drawCollider(ctx, gridPos, offset) {

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(
         gridPos.x + offset.x,
         gridPos.y + this.collider.offsetY +offset.y,
         this.collider.radius, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
   }

   drawSprite(ctx, position, offset) {
      
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
         position.x - spritesWidth /2 +offset.x,
         position.y - spritesHeight/2 - this.sprites.offsetY +offset.y,
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
         }
         break;

         // Attacking
         case 2: {
            this.animation(
               frame,
               this.animSpecs.attack.index,
               this.animSpecs.attack.spritesNumber
            );
         }
         break;
      
         // Died
         case 3: {
            this.animation(
               frame,
               this.animSpecs.died.index,
               this.animSpecs.died.spritesNumber
            );
         }
         break;

         // Idle
         default: {
            this.animation(frame,
               this.animSpecs.idle.index,
               this.animSpecs.idle.spritesNumber
            );
         }
         break;
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