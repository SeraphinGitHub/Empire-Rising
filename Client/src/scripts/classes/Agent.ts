

import {
   INumber,
   INumberList,
   IPosition,
} from "../utils/interfaces";

import {
   Cell,
} from "./_Export";


// =====================================================================
// Agent Class
// =====================================================================
export class Agent {

   id:               number;
   zIndex:           number = Infinity;
   teamID:           number;
   name:             string;
   
   popCost:          number;   
   health:           number;
   armor:            number;
   damages:          number;
   moveSpeed:        number;
   buildSpeed:       number;
   attackSpeed:      number;
   animDelay:        number;
   
   state:            number = -1;
   frameX:           number = 0;
   frameY:           number = 2;
   
   nebName:          string = "";

   position:         IPosition;
   servPos:          IPosition = { x:0, y:0 };
   deltaPos:         IPosition = { x:0, y:0 };
   screenPos:        IPosition = { x:0, y:0 };

   collider:         INumber;   
   curCell:          Cell;
   goalCell:         Cell;   
   nextCell:         Cell | null = null;
   lastPathID:       string[]  = [];
   pathID:           string[]  = [];
   path:             Cell  []  = [];

   isUnit:           boolean;
   isWorker:         boolean;

   isHover:          boolean = false;
   isSelected:       boolean = false;
   isMoving:         boolean = false;
   isAttacking:      boolean = false;
   isGathering:      boolean = false;
   isWalkActive:     boolean = false;
   isGatherActive:   boolean = false;
   hasArrived:       boolean = false;
   hasReachNext:     boolean = false;
   hasResetAnim:     boolean = false;
   
   img:              HTMLImageElement = new Image();
   spriteSpecs:      INumberList;
   spriteParams:     INumber = { srcY: 0, size: 0, offsetY: 25 };
   
   // -----------------
   // States
   // -----------------
   // die    => 0
   // idle   => 1
   // walk   => 2
   // attack => 3
   // gather => 4

   
   constructor(params: any) {

      this.id          = params.id;
      this.teamID      = params.teamID;
      this.position    = params.position;
      this.curCell     = params.curCell;
      this.goalCell    = params.curCell;
      
      this.name        = params.name;
      this.collider    = params.collider;
      this.popCost     = params.popCost;
      this.health      = params.health;
      this.armor       = params.armor;
      this.damages     = params.damages;
      this.moveSpeed   = params.moveSpeed;
      this.buildSpeed  = params.buildSpeed;
      this.attackSpeed = params.attackSpeed;
      this.animDelay   = params.animDelay;
      this.spriteSpecs = params.spriteSpecs;
      this.isUnit      = params.isUnit;
      this.isWorker    = params.isWorker;

      this.setImageSource (params);
      this.setSpriteParams("idle");
   }

   initPack() {
      return {
         id:            this.id,
         isSelected:    this.isSelected,
      }
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   setImageSource    (params: any) {
      const { spritePath, teamColor } = params;
      this.img.src = `${spritePath}${teamColor}.png`;
   }

   setSpriteParams   (animStateName: string) {
      const { srcY: srcY_a, size: size_a } = this.spriteSpecs[animStateName];
      const { srcY: srcY_b, size: size_b } = this.spriteParams;

      if(srcY_a === srcY_b
      && size_a === size_b) {
         return;
      }

      this.spriteParams.srcY = srcY_a;
      this.spriteParams.size = size_a;
   }

   setMoveStateTo    (isMoving: boolean) {

      if(this.isMoving === isMoving) return;

      this.isMoving     = isMoving;
      this.hasArrived   = !isMoving;
      this.hasResetAnim = true;
      
      if(this.isGatherActive) return;

      if(isMoving) this.setSpriteParams("walk");
      else         this.setSpriteParams("idle");
   }

   isPathDiff        (
      oldPathID: string[],
      newPathID: string[],
   ): boolean {

      if(oldPathID.length !== newPathID.length) return true;
      
      return oldPathID.some((cellID, index) => cellID !== newPathID[index]);
   }

   setNextCell       (getCell: Function) {

      const targetCell: Cell | null = getCell(this.pathID[0]) ?? null;
      
      this.nextCell = targetCell;
      this.pathID.shift();
   }
   
   setGoalCell       (getCell: Function) {

      const goalCell: Cell = getCell(this.pathID[ this.pathID.length -1 ]);
      this.goalCell = goalCell;
   }

   checkReachedNext  (cell: Cell) {

      if(!cell) return;
      
      const { x: posX,  y: posY  } = this.position;
      const { x: cellX, y: cellY } = cell.center;
  
      if(posX !== cellX
      || posY !== cellY) {
         this.hasReachNext = false;
         return;
      }
      
      this.hasReachNext = true;
   }

   toggleWalking     (
      pathID:  string[],
      getCell: Function,
   ) {
      
      if(this.isWalkActive || !this.isPathDiff(pathID, this.lastPathID)) {
         this.isWalkActive = false;
         return;
      }

      this.isWalkActive = true;
      
      this.lastPathID = [...pathID];
      this.pathID     = pathID;
      this.path       = pathID.map((id: string) => getCell(id));
      this.setNextCell( getCell );
      this.setGoalCell( getCell );

      if(pathID.length === 0) this.setMoveStateTo(false);
   }
   
   toggleGathering   () {

      if(this.state !== 4) {
         this.isGatherActive = false;
         return;
      }

      if(this.isGatherActive) return
      this.isGatherActive = true;

      this.setSpriteParams("gather");
      this.hasResetAnim = true;
   }


   // =========================================================================================
   // Agent Update (Every frame)
   // =========================================================================================
   walkPath          (getCell: Function) {

      if(!this.nextCell) return;
      
      this.hasReachNext    = false;
      this.setMoveStateTo  (true);
      
      // Moving toward nextCell
      this.moveTo          (this.nextCell);
      this.checkReachedNext(this.nextCell);

      // Arrived at nextCell
      if(!this.hasReachNext) return;

      this.hasReachNext    = true;
      this.curCell         = this.nextCell;
      this.setNextCell     (getCell);
      this.checkReachedNext(this.goalCell);
      
      if(!this.hasReachNext) return;

      this.setMoveStateTo  (false);
   }

   moveTo            (nextCell: Cell) {
      
      const { x: posX,  y: posY  } = this.position;
      const { x: nextX, y: nextY } = nextCell.center;

      const deltaX = nextX -posX;
      const deltaY = nextY -posY;

      this.deltaPos = {
         x: deltaX,
         y: deltaY,
      }

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

   update            (
      Frame:   number,
      getCell: Function,
   ) {
      this.walkPath        (getCell);
      this.updateAnimState (Frame);
      this.setFacingSide   ();
   }

   serverSync        (
      data:    any,
      cell:    Cell,
      getCell: Function,
   ) {
      const {
         isVacant,
         state,
         position,
         nodeNebName,
         isGathering,
         pathID,
      }: any = data;
      
      if(cell.isVacant    !== isVacant   ) cell.isVacant    = isVacant;
      if(this.state       !== state      ) this.state       = state;
      if(this.curCell     !== cell       ) this.curCell     = cell;
      if(this.servPos.x   !== position.x ) this.servPos.x   = position.x;
      if(this.servPos.y   !== position.y ) this.servPos.y   = position.y;
      if(this.nebName     !== nodeNebName) this.nebName     = nodeNebName;
      if(this.isGathering !== isGathering) this.isGathering = isGathering;
      
      this.toggleWalking  (pathID, getCell);
      this.toggleGathering();
   }


   // =========================================================================================
   // Animation States
   // =========================================================================================
   updateAnimState   (frame: number) {
      const { die, idle, walk, gather, attack } = this.spriteSpecs;

      switch(this.state) {
         case 0: this.animation( frame, die    ); break;
         case 1: this.animation( frame, idle   ); break;
         case 2: this.animation( frame, walk   ); break;
         case 3: this.animation( frame, attack ); break;
         case 4: this.animation( frame, gather ); break;
      }
   }

   animation         (
      frame:     number,
      stateSpec: any,
   ) {
      const { index, spriteNum } = stateSpec;

      if(this.hasResetAnim) {
         this.hasResetAnim = false;
         this.frameX = 0;
         return;
      }

      if(frame % index === 0) {         
         if(this.frameX < spriteNum -1) this.frameX++;

         else {
            this.frameX = 0;
            // if(!this.isAnimable) this.isAnimable = true;
         }
      }
   }

   setFacingSide     () {
      const { x: deltaX, y: deltaY } = this.deltaPos;

      const isLeft  = deltaX < 0;
      const isRight = deltaX > 0;
      const isUp    = deltaY < 0;
      const isDown  = deltaY > 0;

      let tempFrameY = 0;

      if(isUp              ) tempFrameY = 0; // Facing Up
      if(isLeft            ) tempFrameY = 1; // Facing Left
      if(isDown            ) tempFrameY = 3; // Facing Right
      if(isRight           ) tempFrameY = 0; // Facing Up

      if(isUp   && isLeft  ) tempFrameY = 1; // Facing Left
      if(isUp   && isRight ) tempFrameY = 0; // Facing Up
      if(isDown && isLeft  ) tempFrameY = 2; // Facing Down
      if(isDown && isRight ) tempFrameY = 3; // Facing Right

      if(this.isGathering) switch(this.nebName) {

         case "top":          tempFrameY = 3; break;
         case "topRight":     tempFrameY = 2; break;
         case "right":        tempFrameY = 1; break;
         case "bottomRight":  tempFrameY = 1; break;
         case "bottom":       tempFrameY = 0; break;
         case "bottomLeft":   tempFrameY = 0; break;
         case "left":         tempFrameY = 0; break;
         case "topLeft":      tempFrameY = 3; break;
      }

      if(this.frameY !== tempFrameY) this.frameY = tempFrameY;
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawPath          (ctx: CanvasRenderingContext2D) {
      
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

   drawScanNebs      (ctx: CanvasRenderingContext2D) {
      
      // // Display scanned neighbors   
      // this.Pathfnder.closedSet.forEach((cell: Cell) => {
      //    cell.drawColor(ctx, "rgba(255, 145, 0, 0.6)");
         
      //    // const costData = this.costMap.get(cell.id)!;
      //    // cell.drawData (ctx, costData);
      // });
   }

   drawPathLine      (
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

   drawCollider      (
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

   drawSprite        (
      ctx:   CanvasRenderingContext2D,
      pos:   IPosition,
      VPpos: IPosition,
   ) {
      const { srcY, size, offsetY } = this.spriteParams;

      ctx.drawImage(
         this.img,

         // Source
         this.frameX * size,
         this.frameY * size +srcY,
         size,
         size,      
         
         // Destination
         pos.x -VPpos.x - (size *0.5),
         pos.y -VPpos.y - (size *0.5) -offsetY,
         size,
         size,
      );
   }

   drawSelect        (
      ctx:      CanvasRenderingContext2D,
      isSelect: boolean,
   ) {
      
      let color = "yellow";

      if(isSelect) color = "cyan";

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

   drawInfos         (
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

   drawID            (
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

   drawServerPos     (
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

}