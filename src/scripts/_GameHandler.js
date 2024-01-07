
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const GridClass = require("./classes/GridClass.js");

const glo  = require("./modules/globalVar.js");
const init = require("./modules/init.js");
const ext  = require("./modules/extendedMethods.js");


// ================================================================================================
// Prevent context menu
// ================================================================================================
document.body.oncontextmenu = (event) => {
   event.preventDefault();
   event.stopPropagation();
}


let frame = 0;

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

      if(!ext.isWithinViewport(agentPos)) return;
      
      agent.drawSprite(glo.Ctx.units, agentPos, glo.ScrollOffset);
      // agent.drawCollider(glo.Ctx.units, agentPos, glo.ScrollOffset);
      agent.drawPath(glo.Ctx.isoSelect);
   });


   // Draw Terrain and Buildings
   ext.cycleList(glo.Grid.cellsList, (cell) => {
      let cellPos = ext.gridPos_toScreenPos(cell.center);

      if(!ext.isWithinViewport(cellPos)) return;

      // cell.drawSprite(glo.Ctx.terrain, cellPos, glo.ScrollOffset);
      cell.drawWall   (glo.Ctx.units, cellPos, glo.ScrollOffset);
      cell.drawInfos  (glo.Ctx.isoSelect);
      cell.drawVacancy(glo.Ctx.isoSelect);
   });


   // Draw Units Selection
   ext.cycleList(glo.OldSelectList,     (agent) => {
      let agentPos = ext.gridPos_toScreenPos(agent.position);

      if(!ext.isWithinViewport(agentPos)) return;
      agent.drawSelect(glo.Ctx.isoSelect, "yellow");
   });


   // Draw Units Hover
   ext.cycleList(glo.CurrentSelectList, (agent) => {
      let agentPos = ext.gridPos_toScreenPos(agent.position);

      if(!ext.isWithinViewport(agentPos)) return;
      agent.drawSelect(glo.Ctx.isoSelect, "blue");
   });
   
   if(ext.isWithinGrid(glo.IsoGridPos)) ext.drawHoverCell();
   
   // ------ Tempory ------
   drawBarrack();
   // ------ Tempory ------

   requestAnimationFrame(runAnimation);
}

// ------ Tempory ------
const barrackImg = new Image();
barrackImg.src = glo.BarrackSrc;

const barrackArea = [
   "13-5",
   "13-6",
   "13-7",
   "13-8",
   "13-9",

   "14-9",
   "15-9",
   "16-9",
   "17-9",
   "18-9",

   "18-5",
   "17-5",
   "16-5",
   "15-5",
   "14-5",

   "18-6",
   "18-7",
   "18-8",
   "18-9",
];

const drawBarrack = () => {
   
   let barrackPos = ext.gridPos_toScreenPos(glo.Grid.cellsList["13-5"].center);

   if(!ext.isWithinViewport(barrackPos)) return;
   
   glo.Ctx.units.drawImage(
      barrackImg,
      
      // Source
      0,
      0,
      510,
      510,
      
      // Destination
      barrackPos.x -30 +glo.ScrollOffset.x,
      barrackPos.y -228 +glo.ScrollOffset.y,
      300,
      300,
   );
}
// ------ Tempory ------
   
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

         glo.Grid = new GridClass(glo.GridParams);

         init.setViewport(document);
         init.setCanvas(document);
         init.setCtx(glo.CanvasObj);
         init.setViewportSqr(); // ==> Tempory
         init.setAvailableID();
         init.setPosConvert();
         init.peripherals_Input();
         
         glo.ComputedCanvas = new DOMMatrix(window.getComputedStyle(glo.CanvasObj.isoSelect).transform);

         // --- Tempory ---
         walls.forEach(ID => glo.Grid.cellsList[ID].isBlocked = true);

         barrackArea.forEach(ID => glo.Grid.cellsList[ID].hasBuilding = true);
         
         ext.createNewAgent("infantry",  "swordsman", "7-16",  "Units/Swordsman_Orange.png");
         ext.createNewAgent("infantry",  "swordsman", "7-19",  "Units/Swordsman_Blue.png");
         ext.createNewAgent("infantry",  "swordsman", "10-16", "Units/Swordsman_Red.png");
         ext.createNewAgent("infantry",  "swordsman", "10-19", "Units/Swordsman_Purple.png");

         ext.createNewAgent("infantry",  "worker",    "19-22", "");
         ext.createNewAgent("infantry",  "worker",    "22-25", "");

         // ext.createNewAgent("cavalry",   "swordsman", "9-2", "");
         // ext.createNewAgent("cavalry",   "bowman",    "2-6", "");
         // ext.createNewAgent("machinery", "ballista",  "8-5", "");
         // ext.createNewAgent("machinery", "catapult",  "6-9", "");
         
         // ext.Test_GenerateUnits();
         // --- Tempory ---
         

         runAnimation();
      },
   }
}