
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const AgentClass      = require("./classes/AgentClass");
const glo = require("./_globalVariables.js");


// ================================================================================================
// Mouse Handler Variables
// ================================================================================================
let GetCell;
let HoverCell;


// ================================================================================================
// Functions
// ================================================================================================
const updateDOM = () => {

   glo.DOM.cartX.textContent =   `x : ${GetCell.cartMouse.x}`;
   glo.DOM.cartY.textContent =   `y : ${GetCell.cartMouse.y}`;
   glo.DOM.isoX.textContent =    `x : ${GetCell.isoMouse.x}`;
   glo.DOM.isoY.textContent =    `y : ${GetCell.isoMouse.y}`;
   glo.DOM.cellX.textContent =   `x : ${GetCell.position.x}`;
   glo.DOM.cellY.textContent =   `y : ${GetCell.position.y}`;
   glo.DOM.cellID.textContent = `id : ${GetCell.id}`;
}

const screenPos_toGridPos = (mousePos) => {

   // Isometric <== Cartesian
   return {
      x:  Math.floor( (mousePos.x -mousePos.y *2) /glo.Cos_45deg /2 ) +glo.Grid.width /2,
      y:  Math.floor( (mousePos.x +mousePos.y *2) /glo.Cos_45deg /2 ) -glo.Grid.width /2,
   };
}

const gridPos_toScreenPos = (cellPos) => {

   // Cartesian <== Isometric
   let TempX = Math.floor( (cellPos.x + cellPos.y) *glo.Cos_45deg );
   let TempY = Math.floor( (cellPos.y + glo.Grid.width /2) *glo.Cos_45deg *2 -TempX ) /2;

   return {
      x: Math.floor( glo.Viewport.width  /2 - glo.Cos_45deg /2 *(glo.Grid.height +glo.Grid.width) +TempX ),
      y: Math.floor( glo.Viewport.height /2 - glo.Cos_45deg /4 *(glo.Grid.height +glo.Grid.width) +TempY +glo.Cos_30deg *glo.Grid.cellSize /2 ),
   };
}

const getCellPos = (event) => {
   
   let screenBound = glo.CanvasObj.units.getBoundingClientRect();
   let isoGridBound = glo.CanvasObj.isoSelect.getBoundingClientRect();

   const cartMouse = {
      screen: {
         x: event.clientX -screenBound.left,
         y: event.clientY -screenBound.top,
      },

      isoGrid: {
         x: event.clientX -isoGridBound.left,
         y: event.clientY -isoGridBound.top,
      },
   }

   const isoMouse = screenPos_toGridPos(cartMouse.isoGrid);
   let cellSize = glo.Grid.cellSize;

   const cellPos = {
      x: isoMouse.x - (isoMouse.x % cellSize),
      y: isoMouse.y - (isoMouse.y % cellSize),
   };

   const cellCenter = {
      x: cellPos.x +cellSize /2,
      y: cellPos.y +cellSize /2,
   };

   const screenPos = gridPos_toScreenPos(cellCenter);

   return {
      id: `${cellPos.x /cellSize}-${cellPos.y /cellSize}`,
      cartMouse: cartMouse.screen,
      isoMouse: isoMouse,
      position: cellPos,
      center: cellCenter,
      screen: screenPos,
   }
}

const withinTheGrid = (callback) => {

   if(GetCell.isoMouse.x > 0
   && GetCell.isoMouse.x < glo.Grid.width
   && GetCell.isoMouse.y > 0
   && GetCell.isoMouse.y < glo.Grid.height) {

      callback();
   }
}

const createNewAgent = () => {

   glo.Population++;
   let id = glo.Population;
   let startCell = glo.Grid.cellsList[GetCell.id];
   
   glo.AgentsList[id] = new AgentClass(id, startCell, glo.Grid.isEuclidean);
   glo.AgentsList[id].drawAgent(glo.Ctx.isoSelect, startCell);
}


// ================================================================================================
// Mouse Inputs
// ================================================================================================
const mouse_Move = (event) => {

   // --- Tempory in this file ---
   clearCanvas();   
   glo.cycleList(glo.Grid.cellsList, (cell) => drawCellInfo(cell));
   glo.cycleList(glo.AgentsList, (agent) => agent.drawAgent(glo.Ctx.isoSelect, agent.startCell));
   // --- Tempory in this file ---


   // Set hover cell & DOM
   GetCell = getCellPos(event);
   HoverCell = glo.Grid.cellsList[GetCell.id];
   updateDOM();

   // Redraw existing items after canvas cleared
   if(HoverCell) HoverCell.drawHover(glo.Ctx.isoSelect, GetCell, glo.Debug.hoverColor);
}

const mouse_LeftClick = (state) => {

   if(state = "Down") {
      
   }
   
   if(state = "Up") {
      
   }
}

const mouse_RightClick = () => {
   
   if(HoverCell) {
      if(Object.keys(glo.AgentsList).length === 0) createNewAgent();
   
      else glo.cycleList(glo.AgentsList, (agent) => {      
         agent.endCell = glo.Grid.cellsList[GetCell.id];
         agent.searchPath(glo.Grid.cellsList);
         agent.displayPath(glo.Ctx.isoSelect, true);
         agent.startCell = agent.endCell;
      });
   }
}

const mouse_ScrollClick = () => {

}


// ************************************************************
// --- Tempory in mouse handler ---
// ************************************************************
const clearCanvas = () => {

   glo.cycleList(glo.Ctx, (ctx) => ctx.clearRect(0, 0, glo.Viewport.width, glo.Viewport.height));
}

const drawCellInfo = (cell) => {

   if(glo.Debug.showCellInfo) {
      let ctxIsoSelect = glo.Ctx.isoSelect;
      
      cell.drawFrame(ctxIsoSelect);
      cell.drawCenter(ctxIsoSelect);
      cell.drawID(ctxIsoSelect);
   }
}


// ================================================================================================
// Init Mouse Handler
// ================================================================================================
module.exports = {
   init() {

      // --- Tempory in this file ---
      glo.cycleList(glo.Grid.cellsList, (cell) => drawCellInfo(cell));
      // --- Tempory in this file ---


      glo.CanvasObj.units.addEventListener("mousemove", (event) => mouse_Move(event));
      
      glo.CanvasObj.units.addEventListener("mousedown", (event) => {
         const state = "Down"

         if(event.which === 1) mouse_LeftClick  (state);
         if(event.which === 2) mouse_ScrollClick();
         if(event.which === 3) mouse_RightClick ();
      });
      
      glo.CanvasObj.units.addEventListener("mouseup", (event) => {
         const state = "Up"

         if(event.which === 1) mouse_LeftClick(state);
      });
   }
}