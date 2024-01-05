
"use strict"

// =====================================================================
// Agent Class
// =====================================================================
class AgentClass {
   constructor(params) {

      this.id       = params.id;
      this.type     = params.type;
      this.popCost  = params.popCost;
      this.collider = params.collider;
      this.isSelected = false;

      // Position
      this.position = {
         x: params.startCell.center.x, // Tempory
         y: params.startCell.center.y, // Tempory
      };

      // Pathfinding
      this.startCell   = params.startCell;
      this.currentCell = params.startCell;
      this.endCell;
      this.path        = [];
      this.openList    = [];
      this.closedList  = [];
      this.isEuclidean = params.isEuclidean;
   }

   calcHeuristic(currentCell) {
      
      let distX = Math.abs(this.endCell.center.x -currentCell.center.x);
      let distY = Math.abs(this.endCell.center.y -currentCell.center.y);
      let hypotenuse = Math.floor(Math.sqrt(distX * distX + distY * distY));

      if(!this.isEuclidean) return distX + distY;
      else return hypotenuse;
   }

   searchPath(cellsList) {

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
            if(!this.closedList.includes(neighbor) && !neighbor.isBlocked) {
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

         this.openList.push(neighbor);
      }
   }

   displayPath(ctx, showPath) {
      if(showPath) {

         // Display scanned neighbors
         let neighborsColor = "rgba(255, 145, 0, 0.4)";
   
         this.closedList.forEach(cell => {
            cell.drawCellColor(ctx, neighborsColor);
            if(this.showData) cell.drawData(ctx);
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

   drawWalkPath(ctx, i, currentCell, showData) {
      
      let ratio = 0.7; // 70%
      
      setTimeout(() => {
         
         ctx.fillStyle = "blue";
         ctx.fillRect(
            currentCell.center.x -currentCell.size /2 *ratio,
            currentCell.center.y -currentCell.size /2 *ratio,
            currentCell.size *ratio,
            currentCell.size *ratio
         );

         if(showData)currentCell.drawData(ctx);         

      }, 100 *i);
   }

   drawCollider(ctx, gridPos) {

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(
         gridPos.x,
         gridPos.y + this.collider.offsetY,
         this.collider.radius, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
   }

   drawAgent(ctx, color) {
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
         this.position.x,
         this.position.y,
         this.popCost *20, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
   }
}

module.exports = AgentClass;