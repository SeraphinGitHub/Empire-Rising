
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
   
   i:             number;
   j:             number;
   zIndex:        number = Infinity;

   position:      IPosition;
   screenPos:     IPosition = { x:0, y:0 };
   
   offset:        INumber;
   collider:      INumber;
   
   spriteID:      number;
   teamID:        number;
   buildTime:     number;
   buildSize:     number;
   spriteRatio:   number;
   spriteSize:    number;
   health:        number;
   baseHealth:    number;
   
   isSelected:    boolean = false;
   isHover:       boolean = false;
   isTransp:      boolean = false;

   img:           HTMLImageElement = new Image();

   constructor(params: any) {

      this.id           = params.id;
      this.name         = params.name;
      this.i            = params.i;
      this.j            = params.j;
      this.position     = params.position;
      this.offset       = params.offset;
      this.collider     = params.collider;
      this.spriteID     = params.spriteID;
      this.teamID       = params.teamID;
      this.buildTime    = params.buildTime;
      this.buildSize    = params.buildSize;
      this.spriteRatio  = params.spriteRatio;
      this.spriteSize   = params.spriteSize;
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

   setZindex(getCell: Function) {
      const { i, j, buildSize } = this;

      const cellID = `${ i }-${ j -buildSize +1 }`;
      const cell   = getCell(cellID);

      if(!cell) return;
      
      this.zIndex = cell.x - cell.y;
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawSprite(
      ctx:      CanvasRenderingContext2D,
      pos:      IPosition,
      VPpos:    IPosition,
   ) {
      
      const {
         img,
         spriteID,
         offset,
         spriteRatio,
         spriteSize,
         isTransp,
      } = this;

      const drawImg = () => {
         ctx.drawImage(
            img,

            // Source
            spriteSize * (spriteID -1),
            0,
            spriteSize,
            spriteSize,
            
            // Destination
            pos.x -offset.x -VPpos.x,
            pos.y -offset.y -VPpos.y,
            spriteSize *spriteRatio,
            spriteSize *spriteRatio,
         );
      }


      if(isTransp) {
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
         this.collider.radius *2, 0, Math.PI *2
      );
      ctx.fill();
      ctx.closePath();
   }

   drawCollider(
      ctx:   CanvasRenderingContext2D,
      pos:   IPosition,
      VPpos: IPosition,
   ) {
      const { radius, offsetY } = this.collider;

      ctx.fillStyle = "lime";
      ctx.beginPath();
      ctx.arc(
         pos.x -VPpos.x,
         pos.y -VPpos.y +offsetY,
         radius, 0, Math.PI *2
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