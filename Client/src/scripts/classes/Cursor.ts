
import {
   ICanvas,
   IPosition,
   IPositionList,
   ISquare,
} from "../utils/interfaces";

import { GameManager } from "./_Export";


// =====================================================================
// Cursor Class
// =====================================================================
export class Cursor {

   private GManager: GameManager;
   
   Canvas:         ICanvas;
   cellSize:       number;
   halfCellSize:   number;
   oldPos:         IPositionList = {};
   curPos:         IPositionList = {};

   selectArea:     {} = {};
   areaOptions:    {} = {
      lineWidth:   2,
      borderColor: "dodgerblue",
      filledColor: "rgba(30, 144, 255, 0.3)",
   };

   hoverCell:      any = {
      id:  "",
      pos: {},
   };
   
   isMoving:       boolean = false;
   isSelecting:    boolean = false;
   isScollActive:  boolean = false;


   constructor(GManager: GameManager) {

      this.GManager     = GManager;
      this.Canvas       = GManager.Canvas;
      this.cellSize     = GManager.cellSize;
      this.halfCellSize = this.cellSize *0.5;

      this.init();
   }

   init() {
      window.addEventListener("mousemove", (event) => this.move  (event));
      window.addEventListener("mousedown", (event) => this.click (event, "Down"));
      window.addEventListener("mouseup",   (event) => this.click (event, "Up"  ));

      document.body.oncontextmenu = (event) => {
         event.preventDefault();
         event.stopPropagation();
      }      
   }


   // =========================================================================================
   // Mouse Behaviors
   // =========================================================================================
   click(
      event: MouseEvent,
      state: string,
   ) {

      if(state === "Down") this.setPosition(event, true);

      switch(event.which) {

         // Left click
         case 1: {

            if(state === "Down") { 
               this.isSelecting = true;
               this.setSelectArea();
            }
            
            if(state === "Up") {
               this.isSelecting = false;
               this.GManager.unitDiselection();
            }
            
         } break;


         // Scroll click
         case 2: {

            if(state === "Down") {
               this.isScollActive = true;
               isScrolling   = false;
            }
            
            if(state === "Up"  ) {
               this.isScollActive = false;
               isScrolling   = true;
            }
            
         } break;


         // Right click
         case 3: {

            if(state === "Down") {
               this.GManager.setTarget(this.hoverCell.id);
            }
         
            if(state === "Up") {
               
            }

         } break;
      }
   }

   move(event: MouseEvent) {
      
      this.setPosition(event, false);
      this.GManager.screenPos_toGridPos(this.curPos.iso);
      
      if(this.GManager.isGridScope()) this.setHoverCell(this.GManager.gridPos);

      this.GManager.unitSelection();

      // isScrolling = true;
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
   
   setHoverCell(gridPos: IPosition) {
      
      const { x: gridX, y: gridY }: IPosition = gridPos;
   
      const cellPos: IPosition = {
         x: gridX - (gridX % this.cellSize),
         y: gridY - (gridY % this.cellSize),
      };
   
      this.hoverCell = {
         id: `${cellPos.x /this.cellSize}-${cellPos.y /this.cellSize}`,
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
      } 
   }

   const setScrollBounds = () => {

      const detSize = glo.DetectSize;
   
      const {
         x:      vpX,
         y:      vpY,
         width:  vpWidth,
         height: vpHeight,
      }: ISquare = glo.Viewport;
   
      return {
   
         top: {
            x:       vpX,
            y:       vpY,
            width:   vpWidth,
            height:  detSize,
         },
   
         right: {
            x:       vpX +vpWidth -detSize,
            y:       vpY,
            width:   detSize,
            height:  vpHeight,
         },
   
         bottom: {
            x:       vpX,
            y:       vpY +vpHeight -detSize,
            width:   vpWidth,
            height:  detSize,
         },
   
         left: {
            x:       vpX,
            y:       vpY,
            width:   detSize,
            height:  vpHeight,
         },
      }
   }

   


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   const drawSelectArea = () => {

      let selected   = glo.SelectArea;
   
      const { x: oldX,     y: oldY     }: IPosition = selected.oldPos;
      const { x: currentX, y: currentY }: IPosition = selected.currentPos;
   
      // Set rect size
      selected.width  = currentX -oldX;
      selected.height = currentY -oldY;
   
      // Set rect params
      glo.Ctx.selection.lineWidth   = selected.lineWidth;
      glo.Ctx.selection.strokeStyle = selected.borderColor;
      glo.Ctx.selection.fillStyle   = selected.filledColor;
   
      // Draw borders
      glo.Ctx.selection.strokeRect(
         oldX,
         oldY,
         selected.width,
         selected.height
      );
      
      // Draw filled rect
      glo.Ctx.selection.fillRect(
         oldX,
         oldY,
         selected.width,
         selected.height
      );
   }
}