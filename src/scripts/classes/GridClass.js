
"use strict"

const CellClass = require("./CellClass.js");


// =====================================================================
// Grid Class
// =====================================================================
class GridClass {
   constructor(params) {

      this.cellsList = {};
      this.width = params.width;
      this.height = params.height;
      this.cellSize = params.cellSize;
      
      this.collums = (this.width  -(this.width  %this.cellSize)) /this.cellSize;
      this.rows    = (this.height -(this.height %this.cellSize)) /this.cellSize;
   }

   rand(maxValue) {
      return Math.floor( Math.random() *maxValue );
   }

   init() {

      // Init grid
      for(let i = 0; i < this.collums; i++) {
         for(let j = 0; j < this.rows; j++) {
            
            const cell = new CellClass(this.collums, this.rows, this.cellSize, i, j);
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