
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const GridClass       = require("./classes/GridClass.js");
const AgentClass      = require("./classes/AgentClass.js");
const mouseHandler    = require("./mouseHandler.js");
const keyboardHandler = require("./keyboardHandler.js");
const glo             = require("./modules/mod_globalVar.js");
const draw            = require("./modules/mod_drawFunctions.js");
const unitParam       = require("./modules/mod_unitsParams.js");


// ================================================================================================
// Functions
// ================================================================================================
document.body.oncontextmenu = (event) => {
   event.preventDefault();
   event.stopPropagation();
}

const clearCanvas = () => {

   glo.cycleList(glo.Ctx, (ctx) => {
      if(ctx !== glo.Ctx.selection) ctx.clearRect(0, 0, glo.Viewport.width, glo.Viewport.height);
   });
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
      selection: document.querySelector(".canvas-selection"),
   };

   // Set canvas sizes
   Object.values(canvasObj).forEach(canvas => {

      if(canvas === canvasObj.isoSelect) {
         canvas.width = glo.Grid.width;
         canvas.height = glo.Grid.height;
      }
      else {
         canvas.width = glo.Viewport.width;
         canvas.height = glo.Viewport.height;
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

const createNewAgent = (newUnit) => {

   glo.Population += newUnit.popCost;
   let id = glo.Population;
   let startCell = glo.Grid.cellsList["3-3"]; // Tempory until buildings class created
   
   glo.AgentsList[id] = new AgentClass(id, startCell, glo.Grid.isEuclidean, newUnit);
   glo.AgentsList[id].drawCollider(glo.Ctx.isoSelect, startCell);
}


// ================================================================================================
// Animation
// ================================================================================================
const runAnimation = () => {

   clearCanvas();
   
   glo.cycleList(glo.Grid.cellsList, (cell) => draw.cellInfo(cell));
   glo.cycleList(glo.AgentsList, (agent) => agent.drawCollider(glo.Ctx.isoSelect, agent.startCell));
   
   requestAnimationFrame(runAnimation);
}


// ================================================================================================
// Init Game Handler
// ================================================================================================
module.exports = {
   methods: {

      initGameHandler(document) {
         glo.Grid      = new GridClass(glo.GridParams);
         
         glo.DOM       = setDOM(document);
         glo.Viewport  = setViewport(document);
         glo.CanvasObj = setCanvas(document);
         glo.Ctx       = setCtx(glo.CanvasObj);
         
         runAnimation();

         glo.Grid.init();
         mouseHandler.init();
         keyboardHandler.init();


         // --- Tempory ---
         createNewAgent(unitParam.worker);
         // --- Tempory ---
      }
   }
}