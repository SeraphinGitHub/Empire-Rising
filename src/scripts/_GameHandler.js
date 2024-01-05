
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const GridClass       = require("./classes/GridClass.js");
const mouseHandler    = require("./mouseHandler.js");
const keyboardHandler = require("./keyboardHandler.js");

const glo  = require("./modules/mod_globalVar.js");
const init = require("./modules/mod_initMethods.js");
const ext  = require("./modules/mod_extendedMethods.js");
const draw = require("./modules/mod_drawMethods.js");


// ================================================================================================
// Prevent context menu
// ================================================================================================
document.body.oncontextmenu = (event) => {
   event.preventDefault();
   event.stopPropagation();
}


// ================================================================================================
// Animation
// ================================================================================================
const runAnimation = () => {

   ext.clearCanvas("isoSelect");
   // ext.clearCanvas("terrain");
   // ext.clearCanvas("buildings");
   ext.clearCanvas("units");

   ext.cycleList(glo.Grid.cellsList, (cell) => draw.cellInfo(cell));

   ext.cycleList(glo.AgentsList, (agent) => {
      let gridPos = ext.gridPos_toScreenPos(agent.position);
      agent.drawAgent(glo.Ctx.isoSelect, "yellow");
      agent.drawCollider(glo.Ctx.units, gridPos);
   });

   ext.cycleList(glo.OldSelectList,     (agent) => agent.drawAgent(glo.Ctx.isoSelect, "lime"));
   ext.cycleList(glo.CurrentSelectList, (agent) => agent.drawAgent(glo.Ctx.isoSelect, "blue"));
   
   ext.withinTheGrid(() => draw.hover());
   requestAnimationFrame(runAnimation);
}


// ================================================================================================
// Init Game Handler
// ================================================================================================
module.exports = {
   methods: {

      initGameHandler(document) {
         glo.Grid      = new GridClass(glo.GridParams);
         
         glo.DOM       = init.setDOM(document);
         glo.Viewport  = init.setViewport(document);
         glo.CanvasObj = init.setCanvas(document);
         glo.Ctx       = init.setCtx(glo.CanvasObj);
         
         init.setAvailableID();
         runAnimation();
         
         glo.Grid.init();
         mouseHandler.init();
         keyboardHandler.init();

         // --- Tempory ---
         ext.createNewAgent("infantry",  "worker",   "5-3");
         ext.createNewAgent("cavalry",   "swordsman","9-2");
         ext.createNewAgent("cavalry",   "bowman",   "2-6");
         ext.createNewAgent("machinery", "ballista", "8-5");
         ext.createNewAgent("machinery", "catapult", "6-9");
         // --- Tempory ---
      }
   }
}