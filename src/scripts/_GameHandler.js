
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const GridClass       = require("./classes/GridClass.js");
const mouseHandler    = require("./mouseHandler.js");
const keyboardHandler = require("./keyboardHandler.js");

const glo  = require("./modules/globalVar.js");
const init = require("./modules/initMethods.js");
const ext  = require("./modules/extendedMethods.js");
const draw = require("./modules/drawMethods.js");


// ================================================================================================
// Prevent context menu
// ================================================================================================
document.body.oncontextmenu = (event) => {
   event.preventDefault();
   event.stopPropagation();
}


let frame = 0;

const isWithinViewport = (gridPos) => {

   const {
      x:      vpX,
      y:      vpY,
      width:  vpWidth,
      height: vpHeight
   } = glo.ViewportSqr;

   const {
      x:      scrollX,
      y:      scrollY,
   } = glo.ScrollOffset;

   if(gridPos.x >= vpX           -scrollX
   && gridPos.x <= vpX +vpWidth  -scrollX
   && gridPos.y >= vpY           -scrollY
   && gridPos.y <= vpY +vpHeight -scrollY) {

      return true;
   }

   return false;
}

const Test_GenerateUnits = () => {

   let pop = 30;

   const blue   = "Units/Swordsman_Blue.png";
   const purple = "Units/Swordsman_Purple.png";
   const red    = "Units/Swordsman_Red.png";
   
   while(pop > 0) {

      let index = glo.Grid.rand(4);
      let i = glo.Grid.rand(35);
      let j = glo.Grid.rand(35);

      let unitType = glo.Grid.rand(2);

      if( glo.Grid.cellsList[`${i}-${j}`].isVacant
      && !glo.Grid.cellsList[`${i}-${j}`].isBlocked) {

         let color = "";

         if(index === 0) color = blue;
         if(index === 1) color = purple;
         if(index === 2) color = red;

         if(unitType === 0) ext.createNewAgent("infantry", "swordsman", `${i}-${j}`, color);
         if(unitType === 1) ext.createNewAgent("infantry", "worker", `${i}-${j}`, "");
         
         glo.Grid.cellsList[`${i}-${j}`].isVacant = false;
         pop--;

         glo.CurrentPop++;
      }
      
      else continue;
   }
}

// ================================================================================================
// Animation
// ================================================================================================
const runAnimation = () => {

   frame++;

   ext.clearCanvas("isoSelect");
   // ext.clearCanvas("terrain");
   // ext.clearCanvas("buildings");
   ext.clearCanvas("units");

   
   ext.scrollCam();


   // Draw Units
   ext.cycleList(glo.AgentsList, (agent) => {
      let agentPos = ext.gridPos_toScreenPos(agent.position);

      agent.updateState(frame);
      agent.walkPath();

      if(!isWithinViewport(agentPos)) return;
      
      agent.drawSprite(glo.Ctx.units, agentPos, glo.ScrollOffset);
      // agent.drawCollider(glo.Ctx.units, agentPos, glo.ScrollOffset);
      // agent.displayPath(glo.Ctx.isoSelect);
   });


   // Draw blocked cell as Wall
   ext.cycleList(glo.Grid.cellsList, (cell) => {
      let cellPos = ext.gridPos_toScreenPos(cell.center);

      if(!isWithinViewport(cellPos)) return;
      if(cell.isBlocked) cell.drawSprite(glo.Ctx.units, cellPos, glo.ScrollOffset);
      draw.cellInfo(cell);
   });   


   // Draw Units Selection
   ext.cycleList(glo.OldSelectList,     (agent) => {
      let agentPos = ext.gridPos_toScreenPos(agent.position);

      if(!isWithinViewport(agentPos)) return;
      agent.drawSelect(glo.Ctx.isoSelect, "yellow");
   });


   // Draw Units Hover
   ext.cycleList(glo.CurrentSelectList, (agent) => {
      let agentPos = ext.gridPos_toScreenPos(agent.position);

      if(!isWithinViewport(agentPos)) return;
      agent.drawSelect(glo.Ctx.isoSelect, "blue");
   });
   
   
   ext.withinTheGrid(() => draw.hover());
   requestAnimationFrame(runAnimation);
}


let walls = [
   
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

   "20-13",
   "20-14",
   "20-15",
   "20-16",
   "20-17",

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

   "14-17",
   "14-18",
   "14-19",
   "14-20",
   "14-21",
   "14-22",
   "14-23",
   "14-24",
   "14-25",
   "14-26",
   "14-27",
];

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
         
         glo.ViewportSqr    = init.setViewportSqr(); // ==> Tempory
         glo.ComputedCanvas = new DOMMatrix(window.getComputedStyle(glo.CanvasObj.isoSelect).transform);
         
         init.setAvailableID();

         glo.Grid.init();
         mouseHandler.init();
         keyboardHandler.init();

         
         // --- Tempory ---
         walls.forEach(ID => glo.Grid.cellsList[ID].isBlocked = true);

         // ext.createNewAgent("infantry",  "worker",    "5-3", "");
         // ext.createNewAgent("infantry",  "swordsman", "5-3", "");
         // ext.createNewAgent("cavalry",   "swordsman", "9-2", "");
         // ext.createNewAgent("cavalry",   "bowman",    "2-6", "");
         // ext.createNewAgent("machinery", "ballista",  "8-5", "");
         // ext.createNewAgent("machinery", "catapult",  "6-9", "");
         
         Test_GenerateUnits();
         // --- Tempory ---
         

         runAnimation();
      },
   }
}