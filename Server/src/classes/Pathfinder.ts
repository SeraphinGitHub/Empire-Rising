import {
   ICost,
} from "../utils/interfaces";

import {
   Agent,
   Cell,
} from "./_Export";


// =====================================================================
// Pathfinder Class
// =====================================================================
export class Pathfinder {
   
   // ----- Debug -----
   startDate_1:  number = 0;
   startDate_2:  number = 0;
   // ----- Debug -----

   private Agent: Agent;

   presentCell: Cell | null        = null;
   nextCell:    Cell | null        = null;
   goalCell:    Cell | null        = null;

   costMap:     Map<string, ICost> = new Map();
   openSet:     Set<Cell>          = new Set();
   closedSet:   Set<Cell>          = new Set();
   path:        Cell[]             = [];

   hasTarget:   boolean            = false;
   hasPath:     boolean            = false;

   emptyCost:   ICost = {
      hCost: 0,
      gCost: 0,
      fCost: 0,
      cameFromCell: undefined,
   };


   constructor(Agent: Agent) {
      this.Agent = Agent;
   }

   Debug_SearchTime() {
      const { costMap, path, startDate_1 } = this;

      console.log(
         "hCost: ", Math.floor(costMap.get(path[1].id    )!.hCost),
         "gCost: ", Math.floor(costMap.get(this.presentCell!.id)!.gCost),
         "fCost: ", Math.floor(costMap.get(this.presentCell!.id)!.fCost),
         "                                                                 ",
         `Path was found in: ${ Date.now() -startDate_1 } ms`,
         "                                                                 ",
         `Unit moved: ${ path.length } cells`,
      );
   }

   Debug_MoveTime() {

      console.log(`Unit spend: ${ (Date.now() -this.startDate_2) /1000 } s to reach goal`);
   }

   resetPath() {
      const { curCell } = this.Agent;

      this.costMap.clear();
      this.costMap.set(curCell.id, this.emptyCost);

      this.openSet   = new Set([curCell]);
      this.closedSet = new Set();
      this.hasTarget = false;
      this.hasPath   = false;
      this.path      = [];
   }

   searchPath(cellsList: Map<string, Cell>) {
      
      // ***************************
      // this.startDate_1 = Date.now();
      // ***************************
      
      this.resetPath();

      while(this.openSet.size > 0) {

         this.findLowestFCost();
         this.scanNeighbors(cellsList);

         // If reached destination
         if(this.presentCell!.id === this.goalCell!.id) {
            
            return this.foundPath();
            // this.searchVacancy(cellsList);
            
            // ***************************
            // this.startDate_2 = Date.now();
            // this.Debug_SearchTime();
            // ***************************
         }
      }

      this.hasPath = false;
   }

   calcHeuristic(
      startCell: Cell,
      goalCell:  Cell,
   ): number {

      const { x: startX, y: startY } = startCell.center;
      const { x: goalX,  y: goalY  } = goalCell.center;
      
      const deltaX = Math.abs(goalX -startX);
      const deltaY = Math.abs(goalY -startY);
      const dist   = Math.hypot(deltaX, deltaY);

      return dist;
   }

   findLowestFCost() {
      
      const { openSet, costMap }   = this;
      let lowestFCost: number      = Infinity;

      for(const cell of openSet) {
         const { fCost, hCost }: ICost = costMap.get(cell.id)!;
         
         if(fCost <= lowestFCost
         || hCost <  costMap.get(this.presentCell!.id)!.hCost) {
   
            lowestFCost      = fCost;
            this.presentCell = cell;
         }
      }
   }

   scanNeighbors(cellsList: Map<string, Cell>) {
      
      const presentCell           = this.presentCell!;
      const { id, nebStatusList } = presentCell;

      // Cycle all neighbors if exists
      for(const sideName in nebStatusList) {

         const { id: nebID, isDiagonal } = nebStatusList[sideName];
         const neighbor: Cell            = cellsList.get(nebID)!;

         // If this neighbor hasn't been scanned yet
         if(!this.closedSet.has(neighbor)
         && !neighbor.isBlocked) {
            
            const gCost:       number = this.costMap.get(id)!.gCost;
            const gValue:      number = isDiagonal ? 1.4 : 1;
            const new_gCost:   number = gCost +gValue;
            const nebCostData: ICost | undefined = this.costMap.get(nebID);
            
            // If neighbor already valid && worse gCost || blockedDiag ==> skip this neb
            if((this.openSet.has(neighbor) && nebCostData && new_gCost > nebCostData.gCost)
            || presentCell.isBlockedDiag(cellsList, neighbor)) {

               continue;
            }
            
            const hCost      = this.calcHeuristic(neighbor, this.goalCell!);
            let cameFromCell = this.openSet.size > 1 ? presentCell : undefined;

            this.costMap.set(nebID, {
               hCost,
               gCost:        new_gCost,
               fCost:        hCost +new_gCost,
               cameFromCell,
            });

            this.openSet.add(neighbor);
         }
      }

      this.openSet.delete(presentCell);
      this.closedSet.add(presentCell);
   }

   foundPath() {

      let goalCell = this.presentCell!;
      this.path.push(goalCell);

      // Set found path
      while(goalCell) {
         const { cameFromCell }  = this.costMap.get(goalCell.id)!;
         
         if(!cameFromCell) break;
         
         this.path.push(cameFromCell);
         goalCell = cameFromCell;
      }

      this.presentCell!.isTargeted = false;
      this.path.reverse();
      this.nextCell  = this.path[0];
      
      this.hasPath = true;
   }

   // searchVacancy(cellsList: Map<string, Cell>) { // <== Tempory (Need Recast)

      // if(curCell.isVacant || curCell.agentIDset.has(this.id)) return;

      // const nebList  = curCell.nebStatusList;
      // let vacantPath = [];

      // for(const sideName in nebList) {
      //    const nebID:    string    = nebList[sideName].id;
      //    const neighbor: Cell = glo.Grid!.cellsList.get(nebID)!;
         
      //    vacantPath.push(neighbor);
      // }
      
      // vacantPath.sort((neb: Cell) => this.Pathfinder.costMap.get(neb.id)!.fCost);

      // while(vacantPath.length > 0) {
      
      //    this.Pathfinder.goalCell = vacantPath[0];
      //    this.Pathfinder.searchPath();
      //    vacantPath.shift();
      // }
   // }
}
