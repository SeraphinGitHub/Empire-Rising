
"use strict"

import {
   IPosition,
   IPositionList,
   ICost,
   ICoordArray,
   INebList,
} from "../utils/interfaces";

import { glo } from "../utils/_GlobalVar";

// =====================================================================
// Cell Class
// =====================================================================
export class CellClass {
   
   id: string;

   i:  number;
   j:  number;
   x:  number;
   y:  number;

   center:     IPosition;
   screenPos:  IPosition = { x: 0, y: 0 }; // ==> Temp
   
   zIndex:      number;
   size:        number;
   cellPerSide: number;

   // Collider and neighbors
   agentID:        number | undefined;
   collider:       IPositionList;
   neighborsList:  INebList    = {};
   nebCoordList:   ICoordArray = {
      top:         [ 0, -1,  false], // isDiagonal ==> false
      topRight:    [ 1, -1,  true ], // isDiagonal ==> true
      right:       [ 1,  0,  false],
      bottomRight: [ 1,  1,  true ],
      bottom:      [ 0,  1,  false],
      bottomLeft:  [-1,  1,  true ],
      left:        [-1,  0,  false],
      topLeft:     [-1, -1,  true ],
   };

   // States
   isBlocked: boolean = false;
   isVacant:  boolean = true;
   isTransp:  boolean = false;

   // ----------- Tempory -----------
   isDiffTile:     boolean;
   // ----------- Tempory -----------

   constructor(
      zIndex:      number,
      cellPerSide: number,
      size:        number,
      i:           number,
      j:           number,
   ) {
      
      this.id = `${i}-${j}`;
      this.i  = i;
      this.j  = j;
      this.x  = i *size;
      this.y  = j *size;

      this.center = {
         x: this.x + size *0.5,
         y: this.y + size *0.5,
      };

      this.zIndex      = zIndex;
      this.size        = size;
      this.cellPerSide = cellPerSide;
      
      this.collider = {
         top:    { x: this.center.x,      y: this.y             },
         right:  { x: this.x + this.size, y: this.center.y      },
         bottom: { x: this.center.x,      y: this.y + this.size },
         left:   { x: this.x,             y: this.center.y      },
      };

      // ----------- Tempory -----------
      this.isDiffTile    = false;
      // ----------- Tempory -----------
   }

   // Set Neighbors List
   setNeighborsList() {

      for(const nebName in this.nebCoordList) {
         const nebArray = this.nebCoordList[nebName];

         this.checkExistNeb(nebName, nebArray);
      }
   }

   getNeighbors(
      cellsList: Map<string, CellClass>,
   ): any {
      
      const neighbors: any = {};
      
      for(const nebName in this.neighborsList) {
         const nebData = this.neighborsList[nebName];

         neighbors[nebName] = cellsList.get(nebData.id);
      }

      return neighbors;
   }
   
   checkExistNeb(
      nebName:  string,
      nebArray: [number, number, boolean],
   ) {
   
      const [horizSide, vertSide] = nebArray;
      const [horizNeb,  vertNeb ] = [this.i +horizSide, this.j +vertSide];
   
      if(horizNeb >= 0
      && vertNeb  >= 0
      && horizNeb < this.cellPerSide
      && vertNeb  < this.cellPerSide) {

         this.addNeb(nebName);
      }
   }
   
   addNeb(side: string) {

      const neighbor: any = {};

      for(const nebName in this.nebCoordList) {
         const nebArray = this.nebCoordList[nebName];

         neighbor[nebName] = {
            id:         `${this.i +nebArray[0]}-${this.j +nebArray[1]}`,
            isDiagonal: nebArray[2],
         };
      }
   
      this.neighborsList[side] = neighbor[side];
   }

   isBlockedDiag(
      cellsList:  Map<string, CellClass>,
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

      const isBlocked_TopLeft     = top    && left  && top    .isBlocked && left  .isBlocked && neighbor.id === topLeft    .id;
      const isBlocked_TopRight    = top    && right && top    .isBlocked && right .isBlocked && neighbor.id === topRight   .id;
      const isBlocked_BottomLeft  = bottom && left  && bottom .isBlocked && left  .isBlocked && neighbor.id === bottomLeft .id;
      const isBlocked_BottomRight = bottom && right && bottom .isBlocked && right .isBlocked && neighbor.id === bottomRight.id;
      
      return isBlocked_TopLeft || isBlocked_TopRight || isBlocked_BottomLeft || isBlocked_BottomRight;
   }

   setTransparency(cellsList: Map<string, CellClass>) {
   
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
      this.drawBlocked(ctx);
      this.drawVacancy(ctx);
      // this.drawID(ctx);
      // this.drawCenter(ctx);
      // this.drawWallCollider(ctx);
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
      // ctx.strokeStyle = "white";
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
      ctx.font      = "16px Verdana";
      ctx.textAlign = "center";

      ctx.fillText(
         this.id,
         this.center.x,
         this.center.y
      );
   }

   drawData(ctx: CanvasRenderingContext2D, costData: ICost) {

      ctx.fillStyle = "white";
      ctx.font      = "18px Verdana";
      ctx.textAlign = "left";

      const { hCost, gCost, fCost } = costData;
      const offsetX = 27;

      // hCost
      ctx.fillText(
         `h: ${hCost}`,
         this.center.x -offsetX,
         this.center.y -12
      );

      // gCost
      ctx.fillText(
         `g: ${gCost}`,
         this.center.x -offsetX,
         this.center.y +5
      );

      // fCost
      ctx.fillText(
         `f: ${fCost}`,
         this.center.x -offsetX,
         this.center.y +27
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

   drawPath_WallLine(ctx: CanvasRenderingContext2D, hoverCell: CellClass) {

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

   drawBlocked(ctx: CanvasRenderingContext2D) {

      if(!this.isBlocked) return;
      
      this.drawColor(ctx, "rgba(255, 0, 0, 0.7)")
   }

   drawVacancy(ctx: CanvasRenderingContext2D) {

      if(this.isVacant) return;
      
      this.drawColor(ctx, "rgba(0, 255, 255, 0.7)")
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
      ctx:     CanvasRenderingContext2D,
      gridPos: IPosition,
   ) {

      const frameX    = 0;
      const srcHeight = 500;
      const srcWidth  = 500;
      const destSize  = 58;
      const offsetX   = 26;
      const offsetY   = 12;

      let tileImg = glo.flatG_Img;

      if(this.isDiffTile) tileImg = glo.highG_Img;

      ctx.drawImage(
         tileImg,

         // Source
         frameX *srcWidth,
         0,
         srcWidth,
         srcHeight,
         
         // Destination
         gridPos.x -offsetX +glo.TerrainOffset.x,
         gridPos.y -offsetY +glo.TerrainOffset.y,
         destSize,
         destSize,
      );
   }

   drawWall(
      ctx:      CanvasRenderingContext2D,
      gridPos:  IPosition,
      scroll:   IPosition,
   ) {

      if(!this.isBlocked) return;

      const srcSize  = 280;
      const destSize = 90;
      const offsetX  = 48;
      const offsetY  = 75;

      if(this.isTransp) {
         ctx.save();
         ctx.globalAlpha = 0.5;
   
         ctx.drawImage(
            glo.walls_Img,
   
            // Source
            0,
            0,
            srcSize,
            srcSize,
            
            // Destination
            gridPos.x -offsetX +scroll.x,
            gridPos.y -offsetY +scroll.y,
            destSize +10,
            destSize,
         );
         
         ctx.restore();
         return;
      }
   
      ctx.drawImage(
         glo.walls_Img,

         // Source
         0,
         0,
         srcSize,
         srcSize,
         
         // Destination
         gridPos.x -offsetX +scroll.x,
         gridPos.y -offsetY +scroll.y,
         destSize +10,
         destSize,
      );
   }
   // ------------------ Tempory ------------------


}