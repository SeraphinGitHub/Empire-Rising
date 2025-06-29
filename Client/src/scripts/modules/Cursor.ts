
import {
   ICanvas,
   ILine,
   IPosList,
   IPosList_List,
   ISquare,
} from "../utils/interfaces";

import {
   Cell,
   Agent,
} from "../classes/_Export"

import {
   GameManager,
} from "./_Export"


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

   curPos:         IPosList     = { cart: {x:0, y:0}, iso: {x:0, y:0} };
   selectArea:     ISquare      = { x:0,   y:0,   width:0,   height:0 };
   targetArea:     ISquare      = { x:0,   y:0,   width:0,   height:0 };
   
   raycast:        ILine | null = null;
   hoverCell:      Cell  | null = null;
   selectCell:     Cell  | null = null;

   wallsList:      Set<Cell>    = new Set();

   isSelecting:    boolean      = false;
   isTargeting:    boolean      = false;
   isScollClick:   boolean      = false;

   isTriggered:    boolean      = false;
   hasCreateWall:  boolean      = false;


   constructor(GManager: GameManager) {
      this.GM       = GManager;
      this.Canvas   = GManager.Canvas;

      this.init();
   }

   init() {
      this.initMouseEvent("mousemove", this.move .bind(this)        );
      this.initMouseEvent("mousedown", this.click.bind(this), "Down");
      this.initMouseEvent("mouseup",   this.click.bind(this), "Up"  );
   }


   // =========================================================================================
   // Mouse Behaviors
   // =========================================================================================
   initMouseEvent(
      eventName: string,
      callback:  Function,
      state?:    string,
   ) {
      
      window.addEventListener(eventName, (event: Event) => {
         if((event.target as HTMLElement).tagName === "BUTTON") return;

         if(!state) return callback(event);
         callback(event, state);
      });
   }

   handle_LeftClick  (GM: GameManager, state: string) {

      if(state === "Down") {
         this.isSelecting = true;
         this.isTriggered = true;

         this.createWalls (GM);
         this.setWallsList(GM);
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
         
         this.resetWallsList ();
         this.setTargetArea  (GM);
         this.resetSelectArea(GM);
      }
      
      if(state === "Up") {
         GM.socket.emit("startAgentPF", { targetArea: this.targetArea, AgentsID_List: GM.setAgentsID_List() });
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

      this.setPosition           (GM, event, false);
      this.setHoverCell          (GM);
      this.update_SelectArea     (GM);
      this.update_TargetArea     (GM);
      this.update_WallsList      (GM);

      GM.unitSelection           ();
      GM.Viewport.mouseScrollCam (GM);
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
   
   setHoverCell      (GM: GameManager) {
      
      if(!GM.isMouseGridScope()) return this.hoverCell = null;

      const { gridPos, cellSize } = GM;

      const colID = this.getCellCoord(gridPos.x, cellSize) /cellSize;
      const rowID = this.getCellCoord(gridPos.y, cellSize) /cellSize;
   
      this.hoverCell = GM.getCell(`${colID}-${rowID}`)!;
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

      console.log("==> Feature disabled !"); // ******************************************************

      // const { Grid, oldSelectList } = GM;
      
      // if(!GM.isMouseGridScope()) return;
      
      // const { hoverCell } = this;
      // const { cellsList } = Grid;
      // const targetCell    = hoverCell!;
      
      // if(targetCell.isBlocked || !targetCell.isVacant) return;
      
      // const [ agent      ]  = oldSelectList;
      
      // targetCell.isTargeted = true;
      // agent.hasTarget  = true;
      // agent.goalCell   = targetCell;
      // agent.searchPath(cellsList);
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
   
   setWallsList      (GM: GameManager) {

      if(!GM.isWallMode) return;
      
      this.selectCell = this.hoverCell!;
      this.raycast    = null;
   }
   
   update_WallsList  (GM: GameManager) {

      if(!GM.isWallMode || !this.isTriggered || !this.selectCell) return;
      
      const { selectCell, hoverCell, wallsList, curPos } = this;

      const { x: startX, y: startY } = selectCell.center;
      const { x: endX,   y: endY   } = hoverCell ? hoverCell.center : GM.screenPos_toGridPos(curPos.iso);
      
      const raycast = this.raycast = { startX, startY, endX, endY };

      let tempList: Set<Cell> = new Set([selectCell]);

      for(const cell of tempList) {
         for(const sideName in cell.nebStatusList) {
            
            // Add all cell's nebs to tempList
            tempList.add( GM.getCell(cell.nebStatusList[sideName].id)! );
         }
      }

      for(const cell of tempList) {
         const { isBlocked, isVacant, collider } = cell;
         
         if(GM.Collision.line_toSquare(raycast, collider)) {
            (isBlocked || !isVacant)
            ? cell.isOverlaped = true
            : cell.isOverlaped = false;
            
            wallsList.add(cell);
         }
         else wallsList.delete(cell);
      }
   }  

   createWalls       (GM: GameManager) {
      
      if(!this.isTriggered) return;

      for(const cell of this.wallsList) {
         
         if(!cell
         ||  cell.isBlocked
         || !cell.isVacant
         || !GM.Collision.line_toSquare(this.raycast!, cell.collider)) {
            
            continue;
         }

         cell.isBlocked = true;
         GM.Grid.addToOccupiedMap(cell);
      }

      this.wallsList.clear();
   }

   resetWallsList    () {

      this.isTriggered = false;
      this.raycast     = null;
      this.wallsList.clear();
   }

   
   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawSelectArea    (GM: GameManager) {
      
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

   drawHoverCell     (GM: GameManager) {

      if(!this.hoverCell) return;
      
      const ctx      = GM.Ctx.isometric;
      const { x, y } = this.hoverCell;

      // Draw hoverCell frame
      ctx.strokeStyle = "yellow";
      ctx.lineWidth   = 4;
      ctx.strokeRect(x, y, GM.cellSize, GM.cellSize);
   }
   
   drawTargetArea    (GM: GameManager) {

      if(!this.isTargeting) return;

      const { targetArea, areaOptions } = this;
      const { x, y, width, height     } = targetArea;
      const { color                   } = areaOptions.target;
      const ctx                         = GM.Ctx.isometric;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
   }

   drawRaycast       (ctx: CanvasRenderingContext2D, raycast: ILine) {

      const { startX, startY, endX, endY } = raycast;

      ctx.strokeStyle = "yellow";
      ctx.beginPath();

      ctx.moveTo(startX, startY);
      ctx.lineTo(endX,   endY  );

      ctx.lineWidth = 4;
      ctx.stroke();
   }

   drawWallsList     (GM: GameManager) {

      if(!GM.isWallMode) return;
      
      const { selectCell, raycast, wallsList } = this;
      const { isometric                      } = GM.Ctx;

      if(!selectCell || !raycast) return;

      selectCell.drawColor  (isometric, "gold");
      this.drawRaycast      (isometric, raycast);

      for(const cell of wallsList) {
         !cell.isOverlaped
         ? cell.drawCollider(isometric)
         : cell.drawColor   (isometric, "blue")
      }
   }


   // =========================================================================================
   // Update - (Every frame)
   // =========================================================================================
   update(GM: GameManager) {

      this.drawHoverCell (GM);
      this.drawTargetArea(GM);
      this.drawWallsList (GM);
   }
}