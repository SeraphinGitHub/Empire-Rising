
"use strict"

const debugVar = require("./_debugVar.js");
const gVar = require("./_gVar.js");

const GridClass = require("./classes/GridClass.js");
const Grid = new GridClass(gVar.Grid.width, gVar.Grid.height, gVar.Grid.cellSize);


// ================================================================================================
// Functions
// ================================================================================================
const clearCanvas = (state) => {

   const ctxWidth = gVar.Viewport.width;
   const ctxHeight = gVar.Viewport.height;

   if(state === 0) gVar.Ctx.isoSelect.clearRect(0, 0, ctxWidth, ctxHeight);
   if(state === 1) gVar.Ctx.terrain.clearRect(  0, 0, ctxWidth, ctxHeight);
   if(state === 2) gVar.Ctx.buildings.clearRect(0, 0, ctxWidth, ctxHeight);
   if(state === 3) gVar.Ctx.units.clearRect(    0, 0, ctxWidth, ctxHeight);
}

const updateDOM = (DOM) => {

   DOM.cartX.textContent =   `x : ${gVar.GetCell.cartMouse.x}`;
   DOM.cartY.textContent =   `y : ${gVar.GetCell.cartMouse.y}`;
   DOM.isoX.textContent =    `x : ${gVar.GetCell.isoMouse.x}`;
   DOM.isoY.textContent =    `y : ${gVar.GetCell.isoMouse.y}`;
   DOM.cellX.textContent =   `x : ${gVar.GetCell.position.x}`;
   DOM.cellY.textContent =   `y : ${gVar.GetCell.position.y}`;
   DOM.cellID.textContent = `id : ${gVar.GetCell.id}`;
}

const setDOM = (document) => {
   return {
      cartX:   document.querySelector(".coordinates .cartX"),
      cartY:   document.querySelector(".coordinates .cartY"),
      isoX:    document.querySelector(".coordinates .isoX"),
      isoY:    document.querySelector(".coordinates .isoY"),
      cellX:   document.querySelector(".coordinates .cellX"),
      cellY:   document.querySelector(".coordinates .cellY"),
      cellID:  document.querySelector(".coordinates .ID-cell"),
   };
}

const setViewport = (document) => {

   const viewport_1080p = {
      x: 0,
      y: 0,
      height: 1080,
      width: 1920,
   };

   const laptop_17pcs = {
      height: 900,
      width: 1600,
   };

   const laptop_15pcs = {
      height: 768,
      width: 1366,
   };

   if(document.body.clientWidth <= laptop_17pcs.width
   && document.body.clientWidth > laptop_15pcs.width) {
      viewport_1080p.height = laptop_17pcs.height;
      viewport_1080p.width = laptop_17pcs.width;
   }

   else if(document.body.clientWidth <= laptop_15pcs.width) {
      viewport_1080p.height = laptop_15pcs.height;
      viewport_1080p.width = laptop_15pcs.width;
   }

   return viewport_1080p;
}

const setCanvas = (document) => {

   const canvasObj = {
      isoSelect: document.querySelector(".canvas-isoSelect"),
      terrain:   document.querySelector(".canvas-terrain"),
      buildings: document.querySelector(".canvas-buildings"),
      units:     document.querySelector(".canvas-units"),
   };

   // Set canvas sizes
   Object.values(canvasObj).forEach(canvas => {

      if(canvas === canvasObj.isoSelect) {
         canvas.width = Grid.width;
         canvas.height = Grid.height;
      }
      else {
         canvas.width = gVar.Viewport.width;
         canvas.height = gVar.Viewport.height;
      }
   });

   return canvasObj;
}

const setCtx = (canvasObj) => {
   const ctx = {};

   Object.entries(canvasObj).forEach(pair => {
      let key = pair[0];
      let value = pair[1];
      ctx[key] = value.getContext("2d");
   });

   return ctx;
}

const screenPos_toGridPos = (mousePos) => {

   // Isometric <== Cartesian
   return {
      x:  Math.floor( (mousePos.x -mousePos.y *2) /gVar.Cos_45deg /2 ) +gVar.Grid.width /2,
      y:  Math.floor( (mousePos.x +mousePos.y *2) /gVar.Cos_45deg /2 ) -gVar.Grid.width /2,
   };
}

const gridPos_toScreenPos = (cellPos) => {

   // Cartesian <== Isometric
   let TempX = Math.floor( (cellPos.x + cellPos.y) *gVar.Cos_45deg );
   let TempY = Math.floor( (cellPos.y + gVar.Grid.width /2) *gVar.Cos_45deg *2 -TempX ) /2;

   return {
      x: Math.floor( gVar.Viewport.width  /2 - gVar.Cos_45deg /2 *(gVar.Grid.height +gVar.Grid.width) +TempX ),
      y: Math.floor( gVar.Viewport.height /2 - gVar.Cos_45deg /4 *(gVar.Grid.height +gVar.Grid.width) +TempY +gVar.Cos_30deg *gVar.Grid.cellSize /2 ),
   };
}

const getCellPos = (event) => {
   
   let screenBound = gVar.CanvasObj.units.getBoundingClientRect();
   let isoGridBound = gVar.CanvasObj.isoSelect.getBoundingClientRect();

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
   let cellSize = gVar.Grid.cellSize;

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
   && GetCell.isoMouse.x < gVar.Grid.width
   && GetCell.isoMouse.y > 0
   && GetCell.isoMouse.y < gVar.Grid.height) {

      callback();
   }
}

const cycleCells = (callback) => {

   for(let i in Grid.cellsList) {
      let cell = Grid.cellsList[i];

      callback(cell);
   }
}


// ================================================================================================
// Draw Functions
// ================================================================================================
const drawCellInfo = (cell) => {

   if(debugVar.showCellInfo) {
      let ctxIsoSelect = gVar.Ctx.isoSelect;
      
      cell.drawFrame(ctxIsoSelect);
      cell.drawCenter(ctxIsoSelect);
      cell.drawID(ctxIsoSelect);
   }
}


// ================================================================================================
// Mouse Inputs
// ================================================================================================
const mouse_Move = (event) => {

   clearCanvas(0);
   clearCanvas(1);
   clearCanvas(2);
   clearCanvas(3);

   // Set hover cell & DOM
   gVar.GetCell = getCellPos(event);
   gVar.HoverCell = Grid.cellsList[gVar.GetCell.id];
   updateDOM(gVar.DOM);
   
   // Render cell data
   cycleCells((cell) => drawCellInfo(cell));
   
   // Redraw existing items after canvas cleared
   if(gVar.HoverCell) gVar.HoverCell.drawHover(gVar.Ctx.isoSelect, gVar.GetCell, "blue");
}

document.body.oncontextmenu = (event) => {
   event.preventDefault();
   event.stopPropagation();
}


// ================================================================================================
// Game Handler
// ================================================================================================
module.exports = {
   methods: {

      initGameHandler(document) {

         gVar.DOM       = setDOM(document);
         gVar.Viewport  = setViewport(document);
         gVar.CanvasObj = setCanvas(document);
         gVar.Ctx       = setCtx(gVar.CanvasObj);

         // Mouse move
         gVar.CanvasObj.units.addEventListener("mousemove", (event) => mouse_Move(event));
         
         // loadImages();
         Grid.init(debugVar.isEuclidean);
         cycleCells((cell) => drawCellInfo(cell));
      }
   }
}