
import {
   INumber,
   IPosition,
} from "../utils/interfaces";


// =====================================================================
// Node Class
// =====================================================================
export class Node {

   id:          number;
   teamID:      number;
   
   position:    IPosition;
   screenPos:   IPosition = { x:0, y:0 };
   
   name:        string;
   spriteID:    number;
   amount:      number;
   
   collider:    INumber;

   isSelected:  boolean = false;


   constructor(params: any) {
      
      this.id        = params.id;
      this.teamID    = params.teamID;
      this.position  = params.position;
      this.name      = params.name;
      this.spriteID  = params.spriteID;
      this.amount    = params.amount;
      this.collider  = params.collider;
   }


   drawSprite(
      ctx:   CanvasRenderingContext2D,
      pos:   IPosition,
      VPpos: IPosition,
      img:   HTMLImageElement,
   ) {

      const srcSize  = 400;

      let destSize = 65;
      let offsetX  = 32;
      let offsetY  = 40;

      if(this.spriteID > 4) {
         destSize = 120;
         offsetX  = 65;
         offsetY  = 105;
      }
   
      ctx.drawImage(
         img,

         // Source
         srcSize * (this.spriteID -1),
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

      const { x, y } = this.position;

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
      ctx.fillText(`${this.name  }`, x, y -70,);
      ctx.fillText(`${this.amount}`, x, y -50,);
   }
}