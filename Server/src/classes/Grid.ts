
import { Cell } from "./_Export";


// =====================================================================
// Grid Class
// =====================================================================
export class Grid {

   cellsList:        Map<string, Cell> = new Map();
   blockedCells:     Set<Cell>         = new Set();
   occupiedCells:    Set<Cell>         = new Set();

   constructor() {
      
   }

   init(params: any) {
      
      this.setCellsList(params);
      this.setNeighbors();
   }

   setCellsList(params: any) {
      let zIndex = 0;

      const { gridSize, cellSize } = params;

      const cellPerSide = Math.floor(gridSize / cellSize);
      
      for(let i = 0; i < cellPerSide; i++) {     // Collums
         for(let j = 0; j < cellPerSide; j++) {  // Cells
            
            const cell: Cell = new Cell(
               zIndex,
               cellPerSide,
               cellSize,
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
}