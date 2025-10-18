
import {
   Cell,
} from "./_Export";


// =====================================================================
// Grid Class
// =====================================================================
export class Grid {

   cellSize:         number = 40;
   gridSize:         number;
   halfGrid:         number;

   cellsList:        Map<string, Cell> = new Map();

   constructor(params: any) {
      
      this.gridSize = params.gridSize;
      this.halfGrid = params.gridSize *0.5;

      this.setServer_CellsList();
      this.setNeighbors();
   }

   setServer_CellsList() {

      const cellPerSide = Math.floor(this.gridSize / this.cellSize);
      
      for(let i = 0; i < cellPerSide; i++) {     // Collums
         for(let j = 0; j < cellPerSide; j++) {  // Cells
            
            const cell: Cell = new Cell(
               cellPerSide,
               this.cellSize,
               cellPerSide -i -1,
               j
            );
            
            this.cellsList.set(cell.id, cell);
         }
      }
   }

   setClient_CellsList() {

      const tempList: any = {};

      for(const [id, cell] of this.cellsList) {
         tempList[id] = cell.initPack();
      }

      return tempList;
   }

   setNeighbors() {

      for(const [, cell] of this.cellsList) {
         cell.setNeighborsList();
      }
   }

   initPack() {
      return {
         cellSize: this.cellSize,
         gridSize: this.gridSize,
      }
   }
}