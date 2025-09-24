

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

   id:            number;
   teamID:        number;
   name:          string;
   
   popCost:       number;   
   health:        number;
   armor:         number;
   damages:       number;
   moveSpeed:     number;
   buildSpeed:    number;
   attackSpeed:   number;
   animDelay:     number;

   frameX:        number = 0;
   frameY:        number = 8;
   lastFrameY:    number = 8;
   animState:     number = 0;
   spriteCount:   number = 4;

   position:      IPosition;
   servPos:       IPosition = { x:0, y:0 };
   deltaPos:      IPosition = { x:0, y:0 };

   collider:      INumber;   
   curCell:       Cell;
   goalCell:      Cell;   
   nextCell:      Cell | null = null;
   pathID:        string[]  = [];
   path:          Cell  []  = [];

   hasReachNext:  boolean = false;
   hasArrived:    boolean = false;
   isMoving:      boolean = false;
   isSelected:    boolean = false;
   isAttacking:   boolean = false;

   isGatherable:  boolean = true; // ***************
   isGathering:   boolean = false; // ***************

   img:           HTMLImageElement = new Image();
   sprites:       INumber = { height: 64, width: 64, offsetY: 25 };
   bigSprites:    INumber = { height: 64, width: 192 };

   animSpecs = {
      walk:    { index: 6, spritesNumber: 9,  row: 2 },
      attack:  { index: 6, spritesNumber: 5,  row: 0 }, // ==> Tempory (sprites size different)
      gather:  { index: 6, spritesNumber: 8,  row: 1 },
      died:    { index: 1, spritesNumber: 10, row: 5 },
      idle:    { index: 6, spritesNumber: 1,  row: 2 },
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

   inMovement(state: boolean) {
      
      if(state) {
         this.isMoving  = state;
         this.animState = 1;
         return;
      }

      this.isMoving  = state;
      this.animState = 0;
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

   checkReachedNext(cell: Cell) {
      
      const { x: posX,  y: posY  } = this.position;
      const { x: cellX, y: cellY } = cell.center;
  
      if(posX !== cellX
      || posY !== cellY) {
         this.hasReachNext = false;
         return;
      }
      
      this.hasReachNext = true;
   }

   gatherRessource() {

      if(!this.isGatherable || !this.isGathering) return;

      this.animState = 3;
      this.setFacingSide(this.animSpecs.gather.row);
   }

   // =========================================================================================
   // Walk through path
   // =========================================================================================
   walkPath(getCell: Function) {

      if(!this.nextCell) return;

      this.hasReachNext = false;
      this.hasArrived   = false;
      this.inMovement(true);

      // Moving toward nextCell
      this.moveTo(this.nextCell);
      this.checkReachedNext(this.nextCell);

      // Arrived at nextCell
      if(!this.hasReachNext) return;

      this.hasReachNext = true;
      this.curCell    = this.nextCell;
      this.setNextCell(getCell);
      this.checkReachedNext(this.goalCell);
      
      if(!this.hasReachNext) return;

      this.hasArrived = true;

      this.gatherRessource();
      this.inMovement(false);
   }

   moveTo(nextCell: Cell) {
      
      const { x: posX,  y: posY  } = this.position;
      const { x: nextX, y: nextY } = nextCell.center;

      const deltaX = nextX -posX;
      const deltaY = nextY -posY;

      this.deltaPos = {
         x: deltaX,
         y: deltaY,
      }

      this.setFacingSide(this.animSpecs.walk.row);

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
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawPath(ctx: CanvasRenderingContext2D) {
      
      if(!this.path.length || this.hasArrived) return;

      const { path } = this;

      // Display path
      for(let i = 0; i < path.length; i++) {
         const curCell = path[i];
         
         if(i +1 < path.length) {
            const nextCell = path[i +1];
            this.drawPathLine(ctx, curCell, nextCell);
         }
      }

      // this.drawScanNebs(ctx);
   }

   drawScanNebs(ctx: CanvasRenderingContext2D) {
      
      // // Display scanned neighbors   
      // this.Pathfnder.closedSet.forEach((cell: Cell) => {
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
         this.frameX * width,
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

   drawPos(
      ctx: CanvasRenderingContext2D,
   ) {

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(
         this.servPos.x,
         this.servPos.y,
         this.collider.radius, 0, Math.PI *2
      );
      ctx.fill();
      ctx.closePath();
   }


   // =========================================================================================
   // Animation States
   // =========================================================================================
   updateAnimState(frame: number) {

      const { walk, attack, gather, died, idle } = this.animSpecs;

      switch(this.animState) {

         // Walk
         case 1:  this.animation(frame, walk.index,   walk.spritesNumber  );
         break;
         
         // Attack
         case 2:  this.animation(frame, attack.index, attack.spritesNumber);
         break;
         
         // Gather
         case 3:  this.animation(frame, gather.index, gather.spritesNumber);
         break;
         
         // Died
         case 4:  this.animation(frame, died.index,   died.spritesNumber  );
         break;
         
         // Idle
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

   setFacingSide(animRow: number) {

      const { x: deltaX, y: deltaY } = this.deltaPos;
      
      const isLeft  = deltaX < 0;
      const isRight = deltaX > 0;
      const isUp    = deltaY < 0;
      const isDown  = deltaY > 0;

      const spriteRow = animRow* this.spriteCount;

      if(isUp)    this.frameY = spriteRow +0;
      if(isLeft)  this.frameY = spriteRow +1;
      if(isDown)  this.frameY = spriteRow +3;
      if(isRight) this.frameY = spriteRow +0;

      if(isUp   && isLeft ) this.frameY = spriteRow +1;
      if(isUp   && isRight) this.frameY = spriteRow +0;
      if(isDown && isLeft)  this.frameY = spriteRow +2;
      if(isDown && isRight) this.frameY = spriteRow +3;
    
      this.lastFrameY = this.frameY;
   }
   
}