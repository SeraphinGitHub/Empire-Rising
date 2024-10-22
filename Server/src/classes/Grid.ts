
import { BattleManager } from "../modules/_Export";
import { Cell          } from "./_Export";


// =====================================================================
// Grid Class
// =====================================================================
export class Grid {

   private BM:    BattleManager;

   cellsList:     Map<string, Cell> = new Map();
   occupiedCells: Set<Cell>         = new Set();

   constructor(BManager: BattleManager) {

      this.BM = BManager;
      this.init();
   }

   init() {
      this.setCellsList();
      this.setNeighbors();
   }

   setCellsList() {
      let zIndex = 0;

      const { gridSize, cellSize } = this.BM;

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