
import {
   INumber,
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
   teamID:      number;
   position:    IPosition;
   
   cell:        Cell;
   name:        string;
   type:        number;
   quantity:    number;
   
   collider:    INumber = { offsetY: 0, radius: 40 };

   isSelected:  boolean = false;


   constructor(params: any) {
      
      this.id        = params.id;
      this.teamID    = params.teamID;
      this.position  = params.position;
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

   drawSelect(
      ctx:      CanvasRenderingContext2D,
      isSelect: boolean,
   ) {
      
      let color = "yellow";

      if(isSelect) color = "cyan";

      const { x, y } = this.cell.center;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
         x,
         y,
         this.collider.radius, 0, Math.PI *2
      );
      ctx.fill();
      ctx.closePath();
   }

   drawInfos(
      ctx:   CanvasRenderingContext2D,
      pos:   IPosition,
      VPpos: IPosition
   ) {

      const { x, y } = {
         x: pos.x -VPpos.x,
         y: pos.y -VPpos.y,
      };

      // Draw frame
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(x -50, y -90, 100, 45);

      ctx.fillStyle = "yellow";
      ctx.font      = "400 18px Verdana";
      ctx.textAlign = "center";

      // Draw ID
      ctx.fillText(`${this.name    }`, x, y -70,);
      ctx.fillText(`${this.quantity}`, x, y -50,);
   }
}