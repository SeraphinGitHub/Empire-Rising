import {
   ICost,
} from "../utils/interfaces";
import { Cell } from "./_Export";
import { glo } from "../utils/_GlobalVar";
import { Agent } from './Agent';

// =====================================================================
// Pathfinder Class
// =====================================================================
export class PathfinderClass {
   agent: Agent;
   openSet: Set<Cell>;
   closedSet: Set<Cell>;
   costMap: Map<string, ICost>;
   path: Cell[];
   emptyCost: ICost = {
      hCost: 0,
      gCost: 0,
      fCost: 0,
      cameFromCell: undefined,
   };

   constructor(agent: Agent) {
      this.agent = agent;
      this.openSet = new Set();
      this.closedSet = new Set();
      this.costMap = new Map();
      this.path = [];
   }

   searchPath() {
      this.costMap.clear();
      this.costMap.set(this.agent.startCell.id, this.emptyCost);

      this.openSet = new Set([this.agent.startCell]);
      this.closedSet = new Set();
      this.path = [];

      while (this.openSet.size > 0) {
         const presentCell = this.lowestFCostCell()!;
         this.scanNeighbors(presentCell);

         if (presentCell.id === this.agent.goalCell!.id) {
            this.foundPath(presentCell);
            this.agent.isMoving = true;
            return;
         }
      }

      this.agent.isMoving = false;
   }

   lowestFCostCell(): Cell | null {
      let lowestFCost = Infinity;
      let presentCell: Cell | null = null;

      this.openSet.forEach((cell: Cell) => {
         const cellData = this.costMap.get(cell.id)!;

         if (cellData.fCost < lowestFCost || (cellData.fCost === lowestFCost && cellData.hCost < this.costMap.get(presentCell!.id)!.hCost)) {
            lowestFCost = cellData.fCost;
            presentCell = cell;
         }
      });

      return presentCell;
   }

   scanNeighbors(presentCell: Cell) {
      const nebList = presentCell.neighborsList;
      const cellsList = glo.Grid!.cellsList;
      const straightValue = presentCell.size * 0.5;
      const diagValue = 1.4 * straightValue;

      for (const sideName in nebList) {
         const { id: nebID, isDiagonal } = nebList[sideName];
         const neighbor = cellsList.get(nebID)!;

         if (!this.closedSet.has(neighbor) && !neighbor.isBlocked && neighbor.isVacant) {
            const gCost = this.costMap.get(presentCell.id)!.gCost;
            const gValue = isDiagonal ? diagValue : straightValue;
            const new_gCost = gCost + gValue;
            const nebCostData = this.costMap.get(nebID);

            if ((this.openSet.has(neighbor) && nebCostData && new_gCost > nebCostData.gCost) || presentCell.isBlockedDiag(cellsList, neighbor)) {
               continue;
            }

            this.openSet.add(neighbor);
            const hCost = this.calcHeuristic(neighbor);
            
            this.costMap.set(nebID, {
               hCost,
               gCost: new_gCost,
               fCost: hCost + new_gCost,
               cameFromCell: presentCell,
            });
         }
      }

      this.openSet.delete(presentCell);
      this.closedSet.add(presentCell);
   }

   foundPath(presentCell: Cell) {
      this.path.push(presentCell);
      let cameFromCell = this.costMap.get(presentCell.id)?.cameFromCell;

      while (cameFromCell) {
         this.path.unshift(cameFromCell);
         cameFromCell = this.costMap.get(cameFromCell.id)?.cameFromCell;
      }
   }

   calcHeuristic(neighbor: Cell) {
      return Math.hypot(
         this.agent.goalCell!.center.x - neighbor.center.x,
         this.agent.goalCell!.center.y - neighbor.center.y
      );
   }
}
