
import {
   IBoolean,
   IPosition,
   IScroll,
   ISquare,
   ISquareList,
} from "../utils/interfaces";

import {
   GameManager,
} from "./_Export";


// =====================================================================
// Viewport Class
// =====================================================================
export class Viewport {

   private GManager: GameManager;

   x:                number    = 0;
   y:                number    = 0;
   width:            number    = 1400; // Has to match CSS canvas Isometircs.vue & Cartesian.vue
   height:           number    = 1000;  // Has to match CSS canvas Isometircs.vue & Cartesian.vue
   detectSize:       number    = 30;

   oldPos:           IPosition = {x:0, y:0};
   scroll:           IScroll = {
      speed:         8,
      oldDelta:      {x:0, y:0},
      curDelta:      {x:0, y:0},
   }
   
   isScrollDetect:   boolean   = false;
   
   isoComputed:      DOMMatrix   | undefined = undefined;
   terComputed:      DOMMatrix   | undefined = undefined;
   viewBounds:       ISquareList | undefined = undefined;

   constructor(
      GManager: GameManager,
      docBody:  any,
   ) {
      this.GManager = GManager;
      this.init(docBody);
   }


   init(docBody: any) {

      // this.setSize(docBody);
      this.setDOMMatrix();
      this.setViewBounds();
   }

   setSize(docBody: any) {
      this.width  = docBody.clientWidth;
      this.height = docBody.clientHeight;
   }

   setDOMMatrix() {
      // CSS Canvas scroll
      this.isoComputed = new DOMMatrix(window.getComputedStyle(this.GManager.Canvas.isometric).transform);
      this.terComputed = new DOMMatrix(window.getComputedStyle(this.GManager.Canvas.terrain  ).transform);
   }

   setViewBounds() {
      const { x, y, width, height, detectSize } = this;
      
      const rightX  = x +width  -detectSize;
      const bottomY = y +height -detectSize;

      this.viewBounds = {
         top:    { x: x,      y: y,       width: width,       height:  detectSize },
         right:  { x: rightX, y: y,       width: detectSize,  height:  height     },
         bottom: { x: x,      y: bottomY, width: width,       height:  detectSize },
         left:   { x: x,      y: y,       width: detectSize,  height:  height     },
      }
   }

   setComputed() {

      const { x: vpX,     y: vpY  } = this;
      const { isometric,  terrain } = this.GManager.Canvas;
      
      // Update CSS canvas isometric & terrain
      this.updateComputed(this.isoComputed, vpX, vpY *2 +this.GManager.halfGrid);
      this.updateComputed(this.terComputed, vpX, vpY);
      
      // Apply transformations
      isometric.style.transform = this.isoComputed!.toString();
      terrain  .style.transform = this.terComputed!.toString();
   }

   updateComputed(
      computed: any,
      x:        number,
      y:        number
   ) {
      computed.e = -x;
      computed.f = -y;
   }

   getGridPos(): IPosition {

      const GM = this.GManager;
      const { x, y } = this;
      const { x: VPgridX, y: VPgridY } = GM.screenPos_toGridPos({ x, y });

      return {
         x: VPgridX,
         y: VPgridY +GM.gridSize,
      }
   }

   setOldPos() {
      const { x, y, oldPos } = this;
      oldPos.x = x;
      oldPos.y = y;
   }

   resetScroll() {
      const { oldDelta, curDelta } = this.scroll;

      oldDelta.x += curDelta.x;
      oldDelta.y += curDelta.y;

      curDelta.x = 0;
      curDelta.y = 0;
   }


   // =========================================================================================
   // ScrollCam
   // =========================================================================================
   detectScrolling() {

      if(!this.isScrollDetect || this.GManager.Cursor.isScollClick) return;
      
      const GM       = this.GManager;
      const mousePos = GM.Cursor.curPos.cart;

      const { top, right, bottom, left } = this.viewBounds!;
         
      const isTop:    boolean = GM.Collision.point_toSquare( mousePos, top    );
      const isRight:  boolean = GM.Collision.point_toSquare( mousePos, right  );
      const isBottom: boolean = GM.Collision.point_toSquare( mousePos, bottom );
      const isLeft:   boolean = GM.Collision.point_toSquare( mousePos, left   );
   
      if(!isTop && !isRight && !isBottom && !isLeft) return this.isScrollDetect = false;

      this.scrollCam({ isTop, isRight, isBottom, isLeft });
   }

   scrollCam(collide: IBoolean) {

      const { isTop, isRight,  isBottom, isLeft } = collide;
      const { speed, oldDelta, curDelta         } = this.scroll;
      const { x: VPgridX,      y: VPgridY       } = this.getGridPos();
      const { gridSize                          } = this.GManager;
      
      const gridEdge  = gridSize +speed;
      const halfSpeed = speed *0.5;

      const inner = {
         top:    VPgridY > 0,
         right:  VPgridX < gridEdge,
         bottom: VPgridY < gridEdge,
         left:   VPgridX > 0,
      };

      const allow = {
         top:    isTop    && inner.top    && inner.right,
         right:  isRight  && inner.bottom && inner.right,
         bottom: isBottom && inner.left   && inner.bottom,
         left:   isLeft   && inner.left   && inner.top,
      };

      const singleCollision = 
         ( isTop    ? 1 : 0 )
        +( isBottom ? 1 : 0 )
        +( isLeft   ? 1 : 0 )
        +( isRight  ? 1 : 0 )
      ;
      
      if(singleCollision === 1) {

         if(allow.top   ) curDelta.y -= speed;
         if(allow.right ) curDelta.x += speed;
         if(allow.bottom) curDelta.y += speed;
         if(allow.left  ) curDelta.x -= speed;
      }

      else {
         if(allow.top    && isLeft  ) { curDelta.x -= speed; curDelta.y -= halfSpeed }
         if(allow.right  && isTop   ) { curDelta.x += speed; curDelta.y -= halfSpeed }
         if(allow.bottom && isRight ) { curDelta.x += speed; curDelta.y += halfSpeed }
         if(allow.left   && isBottom) { curDelta.x -= speed; curDelta.y += halfSpeed }
      }

      this.x = curDelta.x +oldDelta.x;
      this.y = curDelta.y +oldDelta.y;

      this.setOldPos();
      this.setComputed();
      this.GManager.Cursor.resize_SelectArea();
   }
   
   mouseScrollCam() {
      const GM = this.GManager;
      
      if(!GM.Cursor.isScollClick || !GM.isMouseGridScope()) return;

      const {    gridSize                } = GM;
      const {    oldPos,       curPos    } = GM.Cursor;
      const { x: oldMouseX, y: oldMouseY } = oldPos.scroll.cart;
      const { x: curMouseX, y: curMouseY } = curPos.cart;
      const { x: VPgridX,   y: VPgridY   } = this.getGridPos();
      const { x: oldX,      y: oldY      } = this.oldPos;
      const {    oldDelta,     curDelta  } = this.scroll;

      const inner = {
         top:    VPgridY > 0,
         right:  VPgridX < gridSize,
         bottom: VPgridY < gridSize,
         left:   VPgridX > 0,
      };

      if(inner.right && inner.left
      && inner.top   && inner.bottom) {

         oldDelta.x = 0;
         oldDelta.y = 0;
         curDelta.x = oldMouseX -curMouseX +oldX;
         curDelta.y = oldMouseY -curMouseY +oldY;
         this.x     = curDelta.x;
         this.y     = curDelta.y;
      }
      
      this.setComputed();
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawInfos(GM: GameManager) {

      if(!GM.show_VP) return;

      const { assets, isometric } = GM.Ctx;

      this.drawCenter(isometric);
      this.drawBounds(assets);
   }

   drawCenter(ctx: CanvasRenderingContext2D) {

      const { x, y } = this.getGridPos();

      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI *2);
      ctx.fill();
      ctx.closePath();
   }

   drawBounds(ctx: CanvasRenderingContext2D) {
   
      for(const i in this.viewBounds) {
         const { x, y, width, height }: ISquare = this.viewBounds[i];
   
         ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
         ctx.fillRect(x, y, width, height);
      }
   }

}