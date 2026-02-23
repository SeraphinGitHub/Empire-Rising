"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
const _Export_1 = require("./_Export");
// =====================================================================
// Grid Class
// =====================================================================
class Grid {
    cellSize = 40;
    gridSize;
    halfGrid;
    cellsList = new Map();
    constructor(params) {
        this.gridSize = params.gridSize;
        this.halfGrid = params.gridSize * 0.5;
        this.setServer_CellsList();
        this.setNeighbors();
    }
    setServer_CellsList() {
        const cellPerSide = Math.floor(this.gridSize / this.cellSize);
        for (let i = 0; i < cellPerSide; i++) { // Collums
            for (let j = 0; j < cellPerSide; j++) { // Cells
                const cell = new _Export_1.Cell(cellPerSide, this.cellSize, cellPerSide - i - 1, j);
                this.cellsList.set(cell.id, cell);
            }
        }
    }
    setClient_CellsList() {
        const tempList = {};
        for (const [id, cell] of this.cellsList) {
            tempList[id] = cell.initPack();
        }
        return tempList;
    }
    setZoneOccupied(mainCell, elemSize) {
        const { i: cell_i, j: cell_j } = mainCell;
        let tempList = [];
        for (let i = 0; i < elemSize; i++) {
            for (let j = 0; j < elemSize; j++) {
                const cellID = `${cell_i + i}-${cell_j - j}`;
                const cell = this.cellsList.get(cellID);
                if (!cell || cell.isBlocked)
                    continue;
                cell.isBlocked = true;
                tempList.push(cell.id);
            }
        }
        return tempList;
    }
    setNeighbors() {
        for (const [, cell] of this.cellsList) {
            cell.setNeighborsList();
        }
    }
    initPack() {
        return {
            cellSize: this.cellSize,
            gridSize: this.gridSize,
        };
    }
}
exports.Grid = Grid;
