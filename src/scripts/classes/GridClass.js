
"use strict"

const CellClass = require("./CellClass.js");


// =====================================================================
// Grid Class
// =====================================================================
class GridClass {
   constructor(params) {

      this.cellsList   = {};
      this.cellSize    = params.cellSize;
      this.gridSize    = params.gridSize;
      this.cellPerSide = (this.gridSize -(this.gridSize %this.cellSize)) /this.cellSize;

      this.init();
   }

   rand(maxValue) {
      return Math.floor( Math.random() *maxValue );
   }

   init() {

      // Init grid
      for(let i = 0; i < this.cellPerSide; i++) {  // Collums
         for(let j = 0; j < this.cellPerSide; j++) {  // Rows
            
            const cell = new CellClass(this.cellPerSide, this.cellSize, i, j);
            this.cellsList[cell.id] = cell;
         }
      }

      // Set cells neighborsList
      for(let i in this.cellsList) {

         this.cellsList[i].initNeighborsList();
      }
   }
}

module.exports = GridClass;