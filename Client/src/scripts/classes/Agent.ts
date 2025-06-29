

import {
   INumber,
   IPosition,
} from "../utils/interfaces";

import {
   Cell,
} from "./_Export";


// =====================================================================
// Agent Class
// =====================================================================
export class Agent {


   pathID: string[] = [];




   id:          number;
   teamID:      number;
   name:        string;
   
   popCost:     number;   
   health:      number;
   armor:       number;
   damages:     number;
   moveSpeed:   number;
   buildSpeed:  number;
   attackSpeed: number;
   animDelay:   number;

   frameX:      number = 0;
   frameY:      number = 8;
   lastFrameY:  number = 8;
   animState:   number = 0;

   position:    IPosition;
   collider:    INumber;   
   curCell:     Cell;
   goalCell:    Cell;   
   nextCell:    Cell | null = null;   

   isMoving:    boolean = false;
   isSelected:  boolean = false;
   isAttacking: boolean = false;

   img:         HTMLImageElement = new Image();
   sprites:     INumber = { height: 64, width: 64, offsetY: 25 };
   bigSprites:  INumber = { height: 64, width: 192 };

   animSpecs = {
      idle:    { index: 6, spritesNumber: 1  },
      walk:    { index: 6, spritesNumber: 9  },
      attack:  { index: 6, spritesNumber: 5  },
      died:    { index: 1, spritesNumber: 10 },
   };

   
   constructor(params: any) {
      const { stats } = params;

      this.id          = params.id;
      this.teamID      = params.teamID;
      this.position    = params.position;
      this.curCell     = params.curCell;
      this.goalCell    = params.curCell;
      
      this.name        = stats.name;
      this.collider    = stats.collider;
      this.popCost     = stats.popCost;
      this.health      = stats.health;
      this.armor       = stats.armor;
      this.damages     = stats.damages;
      this.moveSpeed   = stats.moveSpeed;
      this.buildSpeed  = stats.buildSpeed;
      this.attackSpeed = stats.attackSpeed;
      this.animDelay   = stats.animDelay;

      this.setImageSource(stats.basePath, params.teamColor);
   }

   initPack() {
      return {
         id:            this.id,
         isSelected:    this.isSelected,
      }
   }

   updatePack() {
      return {
         id:            this.id,
         isSelected:    this.isSelected,
         teamID:        this.teamID,
         position:      this.position,
         curCellID:     this.curCell.id,
      }
   }

   setImageSource(
      basePath:  string,
      teamColor: string,
   ) {
      this.img.src = `${basePath}${teamColor}.png`;
   }


   setNextCell(getCell: Function) {

      const targetCell: Cell | null = getCell(this.pathID[0]) ?? null;
      
      this.nextCell = targetCell;
      this.pathID.shift();
   }
   
   setGoalCell(getCell: Function) {

      const goalCell: Cell = getCell(this.pathID[ this.pathID.length -1 ]);
      this.goalCell = goalCell;
   }

   hasReached(cell: Cell): boolean {
      
      const { x: posX,  y: posY  } = this.position;
      const { x: cellX, y: cellY } = cell.center;
  
      if(posX !== cellX
      || posY !== cellY) {
         return false;
      }
      
      return true;
   }

   // =========================================================================================
   // Walk through path
   // =========================================================================================
   walkPath(getCell: Function) {

      if(!this.nextCell) return;

      this.isMoving  = true;
      this.animState = 1;

      // Moving toward nextCell
      this.moveTo(this.nextCell);

      // console.log({ curCell: this.curCell.id }); // ******************************************************
      // console.log({ nextCell: this.nextCell.id }); // ******************************************************

      // Arrived at nextCell
      if(!this.hasReached(this.nextCell)) return;

      this.curCell = this.nextCell;
      this.setNextCell(getCell);
      
      
      if(!this.hasReached(this.goalCell)) return;

      // console.log({ curCell: this.curCell.id }); // ******************************************************
      // console.log({ nextCell: this.nextCell }); // ******************************************************
      // console.log({ goalCell: this.goalCell.id }); // ******************************************************
      // console.log({ pathID: this.pathID }); // ******************************************************
      
      this.isMoving  = false;
      this.animState = 0;
   }

   moveTo(nextCell: Cell) {
      
      const { x: posX,  y: posY  } = this.position;
      const { x: nextX, y: nextY } = nextCell.center;

      const deltaX = nextX -posX;
      const deltaY = nextY -posY;

      const isLeft  = deltaX < 0;
      const isRight = deltaX > 0;
      const isUp    = deltaY < 0;
      const isDown  = deltaY > 0;

      const dist = Math.hypot(deltaX,  deltaY);

      if(dist === 0) {
         this.position.x = nextX;
         this.position.y = nextY;
         this.curCell    = nextCell;
         return;
      }

      const moveX = deltaX /dist * Math.min(dist, this.moveSpeed);
      const moveY = deltaY /dist * Math.min(dist, this.moveSpeed);

      this.position.x += moveX;
      this.position.y += moveY;

      if(isDown)  this.frameY = 11;
      if(isUp)    this.frameY = 8; // 9
      if(isLeft)  this.frameY = 9;
      if(isRight) this.frameY = 8; // 11

      if(isDown && isLeft)  this.frameY = 10;
      if(isDown && isRight) this.frameY = 11;
      if(isUp   && isLeft ) this.frameY = 9;
      if(isUp   && isRight) this.frameY = 8;
    
      this.lastFrameY = this.frameY;
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawPath(ctx: CanvasRenderingContext2D) {
      
      // if(!this.Pathfinder.path.length) return;

      // const { path } = this.Pathfinder;

      // // Display path
      // for(let i = 0; i < path.length; i++) {
      //    const curCell = path[i];
         
      //    if(i +1 < path.length) {
      //       const nextCell = path[i +1];
      //       this.drawPathLine(ctx, curCell, nextCell);
      //    }
      // }

      // this.drawScanNebs(ctx);
   }

   drawScanNebs(ctx: CanvasRenderingContext2D) {
      
      // Display scanned neighbors   
      // this.Pathfinder.closedSet.forEach((cell: Cell) => {
      //    cell.drawColor(ctx, "rgba(255, 145, 0, 0.6)");
         
      //    // const costData = this.costMap.get(cell.id)!;
      //    // cell.drawData (ctx, costData);
      // });
   }

   drawPathLine(
      ctx:      CanvasRenderingContext2D,
      curCell:  Cell,
      nextCell: Cell,
   ) {

      ctx.strokeStyle = "lime";
      ctx.beginPath();
      ctx.moveTo(
         curCell.center.x,
         curCell.center.y
      );
      ctx.lineTo(
         nextCell.center.x,
         nextCell.center.y
      );
      ctx.lineWidth = 6;
      ctx.stroke();
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

   drawSprite(
      ctx:   CanvasRenderingContext2D,
      pos:   IPosition,
      VPpos: IPosition,
   ) {
      const { width: originalWidth, height, offsetY } = this.sprites;

      let width = originalWidth;

      if(this.isAttacking) width = this.bigSprites.width;

      ctx.drawImage(
         this.img!,

         // Source
        (this.frameX +this.animState) * width,
         this.frameY * height,
         width,
         height,      
         
         // Destination
         pos.x -VPpos.x - width  *0.5,
         pos.y -VPpos.y - height *0.5 -offsetY,
         width,
         height,
      );
   }

   drawSelect(
      ctx:   CanvasRenderingContext2D,
      color: string,
   ) {
   
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
         this.position.x,
         this.position.y,
         this.collider.radius *2, 0, Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
   }

   drawInfos(
      ctx:   CanvasRenderingContext2D,
      pos:   IPosition,
      VPpos: IPosition
   ) {
      const adjustedPos = {
         x: pos.x -VPpos.x,
         y: pos.y -VPpos.y,
      };

      this.drawID(ctx, adjustedPos);
   }

   drawID(
      ctx: CanvasRenderingContext2D,
      pos: IPosition,
   ) {
      const { x, y } = pos;

      // Draw frame
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(x -25, y -70, 50, 20);

      ctx.fillStyle = "lime";
      ctx.font      = "600 18px Verdana";
      ctx.textAlign = "center";

      const text = `${this.id}`;

      // Draw ID
      ctx.fillText(text, x, y -54,);
   }


   // =========================================================================================
   // Animation States
   // =========================================================================================
   updateAnimState(frame: number) {
      const { walk, attack, died, idle } = this.animSpecs;

      switch(this.animState) {

         case 1:  this.animation(frame, walk.index,   walk.spritesNumber  );
         break;

         case 2:  this.animation(frame, attack.index, attack.spritesNumber);
         break;
      
         case 3:  this.animation(frame, died.index,   died.spritesNumber  );
         break;

         default: this.animation(frame, idle.index,   idle.spritesNumber  );
         break;
      }
   }

   animation(
      frame:      number,
      index:      number,
      spritesNum: number,
   ) {
      
      if(frame % index === 0) {         
         if(this.frameX < spritesNum -2) this.frameX++;
   
         else {
            this.frameX = 0;
            // if(!this.isAnimable) this.isAnimable = true;
         }
      }
   }
   
}