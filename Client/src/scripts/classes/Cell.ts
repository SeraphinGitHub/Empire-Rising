
import {
   IPosition,
   ICost,
   ICoordArray,
   INebList,
   ILineList,
} from "../utils/interfaces";

import {
   Grid,
} from "./_Export";


// =====================================================================
// Cell Class
// =====================================================================
export class Cell {
   
   id:             string;

   i:              number;
   j:              number;
   x:              number;
   y:              number;
   zIndex:         number;
   size:           number;
   cellPerSide:    number;

   center:         IPosition     = {x:0, y:0};

   agentIDset:     Set<number>   = new Set();
   collider:       ILineList     = {};
   nebStatusList:  INebList      = {};
   nebCoordList:   ICoordArray   = {
      top:         [ 0, -1,  false], // isDiagonal ==> false
      topRight:    [ 1, -1,  true ], // isDiagonal ==> true
      right:       [ 1,  0,  false],
      bottomRight: [ 1,  1,  true ],
      bottom:      [ 0,  1,  false],
      bottomLeft:  [-1,  1,  true ],
      left:        [-1,  0,  false],
      topLeft:     [-1, -1,  true ],
   };
   
   isVacant:       boolean = true;
   isBlocked:      boolean = false;
   isTargeted:     boolean = false;
   isOverlaped:    boolean = false;
   isTransp:       boolean = false;

   // ----------- Tempory -----------
   isDiffTile:     boolean = false;
   isWall:         boolean = false;
   // ----------- Tempory -----------

   constructor(
      zIndex:      number,
      cellPerSide: number,
      size:        number,
      i:           number,
      j:           number,
   ) {
      
      this.id          = `${i}-${j}`;
      this.i           = i;
      this.j           = j;
      this.x           = i *size;
      this.y           = j *size;
      this.zIndex      = zIndex;
      this.size        = size;
      this.cellPerSide = cellPerSide;
      
      this.init();
   }

   init() {
      this.setCenter();
      this.setCollider();
   }
   
   setCenter() {
      const { x, y, size } = this;

      this.center.x  = x +size *0.5;
      this.center.y  = y +size *0.5;
   }
   
   setCollider() {
      const { x,     y,    size  } = this;
      const { x: centX, y: centY } = this.center;

      // Set diamond corners coord
      this.collider = {
         top:    { startX: centX,   startY: y,       endX: x +size, endY: centY   },
         right:  { startX: x +size, startY: centY,   endX: centX,   endY: y +size },
         bottom: { startX: centX,   startY: y +size, endX: x,       endY: centY   },
         left:   { startX: x,       startY: centY,   endX: centX,   endY: y       },
      };
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   setNeighborsList() {

      for(const nebName in this.nebCoordList) {
         const nebArray = this.nebCoordList[nebName];

         this.checkExistNeb(nebName, nebArray);
      }
   }

   getNeighbors(
      cellsList: Map<string, Cell>,
   ): any {
      
      const neighbors: any = {};
      
      for(const nebName in this.nebStatusList) {
         const nebData = this.nebStatusList[nebName];

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
   
      this.nebStatusList[side] = neighbor[side];
   }

   isBlockedDiag(
      cellsList: Map<string, Cell>,
      neighbor:  Cell,
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

   setVacant(
      agentID: number,
      Grid:    Grid,
   ) {
      this.agentIDset.delete(agentID);
      
      if(this.agentIDset.size === 0) {
         Grid.occupiedCells.delete(this);
         this.isVacant = true;
      }
   }

   setOccupied(
      agentID: number,
      Grid:    Grid,
   ) {
      this.agentIDset.add(agentID);
      this.isVacant = false;
      
      Grid.addToOccupiedMap(this);
   }

   setTransparency(cellsList: Map<string, Cell>) {
   
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


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawInfos   (ctx: CanvasRenderingContext2D) {
         
      this.drawFrame(ctx);
      this.drawBlocked(ctx);
      this.drawVacancy(ctx);
      // this.drawID(ctx);
      // this.drawCenter(ctx);
      // this.drawCollider(ctx);
   }

   drawCenter  (ctx: CanvasRenderingContext2D) {
      const { x: cellX, y: cellY } = this.center;

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(cellX, cellY, 4, 0, Math.PI *2);
      ctx.fill();
      ctx.closePath();
   }

   drawFrame   (ctx: CanvasRenderingContext2D) {
      const { x, y, size } = this;

      ctx.strokeStyle = "black";
      ctx.lineWidth   = 1;
      ctx.strokeRect(x, y, size, size);
   }

   drawID      (ctx: CanvasRenderingContext2D) {
      const { id, center } = this;

      ctx.fillStyle = "black";
      ctx.font      = "16px Verdana";
      ctx.textAlign = "center";

      ctx.fillText(
         id,
         center.x,
         center.y
      );
   }

   drawData    (ctx: CanvasRenderingContext2D, costData: ICost) {
      
      ctx.fillStyle = "white";
      ctx.font      = "18px Verdana";
      ctx.textAlign = "left";
      
      const { x: cellX,  y: cellY } = this.center;
      const { hCost, gCost, fCost } = costData;
      
      const xPos = cellX -27;

      ctx.fillText(`h: ${hCost}`, xPos, cellY -12);
      ctx.fillText(`g: ${gCost}`, xPos, cellY +5 );
      ctx.fillText(`f: ${fCost}`, xPos, cellY +27);      
   }

   drawCollider(ctx: CanvasRenderingContext2D) {

      const { top, right, bottom, left } = this.collider;     

      ctx.fillStyle = "red";
      ctx.beginPath();

      ctx.moveTo(top.startX,    top.startY   );
      ctx.lineTo(right.startX,  right.startY );
      ctx.lineTo(bottom.startX, bottom.startY);
      ctx.lineTo(left.startX,   left.startY  );

      ctx.fill();
   }

   drawBlocked (ctx: CanvasRenderingContext2D) {

      if(!this.isBlocked) return;
      
      this.drawColor(ctx, "rgba(255, 0, 0, 0.7)")
   }

   drawVacancy (ctx: CanvasRenderingContext2D) {

      if(this.isVacant) return;
      
      this.drawColor(ctx, "rgba(0, 255, 255, 0.7)")
   }

   drawColor   (ctx: CanvasRenderingContext2D, color: string) {
      const { x, y, size } = this;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, size, size);
   }


   // ------------------ Tempory ------------------
   drawTile(
      ctx:   CanvasRenderingContext2D,
      VPpos: IPosition,
      img_1: HTMLImageElement,
      img_2: HTMLImageElement,
   ) {

      const frameX    = 0;
      const srcHeight = 500;
      const srcWidth  = 500;
      const destSize  = 58;
      const offsetX   = 26;
      const offsetY   = 12;

      let tileImg = img_1;

      if(this.isDiffTile) tileImg = img_2;

      ctx.drawImage(
         tileImg,

         // Source
         frameX *srcWidth,
         0,
         srcWidth,
         srcHeight,
         
         // Destination
         VPpos.x -offsetX,
         VPpos.y -offsetY,
         destSize,
         destSize,
      );
   }

   drawWall(
      ctx:   CanvasRenderingContext2D,
      pos:   IPosition,
      VPpos: IPosition,
      img:   HTMLImageElement,
   ) {

      const srcSize  = 280;
      const destSize = 90;
      const offsetX  = 48;
      const offsetY  = 75;
   
      ctx.drawImage(
         img,

         // Source
         0,
         0,
         srcSize,
         srcSize,
         
         // Destination
         pos.x -offsetX -VPpos.x,
         pos.y -offsetY -VPpos.y,
         destSize +10,
         destSize,
      );
   }
   // ------------------ Tempory ------------------


}