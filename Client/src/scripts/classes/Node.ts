
import {
   IPosition,
} from "../utils/interfaces";

import {
   Cell,
} from "./_Export";


// =====================================================================
// Node Class
// =====================================================================
export class Node {

   id:          number;
   
   cell:        Cell;
   name:        string;
   type:        number;
   quantity:    number;

   isSelected:  boolean = false;


   constructor(params: any) {
      
      this.id        = params.id;
      this.cell      = params.cell;
      this.name      = params.name;
      this.type      = params.type;
      this.quantity  = params.quantity;
   }


   draw(
      ctx:   CanvasRenderingContext2D,
      pos:   IPosition,
      VPpos: IPosition,
      img:   HTMLImageElement,
   ) {

      const srcSize  = 400;
      const destSize = 65;
      const offsetX  = 32;
      const offsetY  = 40;
   
      ctx.drawImage(
         img,

         // Source
         srcSize * (this.type -1),
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
}