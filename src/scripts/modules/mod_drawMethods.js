
"use strict"

const glo = require("./mod_globalVar.js");

// ================================================================================================
// Draw Functions
// ================================================================================================
module.exports = {
      
   cellInfo(cell) {

      if(glo.Debug.showCellInfo) {
         let ctxIsoSelect = glo.Ctx.isoSelect;
         
         cell.drawFrame(ctxIsoSelect);
         cell.drawCenter(ctxIsoSelect);
         cell.drawID(ctxIsoSelect);
      }
   },

   selectArea() {
      let selected   = glo.SelectArea;
      let oldPos     = selected.oldPos.cartesian;
      let currentPos = selected.currentPos.cartesian;

      // Set rect size
      selected.width  = currentPos.x -oldPos.x;
      selected.height = currentPos.y -oldPos.y;
   
      // Set rect params
      glo.Ctx.selection.lineWidth   = selected.lineWidth;
      glo.Ctx.selection.strokeStyle = selected.borderColor;
      glo.Ctx.selection.fillStyle   = selected.filledColor;

      // Draw borders
      glo.Ctx.selection.strokeRect(
         oldPos.x,
         oldPos.y,
         selected.width,
         selected.height
      );
      
      // Draw filled rect
      glo.Ctx.selection.fillRect(
         oldPos.x,
         oldPos.y,
         selected.width,
         selected.height
      );
   },

   hover() {

      glo.Ctx.isoSelect.strokeStyle = "yellow";
      glo.Ctx.isoSelect.lineWidth = 4;
      
      // Draw hovelCell frame
      glo.Ctx.isoSelect.strokeRect(
         glo.HoverCell.gridPos.x,
         glo.HoverCell.gridPos.y,
         glo.Grid.cellSize,
         glo.Grid.cellSize,
      );
   },

}