
"use strict"

import {
   IString,
   IPosition,
   IPositionList,
   INumberList,
   IAgentClass,
} from "../utils/interfaces";

import { CollisionClass } from "./_Export";

// =====================================================================
// Cell Class
// =====================================================================
export class CellClass {
   
   id:             string;
   Collision:      CollisionClass;
   
   cellPerSide:    number;
   size:           number;
   i:              number;
   j:              number;
   x:              number;
   y:              number;

   center:         IPosition;
   collider:       IPositionList;
   nebSideList:    INumberList;

   img:  HTMLImageElement | undefined;
   zIndex:         number | undefined;
   agentID:        number | undefined;
   agentList:      IAgentClass;
   neighborsList:  IString;

   isBlocked:      boolean;
   isVacant:       boolean;

   constructor(
      cellPerSide: number,
      size:        number,
      i:           number,
      j:           number,
   ) {
      
      this.id          = `${i}-${j}`;
      this.Collision   = new CollisionClass;

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

      this.img           = undefined;
      this.zIndex        = undefined;
      this.agentID       = undefined;
      this.agentList     = {};
      this.neighborsList = {};
      
      this.isBlocked     = false;
      this.isVacant      = true;
      
      this.init();
   }

   init() {
      this.img     = new Image();
      this.img.src = "Terrain/Herb_01.png";
   }

   // Set Neighbors List
   setNeighborsList() {

      Object.entries(this.nebSideList).forEach(([sideName, sideArray]: [string, number[]]) => {
         this.checkExistNeb(sideName, sideArray);
      });
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


   // Draw
   drawInfos(ctx: CanvasRenderingContext2D) {
         
      this.drawFrame(ctx);
      this.drawCenter(ctx);
      this.drawID(ctx);
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
      const srcHeight = 1000;
      const srcWidth  = 1500;
      const destSize  = 40;
      const offsetX   = 23;
      const offsetY   = 23;

      ctx.drawImage(
         this.img!,

         // Source
         frameX *srcWidth,
         0,
         srcWidth,
         srcHeight,
         
         // Destination
         gridPos.x -offsetX +scrollOffset.x,
         gridPos.y -offsetY +scrollOffset.y,
         destSize +10,
         destSize,
      );
   }

   drawWall(
      ctx:          CanvasRenderingContext2D,
      gridPos:      IPosition,
      scrollOffset: IPosition,
   ) {

      if(!this.isBlocked) return;
      
      this.img!.src = "Terrain/iso_stone.png";

      const srcSize  = 1024;
      const destSize = 55;
      const offsetX  = 30;
      const offsetY  = 40;

      ctx.drawImage(
         this.img!,

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