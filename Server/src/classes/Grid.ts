
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
   occupiedCells:    Set<Cell>         = new Set();

   constructor(params: any) {
      
      this.gridSize = params.gridSize;
      this.halfGrid = params.gridSize *0.5;

      this.setCellsList();
      this.setNeighbors();
   }

   setCellsList() {
      let zIndex = 0;

      const cellPerSide = Math.floor(this.gridSize / this.cellSize);
      
      for(let i = 0; i < cellPerSide; i++) {     // Collums
         for(let j = 0; j < cellPerSide; j++) {  // Cells
            
            const cell: Cell = new Cell(
               zIndex,
               cellPerSide,
               this.cellSize,
               cellPerSide -i -1,
               j
            );
            
            this.cellsList.set(cell.id, cell);
            zIndex++;
         }
      }
   }

   setNeighbors() {

      for(const [, cell] of this.cellsList) {
         cell.setNeighborsList();
      }
   }

   addToOccupiedMap(cell: Cell) {

      let tempArray: Cell[] = [...this.occupiedCells];
      
      tempArray.push(cell);
      tempArray.sort((cell: any, nextCell: any) => cell.zIndex -nextCell.zIndex);

      this.occupiedCells = new Set(tempArray);
   }

   initPack() {
      return {
         cellSize: this.cellSize,
         gridSize: this.gridSize,
      }
   }
}