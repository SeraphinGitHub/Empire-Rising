
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const glo       = require("./_globalVariables.js");
const collision = require("./collision.js");


// ================================================================================================
// Mouse Handler Variables
// ================================================================================================
let ScreenPos;
let GetCell;
let HoverCell;
let SelectedUnitsList = {};

// ================================================================================================
// Functions
// ================================================================================================
const clearSelectCanvas = () => {
   glo.Ctx.select.clearRect(0, 0, glo.Viewport.width, glo.Viewport.height);
}

const updateDOM = () => {

   glo.DOM.cartX.textContent =   `x : ${ScreenPos.cartesian.x}`;
   glo.DOM.cartY.textContent =   `y : ${ScreenPos.cartesian.y}`;
   glo.DOM.isoX.textContent =    `x : ${GetCell.isoMouse.x}`;
   glo.DOM.isoY.textContent =    `y : ${GetCell.isoMouse.y}`;
   glo.DOM.cellX.textContent =   `x : ${GetCell.position.x}`;
   glo.DOM.cellY.textContent =   `y : ${GetCell.position.y}`;
   glo.DOM.cellID.textContent = `id : ${GetCell.id}`;
}

const getScreenPos = (event) => {

   let screenBound = glo.CanvasObj.select.getBoundingClientRect();
   let isoGridBound = glo.CanvasObj.isoSelect.getBoundingClientRect();

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

const screenPos_toGridPos = (screenPos) => {

   // Isometric <== Cartesian
   return {
      x:  Math.floor( (screenPos.x -screenPos.y *2) /glo.Cos_45deg /2 ) +glo.Grid.width /2,
      y:  Math.floor( (screenPos.x +screenPos.y *2) /glo.Cos_45deg /2 ) -glo.Grid.width /2,
   };
}

const gridPos_toScreenPos = (gridPos) => {

   // Cartesian <== Isometric
   let TempX = Math.floor( (gridPos.x + gridPos.y) *glo.Cos_45deg );
   let TempY = Math.floor( (gridPos.y +glo.Grid.width /2 -glo.Grid.cellSize *glo.Cos_45deg *glo.Cos_30deg) *glo.Cos_45deg *2 -TempX ) /2;
   
   return {
      x: Math.floor( glo.Viewport.width  /2 - glo.Cos_45deg /2 *(glo.Grid.height +glo.Grid.width) +TempX ),
      y: Math.floor( glo.Viewport.height /2 - glo.Cos_45deg /4 *(glo.Grid.height +glo.Grid.width) +TempY +glo.Cos_30deg *glo.Grid.cellSize /2 ),
   };
}

const getCellPos = () => {
   
   const isoMouse  = screenPos_toGridPos(ScreenPos.isometric);
   const cellSize  = glo.Grid.cellSize;

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

const unitSelection = () => {

   glo.cycleList(glo.AgentsList, (agent) => {

      const agentIsoPos = {
         x: agent.currentCell.center.x,
         y: agent.currentCell.center.y,
      };

      const agentPos = gridPos_toScreenPos(agentIsoPos);

      glo.Ctx.select.fillStyle = "red";
      glo.Ctx.select.beginPath();
      glo.Ctx.select.arc(
         agentPos.x,
         agentPos.y,
         30, 0, Math.PI * 2
      );
      glo.Ctx.select.fill();
      glo.Ctx.select.closePath();

      const circle = {
         x: agentPos.x,
         y: agentPos.y,
         radius: 30,
      };

      if(collision.square_toCircle(glo.SelectArea, circle)) {
         console.log("Colliding !"); // ******************************************************
         SelectedUnitsList[agent.id] = agent;
      }
   });

   console.log(SelectedUnitsList); // ******************************************************
}


// ================================================================================================
// Draw Functions
// ================================================================================================
const drawSelectArea = () => {

   let select = glo.SelectArea;

   // Select area size
   select.width  = ScreenPos.cartesian.x -select.x;
   select.height = ScreenPos.cartesian.y -select.y;

   // Select area borders
   glo.Ctx.select.lineWidth = select.lineWidth;
   glo.Ctx.select.strokeStyle = select.borderColor;
   glo.Ctx.select.strokeRect(
      select.x,
      select.y,
      select.width,
      select.height
   );
   
   // Select area filled
   glo.Ctx.select.fillStyle = select.filledColor;
   glo.Ctx.select.fillRect(
      select.x,
      select.y,
      select.width,
      select.height
   );
}


// ================================================================================================
// Mouse Inputs
// ================================================================================================
const mouse_Move = (event) => {

   ScreenPos = getScreenPos(event);
   GetCell   = getCellPos(event);
   updateDOM();

   if(glo.SelectArea.isSelectArea) {
      clearSelectCanvas();
      drawSelectArea();
      unitSelection();
   }
   
   withinTheGrid(() => {
      // HoverCell = glo.Grid.cellsList[GetCell.id];
      // HoverCell.drawHover(glo.Ctx.isoSelect, GetCell, glo.Debug.hoverColor);
   });
}

const mouse_LeftClick = (state) => {

   if(state === "Down") {
      glo.SelectArea.isSelectArea = true;
      glo.SelectArea.x = ScreenPos.cartesian.x;
      glo.SelectArea.y = ScreenPos.cartesian.y;      
   }
   
   if(state === "Up") {
      glo.SelectArea.isSelectArea = false;
      clearSelectCanvas();
   }
}

const mouse_RightClick = () => {

   withinTheGrid(() => {
      if(HoverCell) {
      
         // glo.cycleList(glo.AgentsList, (agent) => {

         //    agent.endCell = glo.Grid.cellsList[GetCell.id];
         //    agent.searchPath(glo.Grid.cellsList);
         //    agent.displayPath(glo.Ctx.isoSelect, true);
         //    agent.startCell = agent.endCell;
         // });
      }
   });
}

const mouse_ScrollClick = () => {
   
}


// ================================================================================================
// Init Mouse Handler
// ================================================================================================
module.exports = {
   init() {
      window.addEventListener("mousemove", (event) => mouse_Move(event));
      
      window.addEventListener("mousedown", (event) => {
         const state = "Down";
         ScreenPos = getScreenPos(event);
      
         if(event.which === 1) mouse_LeftClick  (state);
         if(event.which === 2) mouse_ScrollClick();
         if(event.which === 3) mouse_RightClick ();
      });
         
      window.addEventListener("mouseup", (event) => {
         const state = "Up";
      
         if(event.which === 1) mouse_LeftClick(state);
      });
   }
}