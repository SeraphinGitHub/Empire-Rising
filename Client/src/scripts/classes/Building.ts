
import {
   INumber,
   IPosition,
} from "../utils/interfaces";


// =====================================================================
// Building Class
// =====================================================================
export class Building {

   id:            number;
   name:          string;
   position:      IPosition;

   collider:      INumber;
   
   type:          number;
   teamID:        number;
   buildTime:     number;
   health:        number;
   baseHealth:    number;

   color:         string;

   isSelected:    boolean = false;


   constructor(params: any) {

      this.id           = params.id;
      this.name         = params.name;
      this.position     = params.position;
      this.collider     = params.collider;
      this.type         = params.type;
      this.teamID       = params.teamID;
      this.buildTime    = params.buildTime;
      this.health       = params.health;
      this.baseHealth   = params.baseHealth;
      this.color        = params.color;
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

      ctx.fillStyle = "cyan";
      ctx.font      = "400 18px Verdana";
      ctx.textAlign = "center";

      // Draw ID
      ctx.fillText(`${this.name  }`, x, y -70,);
      ctx.fillText(`${this.health}`, x, y -50,);
   }

}