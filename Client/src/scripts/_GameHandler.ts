
"use strict"

import {
   ISize,
   ISquare,
   IPosition,
} from "./utils/interfaces";

import {
   GridClass,
   CellClass,
   AgentClass,
} from "./classes/_Export";

import { glo        } from "./utils/_GlobalVar";
import { Collision  } from "./modules/collision";
import { unitParams } from "./utils/unitParams";


let frame = 0;
let isScrolling     = false;
let isMouseScolling = false;

const walls: string[] = [

   "9-21",

   // Top
   "21-6",
   "22-6",
   "23-6",
   
   "24-7",
   "25-8",
   "26-9",
   "27-10",
   "27-11",
   "27-12",

   // Middle
   "12-12",
   "13-12",
   "14-12",
   "15-12",
   "16-12",
   "17-12",
   "18-12",
   "19-12",
   "20-12",

   "20-13",
   "20-14",
   "20-15",
   "20-16",
   "20-17",
   "20-18",

   "21-18",
   "22-18",
   "23-18",
   "24-18",
   "25-18",

   // Bottom
   "13-23",
   "12-23",
   "11-23",
   "10-23",
   "9-23",

   "14-13",
   "14-14",
   "14-18",
   "14-19",
   "14-20",
   "14-21",
   "14-22",
   "14-23",
   "14-24",
   "14-25",
   "14-26",

   "15-27",
   "16-26",
   "17-25",
   "18-24",
   "19-23",
   "20-22",





   // Top
   "41-6",
   "42-6",
   "43-6",
   
   "44-7",
   "45-8",
   "46-9",
   "47-10",
   "47-11",
   "47-12",

   // Middle
   "42-12",
   "43-12",
   "44-12",
   "45-12",
   "46-12",
   "47-12",
   "48-12",
   "49-12",
   "40-12",

   "40-13",
   "40-14",
   "40-15",
   "40-16",
   "40-17",
   "40-18",

   "41-18",
   "42-18",
   "43-18",
   "44-18",
   "45-18",

   // Bottom
   "43-23",
   "42-23",
   "41-23",
   "40-23",
   "9-43",

   "44-13",
   "44-14",
   "14-48",
   "44-19",
   "14-40",
   "44-21",
   "14-42",
   "44-23",
   "14-44",
   "44-25",
   "14-46",

   "15-47",
   "16-46",
   "47-25",
   "48-24",
   "19-43",
   "20-42",
];

const tiles: string[] = [
   "6-9",
   "6-10",
   "7-9",
   "7-8",
   "6-8",
   "5-9",
   "5-8",
   "5-10",
   "7-10",
   "8-9",
   "8-8",
   "9-8",
   "9-7",
   "10-7",
   "8-7",
   "9-6",
   "5-11",
   "4-11",
   "4-10",
   "3-10",
   "4-9",
   "6-7",
   "7-11",
   "8-10",
   "4-12",
   "3-11",
   "13-13",
   "13-14",
   "12-13",
   "11-12",
   "12-11",
   "8-23",
   "9-24",
   "10-24",
   "11-24",
   "13-26",
   "13-27",
   "14-27",
   "14-28",
   "15-28",
   "16-27",
   "17-26",
   "19-13",
   "19-14",
   "19-15",
   "18-13",
   "23-7",
   "24-8",
   "25-9",
   "26-10",
   "26-11",
   "24-8",
   "22-7",
   "17-4",
   "18-4",
   "18-5",
   "17-5",
   "16-3",
   "17-3",
   "16-4",
   "15-3",
   "16-2",
   "31-4",
   "32-4",
   "33-4",
   "33-4",
   "33-5",
   "32-5",
   "33-6",
   "33-3",
   "34-4",
   "25-23",
   "26-24",
   "27-25",
   "28-26",
   "28-27",
   "28-29",
   "27-30",
   "26-30",
   "26-31",
   "25-31",
   "24-31",
   "27-26",
   "28-25",
   "29-26",
   "29-26",
   "29-28",
   "29-27",
   "29-29",
   "25-23",
   "25-23",
   "25-24",
   "26-25",
   "27-24",
   "29-25",
   "28-30",
   "27-30",
   "27-31",
   "30-27",
   "22-27",
   "21-28",
   "21-29",
   "20-30",
   "19-30",
   "20-29",
   "20-29",
   "19-31",
   "20-31",
   "18-29",
   "18-30",
   "22-29",
   "4-28",
   "5-28",
   "5-29",
   "6-29",
   "7-29",
   "6-30",
   "6-28",
];


//  ------  Tempory  ------
let randPathIntervals: any = [];

const setWallsList = () => {

   walls.forEach((cellID) => {
      const cell:     CellClass = glo.Grid!.cellsList.get(cellID)!;
      const { x, y }: IPosition = gridPos_toScreenPos(cell.center);
      
      cell.isBlocked   = true;
      cell.screenPos.x = x;
      cell.screenPos.y = y;

      glo.Grid!.addToOccupiedMap(cell);
   });
}
//  ------  Tempory  ------


document.body.oncontextmenu = (event) => {
   event.preventDefault();
   event.stopPropagation();
}


// =========================================================================================
// Viewport & Canvas
// =========================================================================================
const setViewportSize = (document: Document) => {
   
   const viewport_1080p: ISquare = {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
   };

   const laptop_17pcs: ISize = {
      width: 1600,
      height: 900,
   };

   const laptop_15pcs: ISize = {
      width: 1366,
      height: 768,
   };

   if(document.body.clientWidth <= laptop_17pcs.width
   && document.body.clientWidth  > laptop_15pcs.width) {
      viewport_1080p.height = laptop_17pcs.height;
      viewport_1080p.width  = laptop_17pcs.width;
   }

   else if(document.body.clientWidth <= laptop_15pcs.width) {
      viewport_1080p.height = laptop_15pcs.height;
      viewport_1080p.width  = laptop_15pcs.width;
   }

   else glo.Viewport = viewport_1080p;
}

const setCanvasSize = () => {
   
   Object.entries(glo.Canvas).forEach(([key, value]: [string, unknown]) => {

      const canvas = value as HTMLCanvasElement;

      if(key === "terrain") {
         const { terrainWidth, terrainHeight} = setTerrainSize();
         canvas.width  = terrainWidth;
         canvas.height = terrainHeight;
         return;
      }

      if(key === "isoSelect") {
         canvas.width  = glo.Grid!.gridSize;
         canvas.height = glo.Grid!.gridSize;
         return;
      }

      canvas.width  = glo.Viewport.width;
      canvas.height = glo.Viewport.height;
   });
}

const setTerrainSize = () => {

   const hypotenuse    = glo.Grid!.gridSize;
   const angleDegrees  = 26.565;  // ==> Fake isometric angle value
   const angleRadians  = angleDegrees * (Math.PI / 180);
   const terrainWidth  = Math.floor( hypotenuse * Math.cos(angleRadians) *2 ) +50; // +50 ==> some margin
   const terrainHeight = Math.floor( hypotenuse * Math.sin(angleRadians) *2 ) +50; // +50 ==> some margin

   glo.TerrainOffset = {
      x:  Math.floor( (terrainWidth  -glo.Viewport.width ) /2 ),
      y:  Math.floor( (terrainHeight -glo.Viewport.height) /2 ),
   }

   return {
      terrainWidth,
      terrainHeight,
   }
}

const setPosConvert = () => {

   const Cos_45              = glo.Cos_45deg;
   const Cos_30              = glo.Cos_30deg;
   const cellSize            = glo.GridParams.cellSize;
   const half_GridWidth      = glo.GridParams.gridSize *0.5;
   const diagonalOffset      = half_GridWidth *2 *Cos_45;
   const half_ViewportWidth  = glo.Viewport.width  *0.5;
   const half_ViewportHeight = glo.Viewport.height *0.5;

   glo.GridAngle        = half_GridWidth      -(cellSize *Cos_45 *Cos_30);
   glo.ViewportOffset.x = half_ViewportWidth  -diagonalOffset;
   glo.ViewportOffset.y = half_ViewportHeight -diagonalOffset /2 +(Cos_30 *cellSize /2);
}

const setAvailableID = () => {

   for(let i = 0; i < glo.MaxPop; i++) {
      glo.AvailableIDArray.push(i +1);
   }
}

const clearCanvas = (canvasName: string) => {

   if(canvasName === "isoSelect") {
      return glo.Ctx[canvasName].clearRect(0, 0, glo.GridParams.gridSize, glo.GridParams.gridSize);
   }

   glo.Ctx[canvasName].clearRect(0, 0, glo.Viewport.width, glo.Viewport.height);
}


// =========================================================================================
// Submethods
// =========================================================================================
const isWithinGrid = (isoGridPos: IPosition) => {

   const { x, y }: IPosition = isoGridPos;
   
   if(isoGridPos
   && x > 0
   && x < glo.GridParams.gridSize
   && y > 0
   && y < glo.GridParams.gridSize) {

      return true;
   }

   return false;
}

const isWithinViewport = (gridPos: IPosition) => {

   const {
      x:      vpX,
      y:      vpY,
      width:  vpWidth,
      height: vpHeight
   } = glo.Viewport;

   const {
      x:      scrollX,
      y:      scrollY,
   } = glo.Scroll;

   const { x, y }: IPosition = gridPos;

   if(x >= vpX           -scrollX
   && x <= vpX +vpWidth  -scrollX
   && y >= vpY           -scrollY
   && y <= vpY +vpHeight -scrollY) {

      return true;
   }

   return false;
}


// =========================================================================================
// Grid & Screen position
// =========================================================================================
const getScreenPos = (event: MouseEvent) => {

   let screenBound  = glo.Canvas.selection.getBoundingClientRect();
   let isoGridBound = glo.Canvas.isoSelect.getBoundingClientRect();

   return {
      cartesian: {
         x: Math.floor( event.clientX -screenBound.left ),
         y: Math.floor( event.clientY -screenBound.top  ),
      },

      isometric: {
         x: Math.floor( event.clientX -isoGridBound.left ),
         y: Math.floor( event.clientY -isoGridBound.top  ),
      },
   }
}

const getHoverCell = () => {

   const cellSize: number = glo.Grid!.cellSize;
   
   const {
      x: isoX,
      y: isoY,
   }: IPosition = glo.IsoGridPos;

   const cellPos: IPosition = {
      x: isoX - (isoX % cellSize),
      y: isoY - (isoY % cellSize),
   };

   const cellCenter: IPosition = {
      x: cellPos.x +cellSize *0.5,
      y: cellPos.y +cellSize *0.5,
   };

   return {
      id:       `${cellPos.x /cellSize}-${cellPos.y /cellSize}`,
      center:    cellCenter,
      gridPos:   cellPos,
      screenPos: gridPos_toScreenPos(cellCenter),
   }
}

const screenPos_toGridPos = (screenPos: IPosition) => {

   const screenX        = screenPos.x;
   const doubleScreenY  = screenPos.y *2;
   const half_GridWidth = glo.GridParams.gridSize *0.5;

   // Isometric <== Cartesian
   return {
      x:  Math.floor( (screenX -doubleScreenY) /glo.Cos_45deg  *0.5 ) +half_GridWidth,
      y:  Math.floor( (screenX +doubleScreenY) /glo.Cos_45deg  *0.5 ) -half_GridWidth,
   };
}

const gridPos_toScreenPos = (gridPos: IPosition) => {

   const {
      x: gridX,
      y: gridY,
   }: IPosition = gridPos;

   const {
      x: offsetX,
      y: offsetY,
   }: IPosition = glo.ViewportOffset;
   
   const Cos_45: number = glo.Cos_45deg;

   // Cartesian <== Isometric
   const TempX = Math.floor( (gridX +gridY         ) *Cos_45 );
   const TempY = Math.floor( (gridY +glo.GridAngle!) *Cos_45 *2 -TempX ) *0.5;
   
   return {
      x: Math.floor( TempX +offsetX ),
      y: Math.floor( TempY +offsetY ),
   };
}


// =========================================================================================
// Methods
// =========================================================================================
const createNewAgent = (
   divisionName: string,
   typeName :    string,
   cellID:       string,
   diffImgSrc:   string,
) => {

   const unitParameters: any  = unitParams;

   const avID:      number    = glo.AvailableIDArray[0];
   const division:  any       = unitParameters[divisionName];
   const unitType:  any       = division.unitType[typeName];
   const startCell: CellClass = glo.Grid!.cellsList.get(cellID)!;
   
   let imgSrc     = unitType.imgSrc;
   if(diffImgSrc !== "") imgSrc = diffImgSrc;

   glo.CurrentPop += division.popCost;
   glo.AvailableIDArray.splice(0, division.popCost);

   const agentParams = {
      id:          avID,
      unitType,
      imgSrc,
      moveSpeed:   unitType.moveSpeed,
      popCost:     division.popCost,
      collider:    division.collider,
      startCell,   // <== Tempory until create JS file "BuildingsClass"
   };
   
   glo.AgentsList.set(avID, new AgentClass(agentParams));
}

const updateUnitsList = (
   collideCallback: Function,
   first:  unknown,
   second: unknown,
   agent:  AgentClass
) => {

   if(collideCallback(first, second)) {
     return glo.CurrentSelectList.add(agent);
   }
   
   glo.CurrentSelectList.delete(agent);
}

const unitSelection = () => {

   let selectArea:  unknown;
   let isSelecting: boolean = glo.SelectArea.isSelecting;
   
   const {
      oldPos,
      currentPos,
      height: selectHeight,
      width:  selectWidth,
   } = glo.SelectArea;

   if(isSelecting) {
      clearCanvas("selection");
      drawSelectArea();

      selectArea = {
         x:      oldPos.cartesian.x,
         y:      oldPos.cartesian.y,
         height: selectHeight,
         width:  selectWidth,
      };
   }

   const mousePos = {
      x: currentPos.cartesian.x,
      y: currentPos.cartesian.y,
   };

   // If collide with mouse or select area ==> Add agent to CurrentList
   glo.AgentsList.forEach((agent: AgentClass) => {
      
      const { x: agentX,  y: agentY  }: IPosition = gridPos_toScreenPos(agent.position);
      const { x: scrollX, y: scrollY }: IPosition = glo.Scroll;

      // Agent collider
      const agentCollider = {
         x:      agentX +scrollX,
         y:      agentY +scrollY +agent.collider.offsetY,
         radius: agent.collider.radius,
      };

      if(isSelecting) {
         return updateUnitsList(Collision.square_toCircle, selectArea, agentCollider, agent);
      }

      updateUnitsList(Collision.point_toCircle, mousePos, agentCollider, agent);
   });
}

const unitDiselection = () => {

   clearCanvas("selection");
   
   // If OldList === Empty ==> Set OldList
   if(glo.OldSelectList.size === 0) {
      
      glo.CurrentSelectList.forEach(agent => glo.OldSelectList.add(agent));
      glo.CurrentSelectList.clear();

      glo.OldSelectList.forEach((agent: AgentClass) => agent.isSelected = true);
   }

   // If OldList !== Empty && CurrentList !== Empty
   else if(glo.CurrentSelectList.size !== 0) {

      // Remove old selected agents
      glo.OldSelectList.forEach((agent: AgentClass) => {

         if(!glo.CurrentSelectList.has(agent)) {
            agent.isSelected = false;
            glo.OldSelectList.delete(agent);
         }
      });

      // Add new selected agents
      glo.CurrentSelectList.forEach((agent: AgentClass) => {

         agent.isSelected = true;
         glo.OldSelectList.add(agent);
         glo.CurrentSelectList.delete(agent);
      });
   }

   // If OldList === Empty && CurrentList !== Empty
   else glo.OldSelectList.forEach((agent: AgentClass) => {
      
      if(agent.isSelected) {
         agent.isSelected = false;
         glo.OldSelectList.delete(agent);
      }
   });
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

   if(!isScrolling || isMouseScolling) return;

   const scrollBounds = setScrollBounds();
   const mousePos     = glo.SelectArea.currentPos.cartesian;
   
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
   
   if(!isMouseScolling) return;
   
   const { x: oldX,    y: oldY    } = glo.SelectArea.oldPos.cartesian;
   const { x: mouseX,  y: mouseY  } = glo.SelectArea.currentPos.cartesian;

   const isRange_X: boolean = (glo.Scroll.x < glo.max_X) && (glo.Scroll.x > -glo.max_X);
   const isRange_Y: boolean = (glo.Scroll.y < glo.max_Y) && (glo.Scroll.y > -glo.max_Y);

   if(isRange_X) glo.Scroll.x = mouseX -oldX;
   if(isRange_Y) glo.Scroll.y = mouseY -oldY;
   
   setComputed();
}


// =========================================================================================
// Draw Methods
// =========================================================================================
const drawScrollBounds = () => {

   if(glo.Params.isFrameHidden) return;
   
   const scrollBounds: any = setScrollBounds();

   for(let i in scrollBounds) {

      const { x, y, width, height }: ISquare = scrollBounds[i];

      glo.Ctx.assets.fillStyle = "rgba(255, 0, 255, 0.5)";
      glo.Ctx.assets.fillRect(
         x,
         y,
         width,
         height
      );
   }
}

const drawSelectArea = () => {

   let selected   = glo.SelectArea;

   const { x: oldX,     y: oldY     }: IPosition = selected.oldPos.cartesian;
   const { x: currentX, y: currentY }: IPosition = selected.currentPos.cartesian;

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

const drawHoverCell = () => {

   if(!isWithinGrid(glo.IsoGridPos)) return;

   glo.Ctx.isoSelect.strokeStyle = "yellow";
   glo.Ctx.isoSelect.lineWidth = 4;
   
   // Draw hovelCell frame
   glo.Ctx.isoSelect.strokeRect(
      glo.HoverCell.gridPos.x,
      glo.HoverCell.gridPos.y,
      glo.Grid!.cellSize,
      glo.Grid!.cellSize,
   );
}

const drawSelectUnit = () => {

   glo.OldSelectList.forEach((agent: AgentClass) => {
      let agentPos = gridPos_toScreenPos(agent.position);

      if(!isWithinViewport(agentPos)) return;

      agent.drawSelect(glo.Ctx.isoSelect, "yellow");
   });
}

const drawHoverUnit = () => {

   glo.CurrentSelectList.forEach((agent: AgentClass) => {
      let agentPos = gridPos_toScreenPos(agent.position);

      if(!isWithinViewport(agentPos)) return;

      agent.drawSelect(glo.Ctx.isoSelect, "blue");
   });
}

const drawGrid = () => {
   if(glo.Params.isGridHidden) return;

   const { isoSelect } = glo.Ctx;
   
   glo.Grid!.cellsList.forEach((cell: CellClass) => {
      const cellPos = gridPos_toScreenPos(cell.center);
      
      if(!isWithinViewport(cellPos)) return;
         
      cell.screenPos.x = cellPos.x;
      cell.screenPos.y = cellPos.y;
      cell.drawInfos(isoSelect);
   });
}


// =========================================================================================
// Terrain - Units - Walls
// =========================================================================================
const drawTerrain = () => {
   
   glo.Grid!.cellsList.forEach((cell: CellClass) => {
      let cellPos = gridPos_toScreenPos(cell.center);

      cell.drawSprite(glo.Ctx.terrain, cellPos);
   });   
}

const draw_UnitsAndBuild = (frame: number) => {

   const { assets, isoSelect } = glo.Ctx;

   glo.Grid!.occupiedCells.forEach((cell: CellClass) => {

      if(cell.agentID) {
         const agent    = glo.AgentsList.get(cell.agentID!)!;
         const agentPos = gridPos_toScreenPos(agent.position);
   
         agent.updateState(frame);
         agent.walkPath();
      
         if(!isWithinViewport(agentPos)) return;
      
         agent.drawSprite(assets, agentPos, glo.Scroll);
         // agent.drawCollider(units, agentPos, glo.Scroll);
         agent.drawPath(isoSelect);
      }

      if(cell.isBlocked) {
         const srcSize  = 280;
         const destSize = 90;
         const offsetX  = 48;
         const offsetY  = 75;

         if(cell.isTransp) {
            assets.save();
            assets.globalAlpha = 0.5;
      
            assets.drawImage(
               glo.walls_Img,
      
               // Source
               0,
               0,
               srcSize,
               srcSize,
               
               // Destination
               cell.screenPos.x -offsetX + glo.Scroll.x,
               cell.screenPos.y -offsetY + glo.Scroll.y,
               destSize +10,
               destSize,
            );
            
            assets.restore();
            return;
         }
      
         assets.drawImage(
            glo.walls_Img,

            // Source
            0,
            0,
            srcSize,
            srcSize,
            
            // Destination
            cell.screenPos.x -offsetX +glo.Scroll.x,
            cell.screenPos.y -offsetY +glo.Scroll.y,
            destSize +10,
            destSize,
         );
      }
   });
}


// =========================================================================================
// Peripherals Inputs
// =========================================================================================
const setPeripherals = () => {

   window.addEventListener("keydown",   (event) => keyboard_Input(event));
   window.addEventListener("mousemove", (event) => mouse_Move    (event));
   window.addEventListener("mousedown", (event) => mouse_Click   (event, "Down"));
   window.addEventListener("mouseup",   (event) => mouse_Click   (event, "Up"  ));
}

const keyboard_Input = (event: KeyboardEvent) => {

   switch(event.key) {

      case "Enter": {
         glo.AgentsList.forEach((agent: AgentClass) => {
            
            Test_PathRandomize(agent);
            const intervalID = setInterval(() => Test_PathRandomize(agent), 3000);
            randPathIntervals.push(intervalID);
         });
      } break;

      case "Backspace": {
         randPathIntervals.forEach((intervalID: number) => clearInterval(intervalID));
      } break;
   }
}

const mouse_Click = (event: MouseEvent, state: string) => {

   if(state === "Down") glo.SelectArea.oldPos = getScreenPos(event);

   switch(event.which) {

      // Left click
      case 1: {

         if(state === "Down") { 
            glo.SelectArea.isSelecting = true;
         }
         
         if(state === "Up") {
            glo.SelectArea.isSelecting = false;
            unitDiselection();
         }
         
      } break;


      // Scroll click
      case 2: {

         if(state === "Down") {
            isMouseScolling = true;
            isScrolling     = false;
         }
         
         if(state === "Up"  ) {
            isMouseScolling = false;
            isScrolling     = true;
         }
         
      } break;


      // Right click
      case 3: {

         if(state === "Down") {
            if(isWithinGrid(glo.IsoGridPos)) {
               glo.OldSelectList.forEach((agent: AgentClass) => {
                  
                  const goalCell = glo.Grid!.cellsList.get(glo.HoverCell.id)!;

                  if(goalCell.isBlocked || !goalCell.isVacant) return;
                  
                  agent.goalCell = goalCell;
                  agent.searchPath();
               });
            }
         }
      
         if(state === "Up") {
            
         }

      } break;
   }
}

const mouse_Move = (event: MouseEvent) => {

   const mousePos = getScreenPos(event);
   glo.SelectArea.currentPos = mousePos;
   glo.IsoGridPos            = screenPos_toGridPos(mousePos.isometric);
   
   if(isWithinGrid(glo.IsoGridPos)) glo.HoverCell = getHoverCell();

   unitSelection();
   mouseScroll();

   isScrolling = true;
}


// =========================================================================================
// Animation
// =========================================================================================
const runAnimation = () => {

   frame++;

   clearCanvas("isoSelect");
   clearCanvas("assets");
   
   scrollCam();
   
   drawScrollBounds();
   draw_UnitsAndBuild(frame);
   drawHoverUnit();
   drawSelectUnit();
   drawGrid();
   drawHoverCell();

   requestAnimationFrame(runAnimation);
}


// =========================================================================================
// Test Methods
// =========================================================================================
const Test_PathRandomize = (agent: AgentClass) => {

   let i = glo.Grid!.rand(glo.Grid!.cellPerSide);
   let j = glo.Grid!.rand(glo.Grid!.cellPerSide);
   
   const targetCell = glo.Grid!.cellsList.get(`${i}-${j}`)!;
   
   if(targetCell.isBlocked) return;
   
   agent.goalCell = targetCell;
   agent.searchPath();
}

const Test_GenerateUnits = () => {

   let pop = 30;

   const blue   = "Units/Swordsman_Blue.png";
   const purple = "Units/Swordsman_Purple.png";
   const red    = "Units/Swordsman_Red.png";
   
   while(pop > 0) {

      let index = glo.Grid!.rand(4);
      let i = glo.Grid!.rand(glo.Grid!.cellPerSide);
      let j = glo.Grid!.rand(glo.Grid!.cellPerSide);

      let unitType = glo.Grid!.rand(2);

      if( glo.Grid!.cellsList.get(`${i}-${j}`)!.isVacant
      && !glo.Grid!.cellsList.get(`${i}-${j}`)!.isBlocked) {

         let color = "";

         if(index === 0) color = blue;
         if(index === 1) color = purple;
         if(index === 2) color = red;

         if(unitType === 0) createNewAgent("infantry", "swordsman", `${i}-${j}`, color);
         if(unitType === 1) createNewAgent("infantry", "worker", `${i}-${j}`, "");
         
         glo.Grid!.cellsList.get(`${i}-${j}`)!.isVacant = false;
         pop--;

         glo.CurrentPop++;
      }
      
      else continue;
   }
}


export const GameHandler = {

   init(
      document: Document,
      params:   any,
      // socket:   any,
   ) {
      
      glo.Params = params;
      glo.Grid   = new GridClass(glo.GridParams);

      // Set scrollCam max Bounds
      glo.max_X *= glo.Grid!.gridSize;
      glo.max_Y *= glo.Grid!.gridSize;

      // Set tiles Images
      glo.flatG_Img.src = glo.flatG_Src;
      glo.highG_Img.src = glo.highG_Src;
      glo.walls_Img.src = glo.walls_Src;


      // Set DOM & some data
      // setViewportSize(document);
      setCanvasSize ();
      setAvailableID();
      setPosConvert ();
      setPeripherals();     
      

      // CSS ScrollCanvas
      glo.IsoSelectComputed = new DOMMatrix(window.getComputedStyle(glo.Canvas.isoSelect).transform);
      glo.TerrainComputed   = new DOMMatrix(window.getComputedStyle(glo.Canvas.terrain  ).transform);


      // --- Tempory ---
      setWallsList();
      tiles.forEach(ID => glo.Grid!.cellsList.get(ID)!.isDiffTile = true);
      
      setTimeout(() => {
         drawTerrain();
      }, 0);

      createNewAgent("infantry", "swordsman", "6-16",  "");
      createNewAgent("infantry", "swordsman", "9-20",  "");
      createNewAgent("infantry", "swordsman", "9-22",  "");
      createNewAgent("infantry", "swordsman", "9-24",  "");
      createNewAgent("infantry", "swordsman", "13-24", "");
      createNewAgent("infantry", "swordsman", "24-14", "");
      
      // createNewAgent("infantry",  "worker",    "5-3", "");
      // createNewAgent("cavalry",   "swordsman", "9-2", "");
      // createNewAgent("cavalry",   "bowman",    "2-6", "");
      // createNewAgent("machinery", "ballista",  "8-5", "");
      // createNewAgent("machinery", "catapult",  "6-9", "");
      
      // Test_GenerateUnits();
      // --- Tempory ---

      runAnimation();
   },

}