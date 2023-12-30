
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const glo = require("./modules/globalVar.js");
const ext = require("./modules/extendedMethods.js");


// ================================================================================================
// Mouse Inputs
// ================================================================================================
const mouse_Move = (event) => {
   
   glo.SelectArea.currentPos = ext.getScreenPos(event);
   glo.IsoGridPos = ext.screenPos_toGridPos(glo.SelectArea.currentPos.isometric);
   
   if(ext.isWithinGrid(glo.IsoGridPos)) {
      glo.HoverCell = ext.getHoverCell();
   }

   ext.unitSelection();
}

const mouse_Input = (event, state) => {

   if(state === "Down") glo.SelectArea.oldPos = ext.getScreenPos(event);

   switch(event.which) {

      // Left click
      case 1: {

         if(state === "Down") { 
            glo.SelectArea.isSelecting = true;
         }
         
         if(state === "Up") {
            glo.SelectArea.isSelecting = false;
            ext.unitDiselection();
         }
         
      } break;


      // Scroll click
      case 2: {

         if(state === "Down") {

         }
      
         if(state === "Up") {

         }

      } break;


      // Right click
      case 3: {

         if(state === "Down") {
            if(ext.isWithinGrid(glo.IsoGridPos)) {
               ext.cycleList(glo.OldSelectList, (agent) => {
      
                  const targetCell = glo.Grid.cellsList[glo.HoverCell.id];
      
                  if(targetCell.isBlocked) return;
                  
                  agent.endCell = targetCell;
                  agent.searchPath(glo.Grid.cellsList);
               });
            }
         }
      
         if(state === "Up") {

         }

      } break;
   }
}


// ================================================================================================
// Init Mouse Handler
// ================================================================================================
module.exports = {

   init() {
      window.addEventListener("mousemove", (event) => mouse_Move(event));
      window.addEventListener("mousedown", (event) => mouse_Input(event, "Down"));
      window.addEventListener("mouseup",   (event) => mouse_Input(event, "Up"));
   }
}