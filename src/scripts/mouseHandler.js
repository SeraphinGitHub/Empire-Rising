
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const glo       = require("./modules/mod_globalVar.js");
const draw      = require("./modules/mod_drawFunctions.js");
const collision = require("./modules/mod_collisions.js");


// ================================================================================================
// Mouse Handler Variables
// ================================================================================================
let GetCell;
let HoverCell;


// ================================================================================================
// Functions
// ================================================================================================
const clearSelectCanvas = () => {
   glo.Ctx.selection.clearRect(0, 0, glo.Viewport.width, glo.Viewport.height);
}

const updateDOM = () => {

   glo.DOM.cartX.textContent =   `x : ${glo.SelectArea.currentPos.cartesian.x}`;
   glo.DOM.cartY.textContent =   `y : ${glo.SelectArea.currentPos.cartesian.y}`;
   glo.DOM.isoX.textContent =    `x : ${GetCell.isoMouse.x}`;
   glo.DOM.isoY.textContent =    `y : ${GetCell.isoMouse.y}`;
   glo.DOM.cellX.textContent =   `x : ${GetCell.position.x}`;
   glo.DOM.cellY.textContent =   `y : ${GetCell.position.y}`;
   glo.DOM.cellID.textContent = `id : ${GetCell.id}`;
}

const getScreenPos = (event) => {

   let screenBound  = glo.CanvasObj.selection.getBoundingClientRect();
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
   
   const isoMouse  = screenPos_toGridPos(glo.SelectArea.currentPos.isometric);
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

      const agentPos = gridPos_toScreenPos(agent.currentCell.center);
      
      const square = {
         x: glo.SelectArea.oldPos.cartesian.x,
         y: glo.SelectArea.oldPos.cartesian.y,
         height: glo.SelectArea.height,
         width:  glo.SelectArea.width,
      };

      const circle = {
         x: agentPos.x,
         y: agentPos.y,
         radius: agent.collider.radius,
      };

      if(collision.square_toCircle(square, circle)) {
         glo.SelectedUnitsList[agent.id] = agent;
      }
      else {
         delete glo.SelectedUnitsList[agent.id];
      }
   });
}


// ================================================================================================
// Mouse Inputs
// ================================================================================================
const mouse_Move = (event) => {

   glo.SelectArea.currentPos = getScreenPos(event);
   GetCell = getCellPos(event);
   updateDOM();

   if(glo.SelectArea.isSelectArea) {
      clearSelectCanvas();
      draw.selectArea();
      unitSelection();
   }

   // glo.cycleList(glo.AgentsList, (agent) => {
   //    let gridPos = gridPos_toScreenPos(agent.position);
   //    agent.drawCollider(glo.Ctx.selection, gridPos);
   // });
}

const mouse_LeftClick = (state) => {

   if(state === "Down") {
      glo.SelectArea.isSelectArea = true;
      glo.SelectedUnitsList = {};
   }
   
   if(state === "Up") {
      glo.SelectArea.isSelectArea = false;
      clearSelectCanvas();
   }
}

const mouse_RightClick = () => {

   withinTheGrid(() => {
      // if(HoverCell) {
      
         // glo.cycleList(glo.SelectedUnitsList, (agent) => {

         //    agent.endCell = glo.Grid.cellsList[GetCell.id];
         //    agent.searchPath(glo.Grid.cellsList);
         //    agent.displayPath(glo.Ctx.isoSelect, true);
         //    agent.startCell = agent.endCell;
         // });
      // }
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
         glo.SelectArea.oldPos = getScreenPos(event);
      
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