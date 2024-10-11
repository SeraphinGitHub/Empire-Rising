
import {
   ICanvas,
   IPosition,
   IPosList,
   IPosList_List,
   ISquare,
} from "../utils/interfaces";

import {
   Cell,
   Agent,
   GameManager,
} from "./_Export";


// =====================================================================
// Cursor Class
// =====================================================================
export class Cursor {

   private GM:     GameManager;
   
   Canvas:         ICanvas;
   
   areaOptions:    any = {
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

   curPos:         IPosList    = { cart: {x:0, y:0}, iso: {x:0, y:0} };
   selectArea:     ISquare     = { x:0,   y:0,   width:0,   height:0 };
   targetArea:     ISquare     = { x:0,   y:0,   width:0,   height:0 };
   wallArea:       ISquare     = { x:0,   y:0,   width:0,   height:0 };
   hoverPos:       any         = { cellID:"",    coord: {x:0, y:0}   };

   firstWallCell:  Cell | null = null;
   wallsID_List:   Set<string> = new Set();

   isSelecting:    boolean     = false;
   isTargeting:    boolean     = false;
   isScollClick:   boolean     = false;

   hasWallPoint:   boolean     = true;


   constructor(GManager: GameManager) {
      this.GM       = GManager;
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
   handle_LeftClick  (GM: GameManager, state: string) {

      if(state === "Down") {
         this.isSelecting = true;
         
         this.hasWallPoint = !this.hasWallPoint;
         this.setWallArea(GM); // *******************************
         
         GM.TEST_UnitMode();
         GM.Viewport.resetScroll();
      }
      
      if(state === "Up") {
         GM.unitDiselection();
      }
   }

   handle_ScrollClick(GM: GameManager, state: string) {

      if(state === "Down") {
         GM.Viewport.isScrollDetect = false;
         this.resetSelectArea(GM);
         this.isScollClick = true;
      }
      
      if(state === "Up"  ) {
         GM.Viewport.setOldPos();
         GM.Viewport.isScrollDetect = true;
         this.isScollClick = false;
      }
   }

   handle_RightClick (GM: GameManager, state: string) {
      
      if(state === "Down") {
         this.isTargeting = true;
         this.setTargetArea  (GM);
         this.resetSelectArea(GM);
      }
      
      if(state === "Up") {
         this.startAgentPF(GM)
         this.isTargeting = false;
      }
   }

   click(
      event: MouseEvent,
      state: string,
   ) {
      const { GM } = this;

      if(state === "Down") this.setPosition(GM, event, true);
      if(state === "Up"  ) this.isSelecting = false;

      switch(event.which) {

         // Left click
         case 1: this.handle_LeftClick  (GM, state);
         break;

         // Scroll click
         case 2: this.handle_ScrollClick(GM, state);
         break;

         // Right click
         case 3: this.handle_RightClick (GM, state);
         break;
      }
   }

   move(event: MouseEvent) {
      
      const { GM } = this;

      this.setPosition(GM, event, false);
      
      this.setHoverPos      (GM);
      this.update_SelectArea(GM);
      this.update_TargetArea(GM);

      GM.unitSelection();
      GM.Viewport.mouseScrollCam(GM);
      GM.Viewport.isScrollDetect = true;
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   getCellCoord(
      coord:    number,
      cellSize: number,
   ): number {

      return coord -(coord % cellSize);
   }
      
   getIndexID(
      coord:    number,
      value:    number,
      index:    number,
      cellSize: number,
   ): number {

      return ( coord +value - (cellSize * (index +1)) ) /cellSize;
   }

   setPosition(
      GM:        GameManager,
      event:     MouseEvent,
      isPressed: boolean,
   ) {

      const { Canvas, oldPos                   } = this;
      const { top: selectTop, left: selectLeft } = Canvas.selection.getBoundingClientRect();
      const { top: isoTop,    left: isoLeft    } = Canvas.isometric.getBoundingClientRect();
      const { clientX, clientY, which          } = event;
            
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
      
      this.curPos = mousePos;
      GM.gridPos  = GM.screenPos_toGridPos(mousePos.iso);

      if(!isPressed) return;

      if(which === 1) oldPos.select = mousePos;
      if(which === 2) oldPos.scroll = mousePos;
      if(which === 3) oldPos.target = mousePos;
   }
   
   setHoverPos       (GM: GameManager) {
      
      if(!GM.isMouseGridScope()) return;

      const { gridPos, cellSize } = GM;

      const cellPos: IPosition = {
         x: this.getCellCoord(gridPos.x, cellSize),
         y: this.getCellCoord(gridPos.y, cellSize),
      };
   
      this.hoverPos = {
         cellID: `${cellPos.x /cellSize}-${cellPos.y /cellSize}`,
         coord:  cellPos,
      }
   }

   setSelectArea     (GM: GameManager) {

      const { selectArea, oldPos, curPos } = this;

      const { x: oldX,    y: oldY    } = oldPos.select.cart;
      const { x: curX,    y: curY    } = curPos.cart;
      const { x: scrollX, y: scrollY } = GM.Viewport.scroll.curDelta;

      selectArea.x      =       oldX -scrollX;
      selectArea.y      =       oldY -scrollY;
      selectArea.width  = curX -oldX +scrollX;
      selectArea.height = curY -oldY +scrollY;
   }

   resetSelectArea   (GM: GameManager) {

      if(!this.isSelecting) return;
      
      GM.clearCanvas("selection");
      this.isSelecting = false;

      const { selectArea } = this;

      selectArea.x      = 0;
      selectArea.y      = 0;
      selectArea.width  = 0;
      selectArea.height = 0;
   }
   
   update_SelectArea (GM: GameManager) {

      if(!this.isSelecting || this.isScollClick) return;

      GM.clearCanvas("selection");
      this.setSelectArea (GM);
      this.drawSelectArea(GM);
   }
   
   setTargetCell     (GM: GameManager) {

      const { hoverPos            } = this;
      const { Grid, oldSelectList } = GM;
      
      if(!GM.isMouseGridScope()) return;
      
      const { cellsList }   = Grid;
      const targetCell      = cellsList.get(hoverPos.cellID)!;
      
      if(targetCell.isBlocked || !targetCell.isVacant) return;
      
      const [ agent      ]  = oldSelectList;
      const { Pathfinder }  = agent;
      
      targetCell.isTargeted = true;
      Pathfinder.hasTarget  = true;
      Pathfinder.goalCell   = targetCell;
      Pathfinder.searchPath(cellsList);
   }

   setTargetArea     (GM: GameManager) {

      const { targetArea, oldPos, areaOptions } = this;
      
      const { separator               } = areaOptions.target;
      const { cellSize, oldSelectList } = GM;
      const { x: oldX,  y: oldY       } = GM.screenPos_toGridPos(oldPos.target.iso);

      const unitCount   = oldSelectList.size;

      const step        = Math.min (unitCount, separator);
      const range       = Math.ceil(unitCount /step);
      const width       = step  *cellSize;
      const height      = range *cellSize;
      const gridX       = oldX -(width -cellSize) *0.5;
      const gridY       = oldY -height +cellSize;

      targetArea.x      = this.getCellCoord(gridX, cellSize);
      targetArea.y      = this.getCellCoord(gridY, cellSize);
      targetArea.width  = width;
      targetArea.height = height;
   }

   startAgentPF      (GM: GameManager) {

      const { Grid, cellSize, oldSelectList } = GM;
      const { targetArea                    } = this;
      const { x, y, width,  height          } = targetArea;

      // Search cells IDs from area
      const colNum = width  /cellSize;
      const rowNum = height /cellSize;
      
      let sortedUnitList = new Set<Agent>();
      
      // Get all cells IDs
      for(let r = 0; r < rowNum; r++) {
         const rowID = this.getIndexID(y, height, r, cellSize);
         
         for(let c = 0; c < colNum; c++) {
            const colID = this.getIndexID(x, width, c, cellSize);
            const cell  = GM.getCell(`${colID}-${rowID}`);

            if(!cell || cell.isTargeted || cell.isBlocked || !cell.isVacant) continue;
            
            // Set all Agents goalCells
            for(const agent of oldSelectList) {
               const { Pathfinder } = agent;
               
               if(cell.isTargeted || Pathfinder.hasTarget) continue;
               
               cell.isTargeted      = true;
               Pathfinder.hasTarget = true;
               Pathfinder.goalCell  = cell;

               oldSelectList.delete(agent);
               sortedUnitList.add(agent);
            }
         }
      }

      // Start all Agents search path
      for(const agent of sortedUnitList) {
         agent.Pathfinder.searchPath(Grid.cellsList);
         oldSelectList.add(agent);
      }
   }

   update_TargetArea (GM: GameManager) {

      if(!this.isTargeting || this.isScollClick) return;

      const { cellSize, gridPos, oldSelectList } = GM;
      
      const { targetArea, areaOptions } = this;
      const { resizeStep              } = areaOptions.target;
      const { y: oldY,  width, height } = targetArea;
      const { y: curY                 } = gridPos;
      
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










   setWallArea     (GM: GameManager) {
      
      if(!this.hasWallPoint || !GM.isWallMode) return;

      const { wallArea, oldPos, wallsID_List } = this;
      
      const { Grid, cellSize      } = GM;
      const { x: oldX,    y: oldY    } = GM.screenPos_toGridPos(oldPos.select.iso);

      wallArea.x      = this.getCellCoord(oldX, cellSize);
      wallArea.y      = this.getCellCoord(oldY, cellSize);




      const cellPos: IPosition = {
         x: this.getCellCoord(oldX, cellSize),
         y: this.getCellCoord(oldY, cellSize),
      };
   
      const cellID = `${cellPos.x /cellSize}-${cellPos.y /cellSize}`;

      this.firstWallCell = GM.getCell(cellID)!;

      // for(const cellID of wallsID_List) {
      //    const cell = GM.getCell(cellID)!;
         
      //    if(!Grid.occupiedCells.has(cell)) Grid.occupiedCells.add(cell);
      // }
   }
   

   update_WallsList(GM: GameManager) {

      if(!this.hasWallPoint || !GM.isWallMode) return;


      const { Grid, cellSize, Ctx, Collision  } = GM;
      const { wallArea, wallsID_List, oldPos             } = this;
      const { x, y, width,  height } = wallArea;

      const { x: curX,    y: curY    } = GM.gridPos;
      const { x: oldX,    y: oldY    } = GM.screenPos_toGridPos(oldPos.select.iso);
      
      wallArea.width  = this.getCellCoord(curX -oldX, cellSize) +cellSize;
      wallArea.height = this.getCellCoord(curY -oldY, cellSize) +cellSize;




      const absWidth  = Math.abs(width);
      const absHeight = Math.abs(height);

      // Search cells IDs from area
      const colNum = absWidth  /cellSize;
      const rowNum = absHeight /cellSize;
      
      
      const { firstWallCell, hoverPos } = this;
      const hoverCell = GM.getCell(hoverPos.cellID)!;
      
      const { x: startX, y: startY } = firstWallCell!.center;
      const { x: endX,   y: endY   } = hoverCell;
      
      const raycast = { startX, startY, endX, endY };

      
      firstWallCell!.drawColor   (Ctx.isometric, "gold");
      firstWallCell!.drawRaycast (Ctx.isometric, hoverCell);
      
      firstWallCell!.drawCollider(Ctx.isometric);
      hoverCell.     drawCollider(Ctx.isometric);
      
      wallsID_List.clear();

      // Get all cells IDs
      for(let r = 0; r < rowNum; r++) {
         const rowID = this.getIndexID(y, absHeight, r, cellSize);

         for(let c = 0; c < colNum; c++) {
            const colID = this.getIndexID(x, absWidth, c, cellSize);
            const cell  = GM.getCell(`${colID}-${rowID}`)!;

            if(!cell
            ||  cell.id === firstWallCell!.id) {
               
               continue;
            }
            

            if(Collision.line_toSquare(raycast, cell.collider)) {

               cell.drawCollider(Ctx.isometric);

               // cell.isBlocked = true;
               // wallsID_List.add(cell.id);
            }

            else {
               // cell.isBlocked = false;
               // wallsID_List.delete(cell.id);
            }            
         }
      }
   }










   
   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawSelectArea(GM: GameManager) {
      
      const { selectArea, areaOptions           } = this;
      const { x,   y,    width,       height    } = selectArea;
      const { lineWidth, borderColor, color     } = areaOptions.select;

      const ctx_Selection = GM.Ctx.selection;

      // Set style
      ctx_Selection.lineWidth   = lineWidth;
      ctx_Selection.strokeStyle = borderColor;
      ctx_Selection.fillStyle   = color;
   
      // Draw area
      ctx_Selection.fillRect  (x, y, width, height);
      ctx_Selection.strokeRect(x, y, width, height);
   }

   drawHoverPos  (GM: GameManager) {

      if(!GM.isMouseGridScope()) return;
      
      const ctx_isometric          = GM.Ctx.isometric;
      const { x: cellX, y: cellY } = this.hoverPos.coord;

      // Draw hoverPos frame
      ctx_isometric.strokeStyle = "yellow";
      ctx_isometric.lineWidth   = 4;
      ctx_isometric.strokeRect(cellX, cellY, GM.cellSize, GM.cellSize);
   }
   
   drawTargetArea(GM: GameManager) {

      if(!this.isTargeting) return;

      const { targetArea, areaOptions } = this;
      const { x, y, width, height     } = targetArea;
      const { color                   } = areaOptions.target;
      const ctx_isometric               = GM.Ctx.isometric;

      ctx_isometric.fillStyle = color;
      ctx_isometric.fillRect(x, y, width, height);
   }





   drawWallArea(GM: GameManager) {

      if(!GM.isWallMode) return;

      const { wallArea            } = this;
      const { x, y, width, height } = wallArea;
      const ctx_isometric           = GM.Ctx.isometric;

      ctx_isometric.fillStyle = "rgba(0, 200, 255, 0.7)";
      ctx_isometric.fillRect(x, y, width, height);
   }

}