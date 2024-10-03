
import {
   Cell,
   GameManager,
} from "./_Export";


// =====================================================================
// Grid Class
// =====================================================================
export class Grid {

   private GManager: GameManager;

   cellsList:        Map<string, Cell> = new Map();
   blockedCells:     Set<Cell>         = new Set();
   occupiedCells:    Set<Cell>         = new Set();

   constructor(GManager: GameManager) {

      this.GManager = GManager;
      this.init();
   }

   init() {
      
      this.setCellsList();
      this.setNeighbors();
   }

   setCellsList() {
      let zIndex = 0;

      const { gridSize, cellSize } = this.GManager;
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


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawGrid() {

      if(this.GManager.isGridHidden) return;
      
      for(const [, cell] of this.cellsList) {
         cell.drawInfos(this.GManager.Ctx.isometric);
      }
   }
   
}