
import {

} from "../utils/interfaces";

import { GameManager } from "./_Export";


// =====================================================================
// Viewport Class
// =====================================================================
export class Viewport {

   private GManager: GameManager;

   x:           number = 0;
   y:           number = 0;
   width:       number = 1400; // Has to match CSS canvas Isometircs.vue & Cartesian.vue
   height:      number = 800;  // Has to match CSS canvas Isometircs.vue & Cartesian.vue
   
   scrollSpeed: number = 7;
   detectSize:  number = 60;

   isScrolling: boolean = false;

   constructor(GManager: GameManager) {
      this.GManager = GManager;
   }

   setSize(document: Document) {
   
      this.width  = document.body.clientWidth;
      this.height = document.body.clientHeight;
   }

   const setComputed = () => {

      // IsoSelect Canvas
      glo.IsoSelectComputed!.e = glo.Scroll.x;
      glo.IsoSelectComputed!.f = glo.Scroll.y *2 -glo.GridParams.gridSize *0.5;
      glo.Canvas.isoSelect.style.transform = glo.IsoSelectComputed!.toString();
      
      // Terrain Canvas
      glo.TerrainComputed!.e = glo.Scroll.x;
      glo.TerrainComputed!.f = glo.Scroll.y;
      glo.Canvas.terrain.style.transform   = glo.TerrainComputed!.toString();
   }

   const scrollCam = () => {

      if(!isScrolling || isScollActive) return;
   
      const scrollBounds = setScrollBounds();
      const mousePos     = glo.SelectArea.currentPos;
      
      if(!mousePos) return
         
      const top:    boolean = Collision.point_toSquare(mousePos, scrollBounds.top);
      const right:  boolean = Collision.point_toSquare(mousePos, scrollBounds.right);
      const bottom: boolean = Collision.point_toSquare(mousePos, scrollBounds.bottom);
      const left:   boolean = Collision.point_toSquare(mousePos, scrollBounds.left);
   
      if(!top && !right && !bottom && !left) return isScrolling = false;
   
      if(top    && glo.Scroll.y <  glo.max_Y) glo.Scroll.y += glo.MouseSpeed;
      if(right  && glo.Scroll.x > -glo.max_X) glo.Scroll.x -= glo.MouseSpeed;
      if(bottom && glo.Scroll.y > -glo.max_Y) glo.Scroll.y -= glo.MouseSpeed;
      if(left   && glo.Scroll.x <  glo.max_X) glo.Scroll.x += glo.MouseSpeed;
   
      setComputed();
      isScrolling = true;
   }
   
   const mouseScroll = () => {
      
      if(!isScollActive) return;
      
      const { x: oldX,    y: oldY    } = glo.SelectArea.oldPos;
      const { x: mouseX,  y: mouseY  } = glo.SelectArea.currentPos;
   
      const isRange_X: boolean = (glo.Scroll.x < glo.max_X) && (glo.Scroll.x > -glo.max_X);
      const isRange_Y: boolean = (glo.Scroll.y < glo.max_Y) && (glo.Scroll.y > -glo.max_Y);
   
      if(isRange_X) glo.Scroll.x = mouseX -oldX;
      if(isRange_Y) glo.Scroll.y = mouseY -oldY;
      
      setComputed();
   }
}