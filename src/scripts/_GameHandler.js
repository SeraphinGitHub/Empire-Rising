
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

let frame  = 0;
// let revCellsList = [];

// ================================================================================================
// Animation
// ================================================================================================
const runAnimation = () => {

   frame++;

   ext.clearCanvas("isoSelect");
   // ext.clearCanvas("terrain");
   // ext.clearCanvas("buildings");
   ext.clearCanvas("units");

   
   // --- Tempory ---
   // ext.scrollCam();
   // --- Tempory ---


   // Draw Units
   ext.cycleList(glo.AgentsList, (agent) => {
      let gridPos = ext.gridPos_toScreenPos(agent.position);
      
      agent.isAttacking = false;
      agent.updateState(frame);
      agent.drawSprite(glo.Ctx.units, gridPos, glo.ScrollOffset);
      // agent.drawCollider(glo.Ctx.units, gridPos, glo.ScrollOffset);
      // agent.displayPath(glo.Ctx.isoSelect);
      agent.walkPath();
   });


   // Draw blocked cell as Wall
   ext.cycleList(glo.Grid.cellsList, (cell) => {
      draw.cellInfo(cell);
      let gridPos = ext.gridPos_toScreenPos(cell.center);
      if(cell.isBlocked) cell.drawWall(glo.Ctx.units, gridPos, false);
   });

   
   ext.cycleList(glo.OldSelectList,     (agent) => agent.drawSelect(glo.Ctx.isoSelect, "yellow"));
   ext.cycleList(glo.CurrentSelectList, (agent) => agent.drawSelect(glo.Ctx.isoSelect, "blue"));
   
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
         
         // --- Tempory ---
         glo.ViewportSqr = init.setViewportSqr();
         
         init.setAvailableID();

         glo.Grid.init();
         mouseHandler.init();
         keyboardHandler.init();

         // ext.cycleList(glo.Grid.cellsList, (cell) => revCellsList.push(cell));
         // revCellsList.reverse();

         // setTimeout(() => {

         //    revCellsList.forEach(cell => {
         //       let gridPos = ext.gridPos_toScreenPos(cell.center);
         //       cell.drawSprite(glo.Ctx.terrain, gridPos);
         //    });

         // }, 0);

         glo.Grid.cellsList["3-6"].isBlocked = true;
         glo.Grid.cellsList["4-6"].isBlocked = true;
         glo.Grid.cellsList["5-6"].isBlocked = true;
         glo.Grid.cellsList["6-6"].isBlocked = true;
         glo.Grid.cellsList["7-2"].isBlocked = true;
         glo.Grid.cellsList["7-3"].isBlocked = true;
         glo.Grid.cellsList["7-7"].isBlocked = true;
         glo.Grid.cellsList["7-8"].isBlocked = true;
         glo.Grid.cellsList["7-9"].isBlocked = true;
         glo.Grid.cellsList["8-3"].isBlocked = true;
         glo.Grid.cellsList["9-3"].isBlocked = true;

         

         // --- Tempory ---
         // ext.createNewAgent("infantry",  "worker",   "5-3", "");
         // ext.createNewAgent("cavalry",   "swordsman","9-2", "");
         // ext.createNewAgent("cavalry",   "bowman",   "2-6", "");
         // ext.createNewAgent("machinery", "ballista", "8-5", "");
         // ext.createNewAgent("machinery", "catapult", "6-9", "");

         // ext.createNewAgent("infantry", "swordsman", "1-5",  "");
         
         this.generate();

         // --- Tempory ---

         runAnimation();
      },

      generate() {

         let pop = 24;

         const blue   = "Units/Swordsman_Blue.png";
         const purple = "Units/Swordsman_Purple.png";
         const red    = "Units/Swordsman_Red.png";
         
         while(pop > 0) {

            let index = glo.Grid.rand(4);
            let i = glo.Grid.rand(10);
            let j = glo.Grid.rand(10);

            if( glo.Grid.cellsList[`${i}-${j}`].isVacant
            && !glo.Grid.cellsList[`${i}-${j}`].isBlocked) {

               let color = "";

               if(index === 0) color = blue;
               if(index === 1) color = purple;
               if(index === 2) color = red;

               ext.createNewAgent("infantry", "swordsman", `${i}-${j}`, color);
               glo.Grid.cellsList[`${i}-${j}`].isVacant = false;
               pop--;
            }

            else continue;
         }

         console.log(glo.MaxPop -glo.AvailableIDArray.length);
      }
   }
}