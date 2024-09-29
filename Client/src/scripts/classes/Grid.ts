
import {
   Cell,
   GameManager,
} from "./_Export";


// =====================================================================
// Grid Class
// =====================================================================
export class Grid {

   cellsList:     Map<string, Cell> = new Map();
   blockedCells:  Set<Cell>         = new Set();
   occupiedCells: Set<Cell>         = new Set();
   
   gridSize:      number;
   cellSize:      number;
   cellPerSide:   number;

   constructor(GManager: GameManager) {

      this.gridSize    = GManager.gridSize;
      this.cellSize    = GManager.cellSize;
      this.cellPerSide = Math.floor(this.gridSize / this.cellSize);

      this.init();
   }

   init() {
      let zIndex = 0;

      // Init grid
      for(let i = 0; i < this.cellPerSide; i++) {  // Collums
         for(let j = 0; j < this.cellPerSide; j++) {  // Rows
            
            const cell: Cell = new Cell(
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
      for(const [id, cell] of this.cellsList) {
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
      if(glo.Params.isGridHidden) return;
   
      const { isoSelect } = glo.Ctx;
      
      this.cellsList.forEach((cell: Cell) => {
         const cellPos = gridPos_toScreenPos(cell.center);
         
         if(!isWithinViewport(cellPos)) return;
            
         cell.screenPos.x = cellPos.x;
         cell.screenPos.y = cellPos.y;
         cell.drawInfos(isoSelect);
      });
   }
   
}