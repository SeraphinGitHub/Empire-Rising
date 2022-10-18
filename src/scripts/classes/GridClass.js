
"use strict"

const CellClass = require("./CellClass.js");


// =====================================================================
// Grid Class
// =====================================================================
class GridClass {
   constructor(width, height, cellSize) {

      this.cellsList = {};
      
      this.width = width;
      this.height = height;
      this.cellSize = cellSize;
      
      this.collums = (width -(width %cellSize)) /cellSize;
      this.rows = (height -(height %cellSize)) /cellSize;
   }

   rand(maxValue) {
      return Math.floor(Math.random() *maxValue);
   }

   init(isEuclidean) {

      // Init grid
      for(let i = 0; i < this.collums; i++) {
         for(let j = 0; j < this.rows; j++) {
            
            const cell = new CellClass(this.collums, this.rows, this.cellSize, isEuclidean, i, j);
            this.cellsList[cell.id] = cell;
         }
      }

      // Set cells neighborsList
      for(let i in this.cellsList) {
         let cell = this.cellsList[i];

         cell.initNeighborsList(this.cellsList);
      }
   }
}

module.exports = GridClass;