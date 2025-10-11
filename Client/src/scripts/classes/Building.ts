
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
   screenPos:     IPosition = { x:0, y:0 };

   collider:      INumber;
   
   spriteID:      number;
   teamID:        number;
   buildTime:     number;
   health:        number;
   baseHealth:    number;
   
   isSelected:    boolean = false;
   isHover:       boolean = false;
   isTransp:      boolean = false;

   img:           HTMLImageElement = new Image();

   constructor(params: any) {

      this.id           = params.id;
      this.name         = params.name;
      this.position     = params.position;
      this.collider     = params.collider;
      this.spriteID     = params.spriteID;
      this.teamID       = params.teamID;
      this.buildTime    = params.buildTime;
      this.health       = params.health;
      this.baseHealth   = params.baseHealth;

      this.setImageSource(params.spritePath, params.teamColor);
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   setTransparency() {
   
      // if(!this.isBlocked) return;

      // const {
      //    top,
      //    topRight,
      //    right,
      // } = this.getNeighbors(cellsList);
      
      // if(!top.isVacant
      // || !topRight.isVacant
      // || !right.isVacant) {
         
      //    return this.isTransp = true;
      // }

      // this.isTransp = false;
   }

   setImageSource(
      spritePath: string,
      teamColor:  string,
   ) {
      this.img.src = `${spritePath}${teamColor}.png`;
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawSprite(
      ctx:      CanvasRenderingContext2D,
      pos:      IPosition,
      VPpos:    IPosition,
   ) {
      
      const srcSize  = 280;
      const destSize = 90;
      const offsetX  = 48;
      const offsetY  = 75;

      const drawImg = () => {
         ctx.drawImage(
            this.img,

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


      if(this.isTransp) {
         ctx.save();
         ctx.globalAlpha = 0.5;

         drawImg();
         
         ctx.restore();
         return;
      };

      drawImg();
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