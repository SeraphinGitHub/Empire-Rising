
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
   viewCellsList:    Map<string, Cell> = new Map();
   blockedCells:     Set<Cell>         = new Set();
   occupiedCells:    Set<Cell>         = new Set();
   
   gridSize:         number;
   cellSize:         number;
   cellPerSide:      number;

   constructor(GManager: GameManager) {

      this.GManager    = GManager;
      this.gridSize    = GManager.gridSize;
      this.cellSize    = GManager.cellSize;
      this.cellPerSide = Math.floor(this.gridSize / this.cellSize);

      this.init();
   }

   init() {
      
      this.setCellsList();
      this.setNeighbors();
      this.setViewCellsList();
   }

   setCellsList() {
      let zIndex = 0;

      const { cellSize, cellPerSide } = this;
      
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

      for(const [id, cell] of this.cellsList) {
         cell.setNeighborsList();
      }
   }

   setViewCellsList() {
      const GM = this.GManager;
      
      this.viewCellsList.clear();

      for(const [id, cell] of this.cellsList) {
         const cellPos = GM.gridPos_toScreenPos(cell.center);
         
         if(!GM.isViewScope(cellPos)) continue;

         cell.screenPos.x = cellPos.x;
         cell.screenPos.y = cellPos.y;
         
         this.viewCellsList.set(id, cell);
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

      for(const [id, cell] of this.viewCellsList) {         
         cell.drawInfos(this.GManager.Ctx.isometric);
      }
   }
   
}