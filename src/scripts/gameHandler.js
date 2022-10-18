
"use strict"

const GridClass = require("./classes/GridClass.js");


// ================================================================================================
// Game Handler Variables
// ================================================================================================
const Debug = {
   showWallCol: false,
   showCellInfo: true,
};

const GridParams = {
   cellSize: 80,
   height: 960,
   width: 960,
   isEuclidean: true,
};

const Grid = new GridClass(GridParams);
const Cos_45deg = 0.707;
const Cos_30deg = 0.866;

let DOM;
let Viewport;
let CanvasObj;
let Ctx;
let GetCell;
let HoverCell;


// ================================================================================================
// Functions
// ================================================================================================
const clearCanvas = () => {

   for(let i in Ctx) {
      Ctx[i].clearRect(0, 0, Viewport.width, Viewport.height);
   }
}

const updateDOM = () => {

   DOM.cartX.textContent =   `x : ${GetCell.cartMouse.x}`;
   DOM.cartY.textContent =   `y : ${GetCell.cartMouse.y}`;
   DOM.isoX.textContent =    `x : ${GetCell.isoMouse.x}`;
   DOM.isoY.textContent =    `y : ${GetCell.isoMouse.y}`;
   DOM.cellX.textContent =   `x : ${GetCell.position.x}`;
   DOM.cellY.textContent =   `y : ${GetCell.position.y}`;
   DOM.cellID.textContent = `id : ${GetCell.id}`;
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
         canvas.width = Viewport.width;
         canvas.height = Viewport.height;
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
      x:  Math.floor( (mousePos.x -mousePos.y *2) /Cos_45deg /2 ) +Grid.width /2,
      y:  Math.floor( (mousePos.x +mousePos.y *2) /Cos_45deg /2 ) -Grid.width /2,
   };
}

const gridPos_toScreenPos = (cellPos) => {

   // Cartesian <== Isometric
   let TempX = Math.floor( (cellPos.x + cellPos.y) *Cos_45deg );
   let TempY = Math.floor( (cellPos.y + Grid.width /2) *Cos_45deg *2 -TempX ) /2;

   return {
      x: Math.floor( Viewport.width  /2 - Cos_45deg /2 *(Grid.height +Grid.width) +TempX ),
      y: Math.floor( Viewport.height /2 - Cos_45deg /4 *(Grid.height +Grid.width) +TempY +Cos_30deg *Grid.cellSize /2 ),
   };
}

const getCellPos = (event) => {
   
   let screenBound = CanvasObj.units.getBoundingClientRect();
   let isoGridBound = CanvasObj.isoSelect.getBoundingClientRect();

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
   let cellSize = Grid.cellSize;

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
   && GetCell.isoMouse.x < Grid.width
   && GetCell.isoMouse.y > 0
   && GetCell.isoMouse.y < Grid.height) {

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

   if(Debug.showCellInfo) {
      let ctxIsoSelect = Ctx.isoSelect;
      
      cell.drawFrame(ctxIsoSelect);
      cell.drawCenter(ctxIsoSelect);
      cell.drawID(ctxIsoSelect);
   }
}


// ================================================================================================
// Mouse Inputs
// ================================================================================================
const mouse_Move = (event) => {

   clearCanvas();

   // Set hover cell & DOM
   GetCell = getCellPos(event);
   HoverCell = Grid.cellsList[GetCell.id];
   updateDOM(DOM);
   
   // Render cell data
   cycleCells((cell) => drawCellInfo(cell));
   
   // Redraw existing items after canvas cleared
   if(HoverCell) HoverCell.drawHover(Ctx.isoSelect, GetCell, "blue");
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

         DOM       = setDOM(document);
         Viewport  = setViewport(document);
         CanvasObj = setCanvas(document);
         Ctx       = setCtx(CanvasObj);

         // Mouse move Event
         CanvasObj.units.addEventListener("mousemove", (event) => mouse_Move(event));
         
         Grid.init();
         cycleCells((cell) => drawCellInfo(cell));
      }
   }
}