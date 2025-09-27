
import { Cell        } from "./_Export";
import { GameManager } from "../modules/GameManager";

// =====================================================================
// Grid Class
// =====================================================================
export class Grid {

   private GM:       GameManager;

   cellsList:        Map<string, Cell> = new Map();
   blockedCells:     Set<Cell>         = new Set();
   occupiedCells:    Set<Cell>         = new Set();

   constructor(GManager: GameManager) {

      this.GM = GManager;
      this.init();
   }

   init() {
      
      this.setCellsList();
      this.setNeighbors();
   }

   setCellsList() {
      let zIndex = 0;

      const { gridSize, cellSize } = this.GM;
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


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawGrid(GM: GameManager) {

      if(!GM.show_Grid) return;
      
      for(const [, cell] of this.cellsList) {
         cell.drawInfos(GM.Ctx.isometric);
      }
   }


   // =========================================================================================
   // Update - (Every frame)
   // =========================================================================================
   update(GM: GameManager) {

      this.drawGrid(GM);
   }
}