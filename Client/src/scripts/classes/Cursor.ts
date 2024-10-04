
import {
   ICanvas,
   IPosition,
   IPositionList,
} from "../utils/interfaces";

import { GameManager } from "./_Export";


// =====================================================================
// Cursor Class
// =====================================================================
export class Cursor {

   private GManager: GameManager;
   
   Canvas:         ICanvas;
   oldPos:         IPositionList = {};
   curPos:         IPositionList = { cart: {x:0, y:0}, iso: {x:0, y:0} };

   hoverCell:      any = { id: "", pos: {} };
   selectArea:     any = {};
   areaOptions:    any = {
      lineWidth:   2,
      borderColor: "dodgerblue",
      filledColor: "rgba(30, 144, 255, 0.3)",
   };

   isSelecting:    boolean = false;
   isScollClick:   boolean = false;


   constructor(GManager: GameManager) {
      this.GManager = GManager;
      this.Canvas   = GManager.Canvas;

      this.init();
   }

   init() {
      window.addEventListener("mousemove", (event) => this.move  (event));
      window.addEventListener("mousedown", (event) => this.click (event, "Down"));
      window.addEventListener("mouseup",   (event) => this.click (event, "Up"  )); 
   }


   // =========================================================================================
   // Mouse Behaviors
   // =========================================================================================
   handle_LeftClick  (state: string) {
      const GM = this.GManager;

      if(state === "Down") { 
         this.isSelecting = true;
         this.setSelectArea();
      }
      
      if(state === "Up") {
         this.isSelecting = false;
         GM.unitDiselection();
      }
   }

   handle_ScrollClick(state: string) {
      const GM = this.GManager;

      if(state === "Down") {
         this.isScollClick = true;
         GM.Viewport.isScrollDetect = false;
      }
      
      if(state === "Up"  ) {
         this.isScollClick = false;
         GM.Viewport.isScrollDetect = true;
         GM.Viewport.setOldPos();
      }
   }

   handle_RightClick (state: string) {
      const GM = this.GManager;

      if(state === "Down") {
         GM.setTargetCell(this.hoverCell.id);
      }
   
      if(state === "Up") {
         
      }
   }

   click(
      event: MouseEvent,
      state: string,
   ) {

      if(state === "Down") this.setPosition(event, true);

      switch(event.which) {

         // Left click
         case 1: this.handle_LeftClick(state);
         break;

         // Scroll click
         case 2: this.handle_ScrollClick(state);
         break;

         // Right click
         case 3: this.handle_RightClick(state);
         break;
      }
   }

   move(event: MouseEvent) {
      
      const GM = this.GManager;

      // Set mouse position
      this.setPosition(event, false);

      // Set mouse to grid position
      GM.gridPos = GM.screenPos_toGridPos(this.curPos.iso);
      
      // Set hoverCell from mouse grid position
      if(GM.isMouseGridScope()) this.setHoverCell();
      
      if(this.isScollClick) GM.Viewport.mouseScrollCam();

      this.updateSelectArea();
      GM.unitSelection();
      GM.Viewport.isScrollDetect = true;
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   setPosition(
      event:     MouseEvent,
      isClicked: boolean,
   ) {

      const { isometric, selection }: ICanvas    = this.Canvas;
      const { clientX,   clientY   }: MouseEvent = event;
      const { top: selectTop, left: selectLeft } = selection.getBoundingClientRect();
      const { top: isoTop,    left: isoLeft    } = isometric.getBoundingClientRect();
            
      const mousePos: IPositionList = {
         cart: {
            x: Math.floor(clientX -selectLeft),
            y: Math.floor(clientY -selectTop ),
         },
   
         iso: {
            x: Math.floor(clientX -isoLeft),
            y: Math.floor(clientY -isoTop ),
         },
      }

      if(isClicked) this.oldPos = mousePos;
      else          this.curPos = mousePos;
   }
   
   setHoverCell() {
      
      const { gridPos: { x: gridX, y: gridY }, cellSize } = this.GManager;

      const cellPos: IPosition = {
         x: gridX - (gridX % cellSize),
         y: gridY - (gridY % cellSize),
      };
   
      this.hoverCell = {
         id: `${cellPos.x /cellSize}-${cellPos.y /cellSize}`,
         pos: cellPos,
      }
   }

   setSelectArea() {

      const { x: oldX, y: oldY }: IPosition = this.oldPos.cart;
      const { x: curX, y: curY }: IPosition = this.curPos.cart;

      this.selectArea = {
         x:      oldX,
         y:      oldY,
         width:  curX -oldX,
         height: curY -oldY,
      };
   }

   updateSelectArea() {

      if(!this.isSelecting) return;

      this.GManager.clearCanvas("selection");
      this.setSelectArea();
      this.drawSelectArea();
   }

   extendSelectArea() {

      // if(!this.isSelecting) return;
      
      // const GM = this.GManager;

      // const { x: oldVPx, y: oldVPy } = GM.Viewport.oldPos;
      // const { selectArea           } = this;

      // selectArea.x      -= oldVPx;
      // selectArea.y      -= oldVPy;
      // selectArea.width  += oldVPx;
      // selectArea.height += oldVPy;

      // GM.clearCanvas("selection");
      // this.drawSelectArea();
   }

   
   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawSelectArea() {
      
      const ctx_Selection = this.GManager.Ctx.selection;
      const { x,   y,    width,       height     } = this.selectArea;
      const { lineWidth, borderColor, filledColor} = this.areaOptions;

      // Set style
      ctx_Selection.lineWidth   = lineWidth;
      ctx_Selection.strokeStyle = borderColor;
      ctx_Selection.fillStyle   = filledColor;
   
      // Draw area
      ctx_Selection.fillRect  (x, y, width, height);
      ctx_Selection.strokeRect(x, y, width, height);
   }

   drawHoverCell() {

      if(!this.GManager.isMouseGridScope()) return;
      
      const GM                      = this.GManager;
      const ctx_isometric           = GM.Ctx.isometric;
      const { x: cellX, y: cellY }  = this.hoverCell.pos;

      // Draw hoverCell frame
      ctx_isometric.strokeStyle = "yellow";
      ctx_isometric.lineWidth   = 4;
      ctx_isometric.strokeRect(cellX, cellY, GM.cellSize, GM.cellSize);
   }
   

}