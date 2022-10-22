
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const glo  = require("./modules/mod_globalVar.js");
const ext  = require("./modules/mod_extendedMethods.js");
const draw = require("./modules/mod_drawMethods.js");


// ================================================================================================
// Mouse Inputs
// ================================================================================================
const mouse_Move = (event) => {

   glo.SelectArea.currentPos = ext.getScreenPos(event);
   glo.IsoGridPos = ext.screenPos_toGridPos(glo.SelectArea.currentPos.isometric);
   glo.HoverCell  = ext.setHoverCell();
   
   ext.updateDOM();

   if(glo.SelectArea.isSelectArea) {
      ext.clearCanvas("selection");
      draw.selectArea();
      ext.unitSelection();
   }

   // ext.cycleList(glo.AgentsList, (agent) => {
   //    let gridPos = ext.gridPos_toScreenPos(agent.position);
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
      ext.clearCanvas("selection");
   }
}

const mouse_RightClick = (state) => {

   if(state === "Down") {
      // ext.withinTheGrid(() => {
      //    ext.cycleList(glo.SelectedUnitsList, (agent) => {
      
      //       agent.endCell = glo.Grid.cellsList[glo.HoverCell.id];
      //       agent.searchPath(glo.Grid.cellsList);
      //       agent.displayPath(glo.Ctx.isoSelect, true);
      //       agent.startCell = agent.endCell;
      //    });
      // });
   }

   if(state === "Up") {
      
   }
}

const mouse_ScrollClick = (state) => {
   
}


// ================================================================================================
// Init Mouse Handler
// ================================================================================================
module.exports = {

   init() {
      window.addEventListener("mousemove", (event) => mouse_Move(event));
      
      window.addEventListener("mousedown", (event) => {
         glo.SelectArea.oldPos = ext.getScreenPos(event);
         
         const state = "Down";
         if(event.which === 1) mouse_LeftClick  (state);
         if(event.which === 2) mouse_ScrollClick(state);
         if(event.which === 3) mouse_RightClick (state);
      });
         
      window.addEventListener("mouseup", (event) => {
         
         const state = "Up";
         if(event.which === 1) mouse_LeftClick  (state);
         if(event.which === 2) mouse_ScrollClick(state);
         if(event.which === 3) mouse_RightClick (state);
      });
   }
}