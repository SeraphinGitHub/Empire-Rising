
import { Cell        } from "./_Export";
import { GameManager } from "../modules/GameManager";

// =====================================================================
// Grid Class
// =====================================================================
export class Grid {

   cellsList:        Map<string, Cell> = new Map();

   init(cellsList: any) {

      this.setCellsList(cellsList);
      this.setNeighbors();
   }

   setCellsList(cellsList: any) {

      for(const [id, cellParams] of Object.entries(cellsList)) {
         this.cellsList.set(id, new Cell(cellParams));
      }
   }

   setNeighbors() {

      for(const [, cell] of this.cellsList) {
         cell.setNeighborsList();
      }
   }
   
   updateCell(params: any) {
      const { cellID, varName, newState } = params;

      const cell: any = this.cellsList.get(cellID);
      if(!cell) return;

      cell[varName] = newState;
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawGrid(GM: GameManager) {

      for(const cell of this.cellsList.values()) {
         const cellPos = GM.gridPos_toScreenPos(cell.center);

         if(!GM.isViewScope(cellPos)) continue;

         if(GM.show_Grid)   cell.drawInfos(GM.Ctx.isometric);
         if(GM.isBuildMode) cell.drawGhost(GM.Ctx.isometric);
      }
   }


   // =========================================================================================
   // Update - (Every frame)
   // =========================================================================================
   update(GM: GameManager) {

      this.drawGrid(GM);
   }
}