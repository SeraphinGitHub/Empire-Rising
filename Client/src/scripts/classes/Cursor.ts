
import {
   ICanvas,
   IPosition,
   IPositionList,
   IPositionList_List,
   ISquare,
} from "../utils/interfaces";

import { GameManager } from "./_Export";


// =====================================================================
// Cursor Class
// =====================================================================
export class Cursor {

   private GManager: GameManager;
   
   Canvas:         ICanvas;
   
   areaOptions:    any           = {
      lineWidth:   2,
      borderColor: "dodgerblue",
      selectColor: "rgba( 30, 144, 255, 0.3)",
      targetColor: "blue",
   };
   selectArea:     ISquare       = { x:0,   y:0,   width:0,   height:0 };
   targetArea:     ISquare       = { x:0,   y:0,   width:0,   height:0 };
   
   oldPos:         IPositionList_List = {
      select: { cart: {x:0, y:0}, iso: {x:0, y:0} },
      scroll: { cart: {x:0, y:0}, iso: {x:0, y:0} },
      target: { cart: {x:0, y:0}, iso: {x:0, y:0} },
   };
   curPos:         IPositionList = { cart: {x:0, y:0}, iso: {x:0, y:0} };
   hoverCell:      any           = { id: "",           pos: {x:0, y:0} };
   
   isSelecting:    boolean = false;
   isTargeting:    boolean = false;
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
         GM.Viewport.resetScroll();
      }
      
      if(state === "Up") {
         GM.unitDiselection();
      }
   }

   handle_ScrollClick(state: string) {
      const GM = this.GManager;

      if(state === "Down") {
         GM.Viewport.isScrollDetect = false;
         this.resetSelectArea();
         this.isScollClick = true;
      }
      
      if(state === "Up"  ) {
         GM.Viewport.setOldPos();
         GM.Viewport.isScrollDetect = true;
         this.isScollClick = false;
      }
   }

   handle_RightClick (state: string) {
      const GM = this.GManager;

      if(state === "Down") {
         // GM.setTargetCell(this.hoverCell.id);

         this.resetSelectArea();
         this.setTargetArea();
      }
      
      if(state === "Up") {
         this.isTargeting = false;
      }
   }

   click(
      event: MouseEvent,
      state: string,
   ) {

      if(state === "Down") this.setPosition(event, true);
      if(state === "Up"  ) this.isSelecting = false;

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

      this.update_SelectArea();
      // this.update_TargetArea();

      GM.unitSelection();
      GM.Viewport.isScrollDetect = true;
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   cellCoord(
      value:    number,
      cellSize: number,
   ) {
      return value -(value % cellSize);
   }

   setPosition(
      event:     MouseEvent,
      isPressed: boolean,
   ) {

      const { isometric,            selection  } = this.Canvas;
      const { top: selectTop, left: selectLeft } = selection.getBoundingClientRect();
      const { top: isoTop,    left: isoLeft    } = isometric.getBoundingClientRect();
      const { clientX, clientY, which          } = event;
      const { oldPos                           } = this;
            
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
      
      if(isPressed) {
         if(which === 1) oldPos.select = mousePos;
         if(which === 2) oldPos.scroll = mousePos;
         if(which === 3) oldPos.target = mousePos;
      }
      
      this.curPos = mousePos;
   }
   
   setHoverCell() {
      
      const { gridPos: { x: gridX, y: gridY }, cellSize } = this.GManager;

      const cellPos: IPosition = {
         x: this.cellCoord(gridX, cellSize),
         y: this.cellCoord(gridY, cellSize),
      };
   
      this.hoverCell = {
         id: `${cellPos.x /cellSize}-${cellPos.y /cellSize}`,
         pos: cellPos,
      }
   }

   setSelectArea() {

      const { GManager, selectArea, oldPos, curPos } = this;

      const { x: oldX,    y: oldY    } = oldPos.select.cart;
      const { x: curX,    y: curY    } = curPos.cart;
      const { x: scrollX, y: scrollY } = GManager.Viewport.scroll.curDelta;

      selectArea.x      =       oldX -scrollX;
      selectArea.y      =       oldY -scrollY;
      selectArea.width  = curX -oldX +scrollX;
      selectArea.height = curY -oldY +scrollY;
   }

   resetSelectArea() {

      if(!this.isSelecting) return;
      
      this.GManager.clearCanvas("selection");
      this.isSelecting = false;

      const { selectArea } = this;

      selectArea.x      = 0;
      selectArea.y      = 0;
      selectArea.width  = 0;
      selectArea.height = 0;
   }
   
   update_SelectArea() {

      if(!this.isSelecting || this.isScollClick) return;

      this.GManager.clearCanvas("selection");
      this.setSelectArea();
      this.drawSelectArea();
   }

   setTargetArea() {

      this.isTargeting = true;

      const { GManager, targetArea } = this;
      const { Grid,     cellSize   } = GManager;
      const { x: oldX,  y: oldY    } = GManager.screenPos_toGridPos(this.oldPos.target.iso);

      const width   = 160;
      const height  = 120;
      const gridX   = oldX -width  *0.5;
      const gridY   = oldY -height +cellSize;
      const targetX = this.cellCoord(gridX, cellSize);
      const targetY = this.cellCoord(gridY, cellSize);

      targetArea.x      = targetX,
      targetArea.y      = targetY,
      targetArea.width  = width;
      targetArea.height = height;


      // Search cells IDs from area
      const colNum = width  /cellSize;
      const rowNum = height /cellSize;

      let cellIDset: Set<string> = new Set();


      // *******************************************
      // Get all cells IDs
      // *******************************************
      for(let c = 0; c < colNum; c++) {
         for(let r = 0; r < rowNum; r++) {
            
            cellIDset.add(`${(targetX + cellSize *c) /cellSize}-${(targetY + cellSize *r) /cellSize}`);
         }
      }


      // *******************************************
      // Reset all Agents goalCells
      // *******************************************
      for(const agent of GManager.oldSelectList) {
         agent.Pathfinder.goalCell = null;
      }


      // *******************************************
      // Set all Agents goalCells
      // *******************************************
      for(const cellID of cellIDset) {
         const cell = Grid.cellsList.get(cellID)!;
         
         if(cell.isTargeted) continue;
         
         for(const agent of GManager.oldSelectList) {
            const { goalCell } = agent.Pathfinder;
            
            if(cell.isTargeted || goalCell !== null) continue;

            cell.isTargeted           = true;
            agent.Pathfinder.goalCell = cell;
         }
      }


      // *******************************************
      // Start all Agents search path
      // *******************************************
      for(const agent of GManager.oldSelectList) {
         agent.Pathfinder.searchPath(Grid.cellsList);
      }
   }

   update_TargetArea() {

      if(!this.isTargeting || this.isScollClick) return;

      const { GManager, targetArea } = this;
      const { x: oldX,  y: oldY    } = targetArea;
      const { x: curX,  y: curY    } = GManager.screenPos_toGridPos(this.curPos.iso);
      
      const cellSize    = GManager.cellSize;
      const cellSize_2x = cellSize *2;
      const dist        = curY -oldY;
      const step        = 20;

      // console.log( dist); // ******************************************************

      if(dist % step === 0
      && dist < 0
      && targetArea.width > cellSize) {
         
         if(dist > -500) {
            targetArea.width  -= cellSize_2x;
            targetArea.height += cellSize_2x;

            // console.log(1); // ******************************************************
         }
         
         else {
            targetArea.width  += cellSize_2x;
            targetArea.height -= cellSize_2x;

            // console.log(2); // ******************************************************
         }
      }
   }

   
   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawSelectArea() {
      
      const { GManager, selectArea, areaOptions   } = this;
      const { x,   y,    width,       height      } = selectArea;
      const { lineWidth, borderColor, selectColor } = areaOptions;
      const ctx_Selection = GManager.Ctx.selection;

      // Set style
      ctx_Selection.lineWidth   = lineWidth;
      ctx_Selection.strokeStyle = borderColor;
      ctx_Selection.fillStyle   = selectColor;
   
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
   
   drawTargetArea() {

      if(!this.isTargeting) return;

      const { GManager, targetArea, areaOptions } = this;
      const { x, y, width, height               } = targetArea;
      const { targetColor                       } = areaOptions;
      const ctx_isometric                         = GManager.Ctx.isometric;

      ctx_isometric.fillStyle = targetColor;
      ctx_isometric.fillRect(x, y, width, height);
   }

}