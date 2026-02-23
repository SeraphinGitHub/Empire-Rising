"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pathfinder = void 0;
// =====================================================================
// Pathfinder Class
// =====================================================================
class Pathfinder {
    // ----- Debug -----
    startDate_1 = 0;
    startDate_2 = 0;
    // ----- Debug -----
    Agent;
    presentCell = null;
    nextCell = null;
    goalCell = null;
    costMap = new Map();
    openSet = new Set();
    closedSet = new Set();
    path = [];
    hasTarget = false;
    hasPath = false;
    emptyCost = {
        hCost: 0,
        gCost: 0,
        fCost: 0,
        cameFromCell: undefined,
    };
    constructor(Agent) {
        this.Agent = Agent;
    }
    Debug_SearchTime() {
        const { costMap, path, startDate_1 } = this;
        console.log("hCost: ", Math.floor(costMap.get(path[1].id).hCost), "gCost: ", Math.floor(costMap.get(this.presentCell.id).gCost), "fCost: ", Math.floor(costMap.get(this.presentCell.id).fCost), "                                                                 ", `Path was found in: ${Date.now() - startDate_1} ms`, "                                                                 ", `Unit moved: ${path.length} cells`);
    }
    Debug_MoveTime() {
        console.log(`Unit spend: ${(Date.now() - this.startDate_2) / 1000} s to reach goal`);
    }
    resetPath() {
        const { curCell } = this.Agent;
        this.costMap.clear();
        this.costMap.set(curCell.id, this.emptyCost);
        this.openSet = new Set([curCell]);
        this.closedSet = new Set();
        this.hasTarget = false;
        this.hasPath = false;
        this.path = [];
    }
    searchPath(cellsList) {
        // ***************************
        // this.startDate_1 = Date.now();
        // ***************************
        this.resetPath();
        while (this.openSet.size > 0) {
            this.findLowestFCost();
            this.scanNeighbors(cellsList);
            // If reached destination
            if (this.presentCell.id === this.goalCell.id) {
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
    calcHeuristic(startCell, goalCell) {
        const { x: startX, y: startY } = startCell.center;
        const { x: goalX, y: goalY } = goalCell.center;
        const deltaX = Math.abs(goalX - startX);
        const deltaY = Math.abs(goalY - startY);
        const dist = Math.hypot(deltaX, deltaY);
        return dist;
    }
    findLowestFCost() {
        const { openSet, costMap } = this;
        let lowestFCost = Infinity;
        for (const cell of openSet) {
            const { fCost, hCost } = costMap.get(cell.id);
            if (fCost <= lowestFCost
                || hCost < costMap.get(this.presentCell.id).hCost) {
                lowestFCost = fCost;
                this.presentCell = cell;
            }
        }
    }
    scanNeighbors(cellsList) {
        const presentCell = this.presentCell;
        const { id, nebStatusList } = presentCell;
        // Cycle all neighbors if exists
        for (const sideName in nebStatusList) {
            const { id: nebID, isDiagonal } = nebStatusList[sideName];
            const neighbor = cellsList.get(nebID);
            // If this neighbor hasn't been scanned yet
            if (!this.closedSet.has(neighbor)
                && !neighbor.isBlocked) {
                const gCost = this.costMap.get(id).gCost;
                const gValue = isDiagonal ? 1.4 : 1;
                const new_gCost = gCost + gValue;
                const nebCostData = this.costMap.get(nebID);
                // If neighbor already valid && worse gCost || blockedDiag ==> skip this neb
                if ((this.openSet.has(neighbor) && nebCostData && new_gCost > nebCostData.gCost)
                    || presentCell.isBlockedDiag(cellsList, neighbor)) {
                    continue;
                }
                const hCost = this.calcHeuristic(neighbor, this.goalCell);
                let cameFromCell = this.openSet.size > 1 ? presentCell : undefined;
                this.costMap.set(nebID, {
                    hCost,
                    gCost: new_gCost,
                    fCost: hCost + new_gCost,
                    cameFromCell,
                });
                this.openSet.add(neighbor);
            }
        }
        this.openSet.delete(presentCell);
        this.closedSet.add(presentCell);
    }
    foundPath() {
        let goalCell = this.presentCell;
        this.path.push(goalCell);
        // Set found path
        while (goalCell) {
            const { cameFromCell } = this.costMap.get(goalCell.id);
            if (!cameFromCell)
                break;
            this.path.push(cameFromCell);
            goalCell = cameFromCell;
        }
        this.presentCell.isTargeted = false;
        this.path.reverse();
        this.nextCell = this.path[0];
        this.hasPath = true;
    }
}
exports.Pathfinder = Pathfinder;
