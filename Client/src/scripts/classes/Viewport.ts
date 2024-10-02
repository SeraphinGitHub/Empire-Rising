
import {
   IBoolean,
   IPosition,
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

   x:                number  = 0;
   y:                number  = 0;
   width:            number  = 1400; // Has to match CSS canvas Isometircs.vue & Cartesian.vue
   height:           number  = 800;  // Has to match CSS canvas Isometircs.vue & Cartesian.vue
   
   scrollSpeed:      number  = 7;
   detectSize:       number  = 60;

   // Constants ==> Do not modify
   limit_X:          number  = 0.7;
   limit_Y:          number  = 0.7 *0.5;
   
   isScrollDetect:   boolean = false;
   
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

   setComputed(scroll: IPosition) {

      const { x: scrollX, y: scrollY } = scroll;
      const { isometric,  terrain    } = this.GManager.Canvas;
      
      // Update CSS canvas isometric & terrain
      this.updateComputed(this.isoComputed, scrollX, scrollY *2 -this.GManager.halfGrid);
      this.updateComputed(this.terComputed, scrollX, scrollY);
      
      // Apply transformations
      isometric.style.transform = this.isoComputed!.toString();
      terrain  .style.transform = this.terComputed!.toString();
   }

   updateComputed(
      computed: any,
      x:        number,
      y:        number
   ) {
      computed.e = x;
      computed.f = y;
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
      const GM = this.GManager;
      
      let scroll = GM.offset.scroll;
      const { isTop, isRight, isBottom, isLeft } = collide;
      const { scrollSpeed, limit_X, limit_Y    } = this;

      if(isTop    && scroll.y <  limit_Y) scroll.y += scrollSpeed;
      if(isRight  && scroll.x > -limit_X) scroll.x -= scrollSpeed;
      if(isBottom && scroll.y > -limit_Y) scroll.y -= scrollSpeed;
      if(isLeft   && scroll.x <  limit_X) scroll.x += scrollSpeed;
   
      this.setComputed(scroll);
      // GM.Grid.setViewCellsList();
   }
   
   mouseScrollCam() {
      
      if(!this.GManager.Cursor.isScollClick) return;
      
      const { limit_X,      limit_Y } = this;
      const { oldPos,       curPos  } = this.GManager.Cursor;
      const { x: oldX,   y: oldY    } = oldPos.cart;
      const { x: mouseX, y: mouseY  } = curPos.cart;
      
      let scroll = this.GManager.offset.scroll;
      const isRange_X: boolean = (scroll.x < limit_X) && (scroll.x > -limit_X);
      const isRange_Y: boolean = (scroll.y < limit_Y) && (scroll.y > -limit_Y);
   
      if(isRange_X) scroll.x = mouseX -oldX;
      if(isRange_Y) scroll.y = mouseY -oldY;
      
      this.setComputed(scroll);
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawScrollBounds() {
      const GM = this.GManager;

      if(GM.isFrameHidden) return;
   
      for(const i in this.viewBounds) {
         const { x, y, width, height }: ISquare = this.viewBounds[i];
   
         GM.Ctx.assets.fillStyle = "rgba(255, 0, 255, 0.5)";
         GM.Ctx.assets.fillRect(x, y, width, height);
      }
   }

}