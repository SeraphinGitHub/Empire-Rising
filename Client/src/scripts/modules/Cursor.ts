
import {
   ICanvas,
   ILine,
   IPosList,
   IPosList_List,
   ISquare,
} from "../utils/interfaces";

import {
   Cell,
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
         separator:     10, // unit number per row
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
   targetCell:     Cell  | null = null;
   selectCell:     Cell  | null = null;

   ghostID:        number       = -99;
   ghostZone:      Set<Cell>    = new Set();
   ghostWallsList: Set<Cell>    = new Set();

   isSelecting:    boolean      = false;
   isTargeting:    boolean      = false;
   isScollClick:   boolean      = false;

   isTriggered:    boolean      = false;
   hasCreateWall:  boolean      = false;
   isAreaDisable:  boolean      = false;
   

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

         this.createWalls (GM); // **************
         this.setWallsList(GM); // **************
         GM.createBuilding();
         GM.createBuildingWalls();
         GM.TEST_UnitMode();
         GM.Viewport.resetScroll();
      }
      
      if(state === "Up") {
         GM.clearCanvas("selection");
         this.setSelectMode(GM, false);
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

         this.resetWallsList (); // **************
         this.setTargetCell  ();
         this.setTargetArea  (GM);
         this.resetSelectArea(GM);
      }
      
      if(state === "Up") {
         this.isTargeting = false;

         GM.socket.emit("startAgentPF", {
            targetCell:    this.targetCell,
            targetArea:    this.targetArea,
            AgentsID_List: GM.setAgentsID_List(),
         });
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
      this.setSelectMode         (GM, true);
      this.setGhostZone          (GM);

      this.update_SelectArea     (GM);
      this.update_TargetArea     (GM);
      this.update_WallsList      (GM); // **************

      GM.Viewport.mouseScrollCam (GM);
      GM.Viewport.isScrollDetect = true;

   }
   

   // =========================================================================================
   // Methods
   // =========================================================================================
   setSelectMode     (
      GM:      GameManager,
      isHover: boolean,
   ) {

      const {
         unitsList,  unitSelectList_cur,  unitSelectList_old,
         nodesList,  nodeSelectList_cur,  nodeSelectList_old,
         buildsList, buildSelectList_cur, buildSelectList_old,
      } = GM;

      this.handleSelectMode(GM, isHover, unitsList,  unitSelectList_old,  unitSelectList_cur );
      this.handleSelectMode(GM, isHover, nodesList,  nodeSelectList_old,  nodeSelectList_cur );
      this.handleSelectMode(GM, isHover, buildsList, buildSelectList_old, buildSelectList_cur);
   }

   handleSelectMode  (
      GM:       GameManager,
      isHover:  boolean,
      elemList: Map<number, any>,
      oldList:  Set<any>,
      curList:  Set<any>,
   ) {

      if(!isHover && curList.size === 0 && oldList.size === 0) return;
      
      const { isSelecting, selectArea, curPos } = this;
      
      // =====================================
      // Selection
      // =====================================
      // If collide with mouse or select area ==> Add elem to curList
      for(const elem of elemList.values()) {
         
         if(!isHover) {
            elem.isHover = false;
            continue;
         }

         const elemCol = GM.setElemCollider(elem);

         const isHovered =
            elem.teamID === GM.teamID
            && (
               GM.Collision.point_toCircle (curPos.cart, elemCol) 
            ||(
               GM.Collision.square_toCircle(selectArea,  elemCol)
               && elem.isUnit
               && isSelecting
            ))
         ;

         elem.isHover = isHovered;

         if(isHovered) curList.add   (elem);
         else          curList.delete(elem);
      }

      if(isHover) return;
      
      
      // =====================================
      // Deselection
      // =====================================
      // Case 1: if oldList is empty ==> transfer everything from curList
      if(oldList.size === 0) {

         for(const elem of curList) {
            elem.isSelected = true;
            oldList.add(elem);
         }

         curList.clear();
         return;
      }


      // Case 2: if curList is not empty ==> update differences
      if(curList.size !== 0) {

         // Remove deselected elems
         for(const elem of oldList) {

            if(curList.has(elem)) continue;

            elem.isSelected = false;
            oldList.delete(elem);
         }

         // Add new selected elems
         for(const elem of curList) {

            elem.isSelected = true;
            oldList.add(elem);
         }
         
         curList.clear();
         return;
      }


      // Case 3: if oldList not empty, but curList is empty ==> clear all
      for(const elem of oldList) {
         
         elem.isSelected = false;
         oldList.delete(elem);
      }
   }
   
   getCellCoord      (
      coord:    number,
      cellSize: number,
   ): number {

      return coord -(coord % cellSize);
   }

   setPosition       (
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

      if(this.hoverCell.isNode) {
         this.isAreaDisable = true;
         return;
      }
      
      this.isAreaDisable = false;
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
   
   setTargetCell     () {

      if(!this.isAreaDisable) return this.targetCell = null;

      this.targetCell = this.hoverCell;
   }

   setTargetArea     (GM: GameManager) {

      if(this.isAreaDisable) return;

      const { targetArea, oldPos, areaOptions } = this;
      
      const { separator                    } = areaOptions.target;
      const { cellSize, unitSelectList_old } = GM;
      const { x: oldX,  y: oldY            } = GM.screenPos_toGridPos(oldPos.target.iso);

      const unitCount   = unitSelectList_old.size;

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

      const { cellSize, gridPos, unitSelectList_old } = GM;
      
      const { targetArea, areaOptions } = this;
      const { resizeStep              } = areaOptions.target;
      const { y: oldY,  width, height } = targetArea;
      const { y: curY                 } = gridPos;
      
      const unitCount   = unitSelectList_old.size;
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
      
      const { selectCell, hoverCell, ghostWallsList, curPos } = this;

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
            
            ghostWallsList.add(cell);
         }
         else ghostWallsList.delete(cell);
      }
   }  

   createWalls       (GM: GameManager) {
      
      if(!this.isTriggered || !this.hoverCell) return;

      GM.wallsListID = [this.hoverCell.id];

      for(const cell of this.ghostWallsList) {
         
         if(!cell
         ||  cell.id === this.hoverCell.id
         ||  cell.isBlocked
         || !cell.isVacant
         || !GM.Collision.line_toSquare(this.raycast!, cell.collider)) {
            
            continue;
         }

         GM.wallsListID.push(cell.id);
      }

      this.ghostWallsList.clear();
   }

   resetWallsList    () {

      this.isTriggered = false;
      this.raycast     = null;
      this.ghostWallsList.clear();
   }

   clearGhostZone   () {

      for(const cell of this.ghostZone) {
         cell.isValid   = false;
         cell.isUnvalid = false;
      }
      
      this.ghostZone.clear();
   }

   setGhostZone     (GM: GameManager) {

      const { ghostBuild } = GM;
      const hoverCell      = this.hoverCell;
      
      if(!ghostBuild || !hoverCell) return;

      const { buildSize, imgState } = ghostBuild;

      for(const cell of this.ghostZone) {
         cell.isValid   = false;
         cell.isUnvalid = false;
      }
      
      const { i: cell_i, j: cell_j } = hoverCell;
      ghostBuild.displayState        = imgState.valid;
      ghostBuild.position            = hoverCell.center;
      
      let tempList:  Cell[] = [];

      for(let i = 0; i < buildSize; i++) {
         for(let j = 0; j < buildSize; j++) {
            
            const cellID = `${cell_i +i}-${cell_j -j}`;
            const cell   = GM.getCell(cellID);

            if(!cell || !cell.isBlocked) continue;
            
            tempList.push(cell);
         }
      }

      this.ghostZone = new Set(tempList);

      if(tempList.length > 0) ghostBuild.displayState = imgState.unValid;
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

      if(!this.isTargeting || this.isAreaDisable) return;

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
      
      const { selectCell, raycast, ghostWallsList } = this;
      const { isometric                      } = GM.Ctx;

      if(!selectCell || !raycast) return;

      selectCell.drawColor  (isometric, "gold");
      this.drawRaycast      (isometric, raycast);

      for(const cell of ghostWallsList) {
         !cell.isOverlaped
         ? cell.drawCollider(isometric)
         : cell.drawColor   (isometric, "blue")
      }
   }


   // =========================================================================================
   // Update - (Every frame)
   // =========================================================================================
   update(GM: GameManager) {

      // this.drawHoverCell (GM);
      this.drawTargetArea(GM);
      this.drawWallsList (GM);
   }
}