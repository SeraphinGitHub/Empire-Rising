
"use strict"

import {
   IString,
   IPosition,
   IPositionList,
   INumberList,
   IAgentCost,
   ICellClass,
} from "../utils/interfaces";


// =====================================================================
// Cell Class
// =====================================================================
export class CellClass {
   
   id:             string;

   cellPerSide:    number;
   size:           number;
   i:              number;
   j:              number;
   x:              number;
   y:              number;

   center:         IPosition;
   collider:       IPositionList;
   nebSideList:    INumberList;

   agentID:        number | undefined;
   agentCostList:  IAgentCost;
   neighborsList:  IString;
   
   isBlocked:      boolean;
   isVacant:       boolean;
   isTransp:       boolean;
   
   walls_Src:      string;
   flatG_Src:      string;
   tileImg:        HTMLImageElement;

   constructor(
      cellPerSide: number,
      size:        number,
      i:           number,
      j:           number,
   ) {
      
      this.id          = `${i}-${j}`;

      this.cellPerSide = cellPerSide;
      this.size        = size;
      this.i           = i;
      this.j           = j;
      this.x           = i *size;
      this.y           = j *size;
      
      this.center      = {
         x: this.x + size/2,
         y: this.y + size/2,
      };
      
      this.collider    = { // Diamond Collider

         top: {
            x: this.center.x,
            y: this.y,
         },

         right: {
            x: this.x +this.size,
            y: this.center.y,
         },

         bottom: {
            x: this.center.x,
            y: this.y +this.size,
         },

         left: {
            x: this.x,
            y: this.center.y,
         },
      }

      this.nebSideList = {
         top:         [ 0, -1],
         right:       [ 1,  0],
         bottom:      [ 0,  1],
         left:        [-1,  0],

         topLeft:     [-1, -1],
         topRight:    [ 1, -1],
         bottomRight: [ 1,  1],
         bottomLeft:  [-1,  1],
      };

      this.agentID       = undefined;
      this.agentCostList = {};
      this.neighborsList = {};
      
      this.isBlocked     = false;
      this.isVacant      = true;
      this.isTransp      = false;
      
      this.walls_Src     = "Buildings/wall.png";
      this.flatG_Src     = "Terrain/Flat_Grass.png";
      this.tileImg       = new Image();
      this.tileImg.src   = this.flatG_Src;
   }

   // Set Neighbors List
   setNeighborsList() {

      Object.entries(this.nebSideList).forEach(([sideName, sideArray]: [string, number[]]) => {
         this.checkExistNeb(sideName, sideArray);
      });
   }

   getNeighbors(
      cellsList: ICellClass,
   ): ICellClass {
      
      const neighbors: ICellClass = {};

      for(const [key, value] of Object.entries(this.neighborsList)) {
         neighbors[key] = cellsList[value];
      }

      return neighbors;
   }
   
   checkExistNeb(
      sideName:  string,
      sideArray: number[],
   ) {
   
      const [horizSide, vertSide] = sideArray;
      const [horizNeb,  vertNeb ] = [this.i +horizSide, this.j +vertSide];
   
      if(horizNeb >= 0
      && vertNeb  >= 0
      && horizNeb < this.cellPerSide
      && vertNeb  < this.cellPerSide) {

         this.addNeb(sideName);
      }
   }
   
   addNeb(side: string) {

      const nebID: IString = {};

      Object.entries(this.nebSideList).forEach(([sideName, sideArray]: [string, number[]]) => {

         nebID[sideName] = `${this.i +sideArray[0]}-${this.j +sideArray[1]}`;
      });
   
      this.neighborsList[side] = nebID[side];
   }

   isBlockedDiag(
      cellsList:  ICellClass,
      neighbor:   CellClass,
   ): boolean {
      
      const {
         topLeft,
         top,
         topRight,
         right,
         bottomRight,
         bottom,
         bottomLeft,
         left, 
      } = this.getNeighbors(cellsList);

      const isBlocked = {
         topLeft:     () => top    && left  && top    .isBlocked && left  .isBlocked && neighbor === topLeft,
         topRight:    () => top    && right && top    .isBlocked && right .isBlocked && neighbor === topRight,
         bottomLeft:  () => bottom && left  && bottom .isBlocked && left  .isBlocked && neighbor === bottomLeft,
         bottomRight: () => bottom && right && bottom .isBlocked && right .isBlocked && neighbor === bottomRight,
      }
      
      return isBlocked.topLeft() || isBlocked.topRight() || isBlocked.bottomLeft() || isBlocked.bottomRight();
   }

   setTransparency(cellsList: ICellClass) {
   
      if(!this.isBlocked) return;

      const {
         top,
         topRight,
         right,
      } = this.getNeighbors(cellsList);
      
      if(!top.isVacant
      || !topRight.isVacant
      || !right.isVacant) {
         
         return this.isTransp = true;
      }

      this.isTransp = false;
   }


   // Draw Methods
   drawInfos(ctx: CanvasRenderingContext2D) {
         
      this.drawFrame(ctx);
      // this.drawCenter(ctx);
      // this.drawID(ctx);
   }

   drawCenter(ctx: CanvasRenderingContext2D) {

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(
         this.center.x,
         this.center.y,
         4, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
   }

   drawFrame(ctx: CanvasRenderingContext2D) {

      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
   
      ctx.strokeRect(
         this.x,
         this.y,
         this.size,
         this.size
      );
   }

   drawID(ctx: CanvasRenderingContext2D) {

      ctx.fillStyle = "black";
      ctx.font = "16px Verdana";
      ctx.textAlign = "center";

      ctx.fillText(
         this.id,
         this.center.x,
         this.center.y
      );
   }

   drawWallCollider(ctx: CanvasRenderingContext2D) {

      const { top, right, bottom, left } = this.collider;     

      ctx.fillStyle = "red";
      ctx.beginPath();

      ctx.moveTo(top.x,    top.y   );
      ctx.lineTo(right.x,  right.y );
      ctx.lineTo(bottom.x, bottom.y);
      ctx.lineTo(left.x,   left.y  );

      ctx.fill();
   }

   drawPathWall(ctx: CanvasRenderingContext2D, hoverCell: CellClass) {

      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(
         this.center.x,
         this.center.y
      );
      ctx.lineTo(
         hoverCell.center.x,
         hoverCell.center.y
      );
      ctx.lineWidth = 4;
      ctx.stroke();
   }

   drawVacancy(ctx: CanvasRenderingContext2D) {

      if(this.isVacant) return;
      
      this.drawColor(ctx, "rgba(255, 0, 0, 0.6)")
   }

   drawColor(ctx: CanvasRenderingContext2D, color: string) {

      ctx.fillStyle = color;
      ctx.fillRect(
         this.x,
         this.y,
         this.size,
         this.size
      );
   }


   // ------------------ Tempory ------------------
   drawSprite(
      ctx:          CanvasRenderingContext2D,
      gridPos:      IPosition,
      scrollOffset: IPosition,
   ) {

      const frameX    = 0;
      const srcHeight = 100;
      const srcWidth  = 100;
      const destSize  = 55;
      const offsetX   = 25;
      const offsetY   = 15;

      ctx.drawImage(
         this.tileImg,

         // Source
         frameX *srcWidth,
         0,
         srcWidth,
         srcHeight,
         
         // Destination
         gridPos.x -offsetX +scrollOffset.x,
         gridPos.y -offsetY +scrollOffset.y,
         destSize,
         destSize,
      );
   }

   drawWall(
      ctx:          CanvasRenderingContext2D,
      gridPos:      IPosition,
      scrollOffset: IPosition,
   ) {

      if(!this.isBlocked) return;

      this.tileImg.src = this.walls_Src;

      const srcSize  = 280;
      const destSize = 90;
      const offsetX  = 48;
      const offsetY  = 75;

      if(this.isTransp) {
         ctx.save();
         ctx.globalAlpha = 0.5;
   
         ctx.drawImage(
            this.tileImg!,
   
            // Source
            0,
            0,
            srcSize,
            srcSize,
            
            // Destination
            gridPos.x -offsetX +scrollOffset.x,
            gridPos.y -offsetY +scrollOffset.y,
            destSize +10,
            destSize,
         );
         
         ctx.restore();
         return;
      }
   
      ctx.drawImage(
         this.tileImg!,

         // Source
         0,
         0,
         srcSize,
         srcSize,
         
         // Destination
         gridPos.x -offsetX +scrollOffset.x,
         gridPos.y -offsetY +scrollOffset.y,
         destSize +10,
         destSize,
      );
   }
   // ------------------ Tempory ------------------


}