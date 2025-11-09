
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
   zIndex:        number    = Infinity;
   
   offset:        INumber;
   collider:      INumber;
   selectRing:    INumber;
   footPrint:     string[];
   
   spriteID:      number;
   teamID:        number;
   buildTime:     number;
   buildSize:     number;
   spriteRatio:   number;
   spriteSize:    number;
   health:        number;
   baseHealth:    number;
   displayState:  number;

   imgState:      INumber  = {
      normal:   1,
      transp:   0,
      valid:    2,
      unValid: -1,
   }
   
   isSelected:    boolean  = false;
   isHover:       boolean  = false;

   img:           HTMLImageElement = new Image();

   colorType:     string[] = [
      "Blue",
      "Green",
      "Orange",
      "Pink",
      "Purple",
      "Red",
      "Yellow",
   ];


   constructor(params: any) {

      this.id           = params.id;
      this.name         = params.name;
      this.position     = params.position;
      this.offset       = params.offset;
      this.collider     = params.collider;
      this.selectRing   = params.selectRing;
      this.footPrint    = params.footPrint;
      this.spriteID     = params.spriteID;
      this.teamID       = params.teamID;
      this.buildTime    = params.buildTime;
      this.buildSize    = params.buildSize;
      this.spriteRatio  = params.spriteRatio;
      this.spriteSize   = params.spriteSize;
      this.health       = params.health;
      this.baseHealth   = params.baseHealth;
      this.displayState = this.imgState.normal;

      this.setImageSource(params.spritePath, params.teamColor);
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   setImageSource(
      spritePath: string,
      teamColor:  number,
   ) {
      const colorName = this.colorType[teamColor];
      const imgSrc    = `${spritePath}${colorName}.png`;
      
      if(imgSrc.includes("undefined")) {
         console.log({ setImageSource_BuildingClass: "Path is broken - missing teamColor !" });
         return;
      }

      this.img.src  = imgSrc;
   }

   setZindex(
      pos:     INumber,
      getCell: Function,
   ) {
      const { buildSize } = this;
      const { i, j      } = pos;

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
         displayState,
         imgState,
      } = this;

      const { normal, transp, valid, unValid } = imgState;

      const { x, y, size} = {
         x:    pos.x -offset.x -VPpos.x,
         y:    pos.y -offset.y -VPpos.y,
         size: spriteSize *spriteRatio,
      }

      const drawImg = () => {
         ctx.drawImage(
            img,

            // Source
            spriteSize * (spriteID -1),  0,  spriteSize,  spriteSize,
            
            // Destination
            x, y, size, size
         );
      }

      const drawTinted = (color: string) => {
         
         ctx.save();
         ctx.globalAlpha = 0.5;

         drawImg();
         
         const offScreen  = document.createElement("canvas");
         const offCtx     = offScreen.getContext("2d")!;
         
         // Create offScreen canvas 
         offScreen.width  = size;
         offScreen.height = size;
         offCtx.drawImage(img, 0, 0, size, size);

         // Draw filter
         offCtx.globalCompositeOperation = "source-atop";
         offCtx.fillStyle                = color;
         offCtx.fillRect(0, 0, size, size);

         // Draw filtered sprite
         ctx.drawImage(offScreen, x, y);

         ctx.restore();
      };

      switch(displayState) {

         case normal:
            drawImg();
         break;

         case transp:
            ctx.save();
            ctx.globalAlpha = 0.5;
            drawImg();
            ctx.restore();
         break;

         case valid:
            drawTinted("rgba(0, 255, 0, 0.5)"); // Green transp
         break;

         case unValid:
            drawTinted("rgba(255, 0, 0, 0.5)"); // Red transp
         break;
      }
   }

   drawSelect(
      ctx:      CanvasRenderingContext2D,
      pos:      IPosition,
      VPpos:    IPosition,
      ringImg:  any,
      isSelect: boolean,
   ) {
      
      let ringType = isSelect ? 1 : 0;

      const { size: ringSize, offsetX, offsetY } = this.selectRing;
      const { img, spriteSize } = ringImg;
      const { x,   y,    size } = {
         x:    pos.x -VPpos.x -offsetX,
         y:    pos.y -VPpos.y -offsetY,
         size: ringSize,
      }

      ctx.drawImage(
         img,

         // Source
         spriteSize *ringType,  0,  spriteSize,  spriteSize,
         
         // Destination
         x, y, size, size
      );
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
         pos.y -VPpos.y -offsetY,
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