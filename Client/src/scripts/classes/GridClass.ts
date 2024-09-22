
"use strict"

import { CellClass } from "../classes/_Export";

// =====================================================================
// Grid Class
// =====================================================================
export class GridClass {

   cellsList:     Map<string, CellClass> = new Map();
   blockedCells:  Set<CellClass>         = new Set();
   occupiedCells: Set<CellClass>         = new Set();
   
   cellSize:      number;
   gridSize:      number;
   cellPerSide:   number;

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
      let cellCount = 0;

      // Init grid
      for(let i = 0; i < this.cellPerSide; i++) {  // Collums
         for(let j = 0; j < this.cellPerSide; j++) {  // Rows
            
            const cell: CellClass = new CellClass(
               cellCount,
               this.cellPerSide,
               this.cellSize,
               this.cellPerSide -i -1,
               j
            );
            
            this.cellsList.set(cell.id, cell);
            cellCount++;
         }
      }

      // Set cells neighborsList
      this.cellsList.forEach((cell) => cell.setNeighborsList());
   }

   setOccupiedMap(cell: CellClass) {

      this.occupiedCells.add(cell);
      let tempArray: CellClass[] = [];

      this.occupiedCells.forEach((cell: CellClass) => {
         tempArray.push(cell);
      });

      tempArray.sort((a: any, b: any) => a.count -b.count);
      this.occupiedCells = new Set(tempArray);
   }
   
}