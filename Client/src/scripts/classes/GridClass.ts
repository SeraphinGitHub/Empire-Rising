
"use strict"

import {
   ICellClass,
} from "../utils/interfaces";

import { CellClass } from "../classes/_Export";

// =====================================================================
// Grid Class
// =====================================================================
export class GridClass {

   cellsList:   ICellClass = {};
   
   cellSize:    number;
   gridSize:    number;
   cellPerSide: number;

   constructor(params: any) {

      this.cellSize    = params.cellSize;
      this.gridSize    = params.gridSize;
      this.cellPerSide = (this.gridSize -(this.gridSize %this.cellSize)) /this.cellSize;

      this.init();
   }

   rand(
      maxValue: number,
   ): number {

      return Math.floor( Math.random() *maxValue );
   }

   init() {

      // Init grid
      for(let i = 0; i < this.cellPerSide; i++) {  // Collums
         for(let j = 0; j < this.cellPerSide; j++) {  // Rows
            
            const cell: CellClass = new CellClass(this.cellPerSide, this.cellSize, this.cellPerSide -i -1, j);
            this.cellsList[cell.id] = cell;
         }
      }

      // Set cells neighborsList
      for(let i in this.cellsList) {

         this.cellsList[i].setNeighborsList();
      }
   }
   
}