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

   openSet:     Set<Cell>          = new Set();
   closedSet:   Set<Cell>          = new Set();
   costMap:     Map<string, ICost> = new Map();

   path:        Cell[]             = [];

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

   searchPath(cellsList: Map<string, Cell>) {

      // ***************************
      // this.startDate_1 = Date.now();
      // ***************************

      const { curCell } = this.Agent;

      this.costMap.clear();
      this.costMap.set(curCell.id, this.emptyCost);

      this.openSet   = new Set([curCell]);
      this.closedSet = new Set();
      this.path      = [];

      while(this.openSet.size > 0) {

         this.findLowestFCost();
         this.scanNeighbors(cellsList);

         // If reached destination
         if(this.presentCell!.id === this.goalCell!.id) {
            
            this.foundPath();
            // this.searchVacancy(cellsList);
            this.Agent.isMoving = true;

            // ***************************
            // this.startDate_2 = Date.now();
            // this.Debug_SearchTime();
            // ***************************

            return;
         }
      }

      this.Agent.isMoving = false;
   }

   calcHeuristic(neighbor: Cell): number {

      const { x: goalX, y: goalY } = this.goalCell!.center;
      const { x: nebX,  y: nebY  } = neighbor.center;
      
      const deltaX = Math.abs(goalX -nebX);
      const deltaY = Math.abs(goalY -nebY);
      const dist   = Math.hypot(deltaX, deltaY);

      return dist;
   }

   findLowestFCost() {
      
      const { openSet, costMap }   = this;
      let lowestFCost: number      = Infinity;

      for(const cell of openSet) {
         const { fCost, hCost }: ICost = costMap.get(cell.id)!;
         
         if(fCost <= lowestFCost
         && hCost <  costMap.get(this.presentCell!.id)!.hCost) {
   
            lowestFCost      = fCost;
            this.presentCell = cell;
         }
      }
   }

   scanNeighbors(cellsList: Map<string, Cell>) {
      
      const presentCell                 = this.presentCell!;
      const { id, neighborsList, size } = presentCell;
      const straightValue               = size *0.5;
      const diagValue                   = 1.4 *straightValue;
      
      // Cycle all neighbors if exists
      for(const sideName in neighborsList) {

         const { id: nebID, isDiagonal } = neighborsList[sideName];
         const neighbor: Cell            = cellsList.get(nebID)!;

         // If this neighbor hasn't been scanned yet
         if(!this.closedSet.has(neighbor)
         && !neighbor.isBlocked
         &&  neighbor.isVacant) {
            
            const gCost:       number = this.costMap.get(id)!.gCost;
            const gValue:      number = isDiagonal ? diagValue : straightValue;
            const new_gCost:   number = gCost +gValue;
            const nebCostData: ICost | undefined = this.costMap.get(nebID);
            
            // If neighbor already valid && worse gCost || blockedDiag ==> skip this neb
            if((this.openSet.has(neighbor) && nebCostData && new_gCost > nebCostData.gCost)
            || presentCell.isBlockedDiag(cellsList, neighbor)) {

               continue;
            }

            this.openSet.add(neighbor);
            const hCost = this.calcHeuristic(neighbor);
            
            this.costMap.set(nebID, {
               hCost,
               gCost:        new_gCost,
               fCost:        hCost +new_gCost,
               cameFromCell: presentCell,
            });
         }
      }

      this.openSet.delete(presentCell);
      this.closedSet.add(presentCell);
   }

   foundPath() {
            
      this.path.push(this.presentCell!);
      let cameFromCell = this.costMap.get(this.presentCell!.id)!.cameFromCell;
      
      // Set found path
      while(cameFromCell) {

         this.path.push(cameFromCell);
         cameFromCell = this.costMap.get(cameFromCell.id)!.cameFromCell;
      }

      this.path.reverse();
      this.nextCell        = this.path[0];
      this.Agent.animState = 1;
   }

   searchVacancy(cellsList: Map<string, Cell>) { // <== Tempory (Need Recast)

      // if(curCell.isVacant || curCell.agentIDset.has(this.id)) return;

      // const nebList  = curCell.neighborsList;
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
   }
}
