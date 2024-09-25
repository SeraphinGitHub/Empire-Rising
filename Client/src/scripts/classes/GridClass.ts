
"use strict"

import { CellClass } from "../classes/_Export";

// =====================================================================
// Grid Class
// =====================================================================
export class GridClass {

   // Grid Lists
   cellsList:     Map<string, CellClass> = new Map();
   blockedCells:  Set<CellClass>         = new Set();
   occupiedCells: Set<CellClass>         = new Set();
   
   // Grid Dimensions
   cellSize:    number;
   gridSize:    number;
   cellPerSide: number;

   constructor(params: {
      cellSize: number;
      gridSize: number,
   }) {

      this.cellSize    = params.cellSize;
      this.gridSize    = params.gridSize;
      this.cellPerSide = Math.floor(this.gridSize / this.cellSize);

      this.init();
   }

   rand(
      maxValue: number,
   ): number {

      return Math.floor( Math.random() *maxValue );
   }

   init() {
      let zIndex = 0;

      // Init grid
      for(let i = 0; i < this.cellPerSide; i++) {  // Collums
         for(let j = 0; j < this.cellPerSide; j++) {  // Rows
            
            const cell: CellClass = new CellClass(
               zIndex,
               this.cellPerSide,
               this.cellSize,
               this.cellPerSide -i -1,
               j
            );
            
            this.cellsList.set(cell.id, cell);
            zIndex++;
         }
      }

      // Set cells neighborsList
      this.cellsList.forEach((cell) => cell.setNeighborsList());
   }

   addToOccupiedMap(cell: CellClass) {

      let tempArray: CellClass[] = [...this.occupiedCells];
      
      tempArray.push(cell);
      tempArray.sort((cell: any, nextCell: any) => cell.zIndex -nextCell.zIndex);

      this.occupiedCells = new Set(tempArray);
   }
   
}