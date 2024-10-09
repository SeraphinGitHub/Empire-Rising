
import {
   ICanvas,
   IPosition,
   IPosList,
   IPosList_List,
   ISquare,
} from "../utils/interfaces";

import { Agent, GameManager } from "./_Export";


// =====================================================================
// Cursor Class
// =====================================================================
export class Cursor {

   private GManager: GameManager;
   
   Canvas:         ICanvas;
   
   areaOptions:    any      = {
      select: {
         lineWidth:     2,
         borderColor:  "dodgerblue",
         color:        "rgba( 30, 144, 255, 0.3)",
      },

      target: {
         separator:     10,
         resizeStep:    4,
         color:        "blue",
      },
   };

   oldPos:         IPosList_List = {
      select: { cart: {x:0, y:0}, iso: {x:0, y:0} },
      scroll: { cart: {x:0, y:0}, iso: {x:0, y:0} },
      target: { cart: {x:0, y:0}, iso: {x:0, y:0} },
   };

   curPos:         IPosList = { cart: {x:0, y:0}, iso: {x:0, y:0} };
   selectArea:     ISquare  = { x:0,   y:0,   width:0,   height:0 };
   targetArea:     ISquare  = { x:0,   y:0,   width:0,   height:0 };
   hoverCell:      any      = { id:"", pos: {x:0, y:0}            };

   isSelecting:    boolean  = false;
   isTargeting:    boolean  = false;
   isScollClick:   boolean  = false;


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

         GM.TEST_WallMode();
         GM.TEST_UnitMode();
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
      
      if(state === "Down") {
         this.isTargeting = true;
         this.setTargetArea();
         this.resetSelectArea();
      }
      
      if(state === "Up") {
         this.startAgentPathfinding()
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

      this.resize_SelectArea();
      this.resize_TargetArea();

      GM.unitSelection();
      GM.Viewport.isScrollDetect = true;
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   cellCoord(
      coord:    number,
      cellSize: number,
   ): number {

      return coord -(coord % cellSize);
   }
      
   indexID(
      coord:    number,
      value:    number,
      index:    number,
      cellSize: number,
   ): number {

      return ( coord +value - (cellSize * (index +1)) ) /cellSize;
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
            
      const mousePos = {
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
   
   resize_SelectArea() {

      if(!this.isSelecting || this.isScollClick) return;

      this.GManager.clearCanvas("selection");
      this.setSelectArea();
      this.drawSelectArea();
   }
   
   setTargetCell() {
      const { GManager, hoverCell } = this;
      const { Grid, oldSelectList } = GManager;
      
      if(!GManager.isMouseGridScope()) return;
      
      const { cellsList }   = Grid;
      const targetCell      = cellsList.get(hoverCell.id)!;
      
      if(targetCell.isBlocked || !targetCell.isVacant) return;
      
      const [ agent      ]  = oldSelectList;
      const { Pathfinder }  = agent;
      
      targetCell.isTargeted = true;
      Pathfinder.hasTarget  = true;
      Pathfinder.goalCell   = targetCell;
      Pathfinder.searchPath(cellsList);
   }

   setTargetArea() {

      const { GManager, targetArea, oldPos, areaOptions } = this;
      
      const { separator               } = areaOptions.target;
      const { cellSize, oldSelectList } = GManager;
      const { x: oldX,  y: oldY       } = GManager.screenPos_toGridPos(oldPos.target.iso);

      const unitCount   = oldSelectList.size;

      const step        = Math.min (unitCount, separator);
      const range       = Math.ceil(unitCount /step);
      const width       = step  *cellSize;
      const height      = range *cellSize;
      const gridX       = oldX -(width -cellSize) *0.5;
      const gridY       = oldY -height +cellSize;

      targetArea.x      = this.cellCoord(gridX, cellSize);
      targetArea.y      = this.cellCoord(gridY, cellSize);
      targetArea.width  = width;
      targetArea.height = height;
   }

   startAgentPathfinding() {

      const { GManager, targetArea } = this;
      const { Grid,       cellSize } = GManager;
      const { x, y, width,  height } = targetArea;

      // Search cells IDs from area
      const colNum = width  /cellSize;
      const rowNum = height /cellSize;
      
      let sortedUnitList = new Set<Agent>();
      
      // Get all cells IDs
      for(let r = 0; r < rowNum; r++) {
         const rowID = this.indexID(y, height, r, cellSize);
         
         for(let c = 0; c < colNum; c++) {
            const colID = this.indexID(x, width, c, cellSize);
            const cell  = GManager.getCell(`${colID}-${rowID}`);

            if(!cell || cell.isTargeted || cell.isBlocked || !cell.isVacant) continue;
            
            // Set all Agents goalCells
            for(const agent of GManager.oldSelectList) {
               const { Pathfinder } = agent;
               
               if(cell.isTargeted || Pathfinder.hasTarget) continue;
               
               cell.isTargeted      = true;
               Pathfinder.hasTarget = true;
               Pathfinder.goalCell  = cell;

               GManager.oldSelectList.delete(agent);
               sortedUnitList.add(agent);
            }
         }
      }


      // Start all Agents search path
      for(const agent of sortedUnitList) {
         agent.Pathfinder.searchPath(Grid.cellsList);
         GManager.oldSelectList.add(agent);
      }
   }

   resize_TargetArea() {

      if(!this.isTargeting || this.isScollClick) return;

      const { GManager, targetArea, curPos, areaOptions } = this;

      const { resizeStep              } = areaOptions.target;
      const { cellSize, oldSelectList } = GManager;
      const { y: oldY,  width, height } = targetArea;
      const { y: curY                 } = GManager.screenPos_toGridPos(curPos.iso);
      
      const unitCount   = oldSelectList.size;
      const cellSize_2x = cellSize *2;
      const resizeDist  = curY -oldY;
      const isExpanding = resizeDist > 0;

      if(resizeDist % resizeStep !== 0) return;

      if((isExpanding    && width  > cellSize_2x)
      || (resizeDist < 0 && height > cellSize_2x)) {

         const adjust      = isExpanding ? -cellSize : cellSize;
         const tempWidth   = width +adjust;
         const cellsCount  = tempWidth /cellSize;
         targetArea.width  = tempWidth;
         targetArea.height = Math.ceil(unitCount /cellsCount) *cellSize;
   
         if((tempWidth /cellSize) % 2 !== 0) return;

         const offset  = isExpanding ? cellSize : -cellSize;
         targetArea.x += offset;
         targetArea.y -= offset;
      }
   }

   
   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawSelectArea() {
      
      const { GManager, selectArea, areaOptions } = this;
      const { x,   y,    width,       height    } = selectArea;
      const { lineWidth, borderColor, color     } = areaOptions.select;
      const ctx_Selection = GManager.Ctx.selection;

      // Set style
      ctx_Selection.lineWidth   = lineWidth;
      ctx_Selection.strokeStyle = borderColor;
      ctx_Selection.fillStyle   = color;
   
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
      const { color                             } = areaOptions.target;
      const ctx_isometric                         = GManager.Ctx.isometric;

      ctx_isometric.fillStyle = color;
      ctx_isometric.fillRect(x, y, width, height);
   }

}