"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battle = void 0;
const _Export_1 = require("../classes/_Export");
const buildStats_1 = require("../utils/buildStats");
const unitStats_1 = require("../utils/unitStats");
const nodeStats_1 = require("../utils/nodeStats");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TILES = {
    highGrass: [
        "6-9",
        "6-10",
        "7-9",
        "7-8",
        "6-8",
        "5-9",
        "5-8",
        "5-10",
        "7-10",
        "8-9",
        "8-8",
        "9-8",
        "9-7",
        "10-7",
        "8-7",
        "9-6",
        "5-11",
        "4-11",
        "4-10",
        "3-10",
        "4-9",
        "6-7",
        "7-11",
        "8-10",
        "4-12",
        "3-11",
        "13-13",
        "13-14",
        "12-13",
        "11-12",
        "12-11",
        "8-23",
        "9-24",
        "10-24",
        "11-24",
        "13-26",
        "13-27",
        "14-27",
        "14-28",
        "15-28",
        "16-27",
        "17-26",
        "19-13",
        "19-14",
        "19-15",
        "18-13",
        "23-7",
        "24-8",
        "25-9",
        "26-10",
        "26-11",
        "24-8",
        "22-7",
        "17-4",
        "18-4",
        "18-5",
        "17-5",
        "16-3",
        "17-3",
        "16-4",
        "15-3",
        "16-2",
        "31-4",
        "32-4",
        "33-4",
        "33-4",
        "33-5",
        "32-5",
        "33-6",
        "33-3",
        "34-4",
        "25-23",
        "26-24",
        "27-25",
        "28-26",
        "28-27",
        "28-29",
        "27-30",
        "26-30",
        "26-31",
        "25-31",
        "24-31",
        "27-26",
        "28-25",
        "29-26",
        "29-26",
        "29-28",
        "29-27",
        "29-29",
        "25-23",
        "25-23",
        "25-24",
        "26-25",
        "27-24",
        "29-25",
        "28-30",
        "27-30",
        "27-31",
        "30-27",
        "22-27",
        "21-28",
        "21-29",
        "20-30",
        "19-30",
        "20-29",
        "20-29",
        "19-31",
        "20-31",
        "18-29",
        "18-30",
        "22-29",
        "4-28",
        "5-28",
        "5-29",
        "6-29",
        "7-29",
        "6-30",
        "6-28",
    ],
};
const BUILDINGS = {
    castle: [
        "21-12",
    ],
    barrack: [
        "22-23",
    ],
    warehouse: [
        "15-11",
        "29-16",
        "32-39",
    ],
    wall: [
        "9-21",
        "9-23",
        "9-25",
        // "21-8",
        // "22-8",
        // "23-8",
        // "24-8",
        // "25-8",
        // "25-9",
        // "25-10",
        // "25-11",
        // "25-12",
        // "24-12",
        // "23-12",
        // "22-12",
        // "21-12",
        // "21-11",
        // "21-10",
        // "21-9",
        "33-16",
        "34-17",
        "35-18",
        "36-19",
        "34-15",
        "35-14",
        "36-13",
        "37-12",
        "38-13",
        "39-14",
        "40-15",
        "40-15",
        "39-16",
        "38-17",
        "37-18",
    ],
};
const NODES = {
    coal: [
        "26-28",
        "28-42",
        "33-22",
    ],
    gold: [
        "32-11",
        "36-31",
        "14-32",
    ],
    iron: [
        "24-15",
        "21-36",
    ],
    stone: [
        "15-18",
        "40-26",
    ],
    tree_1: [
        "11-17",
        "31-8",
    ],
    tree_2: [
        "34-27",
        "34-25",
        "36-27",
        "28-35",
        "30-7",
    ],
    tree_3: [
        "35-27",
        "35-26",
        "31-9",
    ],
    tree_4: [
        "29-35",
    ],
    tree_5: [
        "35-25",
        "30-8",
    ],
    tree_6: [
        "36-26",
        "32-8",
    ],
};
// =====================================================================
// Battle Class
// =====================================================================
class Battle {
    syncRate = Math.floor(1000 / Number(process.env.SERVER_FRAME_RATE));
    Room;
    id;
    playersList = new Map();
    unitsList = new Map();
    nodesList = new Map();
    buildsList = new Map();
    battleMaxPop;
    curPop = 0;
    vacantIDsList = [];
    Grid;
    constructor(params) {
        this.Room = params.ServerIO.to(params.id);
        this.id = params.id;
        this.battleMaxPop = params.maxPop;
        this.Grid = new _Export_1.Grid(params);
        this.createNewPlayer(params.playerProps);
        this.init();
    }
    init() {
        this.setVacantIDsList();
        // this.setServerList(this.unitsList,  UNIT_STATS,  UNITS,     Agent   );
        this.setServerList(this.nodesList, nodeStats_1.NODE_STATS, NODES, _Export_1.Node);
        this.setServerList(this.buildsList, buildStats_1.BUILD_STATS, BUILDINGS, _Export_1.Building);
        this.sync();
    }
    // initPack ==> (Sent to each client)
    initPack() {
        return {
            frameRate: Number(process.env.CLIENT_FRAME_RATE),
            maxPop: this.setPlayerMaxPop(),
            cellsList: this.Grid.setClient_CellsList(),
            // unitsList:  this.setClientList(this.unitsList),
            nodesList: this.setClientList(this.nodesList),
            buildsList: this.setClientList(this.buildsList),
            BUILD_STATS: buildStats_1.BUILD_STATS,
            UNIT_STATS: unitStats_1.UNIT_STATS,
            NODE_STATS: nodeStats_1.NODE_STATS,
            TILES, // ==> Tempory
        };
    }
    spread(channel, data) {
        this.Room.emit(channel, data);
    }
    start() {
        for (const [, player] of this.playersList) {
            player.maxPop = this.setPlayerMaxPop();
            player.initBattle(this.Grid.initPack(), this.initPack());
            player.watch(this);
            // **************************************************************
            let cellID_Array = [];
            if (player.teamID === 1)
                cellID_Array = ["27-22", "25-18", "12-23", "14-21", "14-23", "17-21", "19-21", "21-21", "19-19", "17-19", "17-23", "19-23", "21-23", "21-19"];
            if (player.teamID === 2)
                cellID_Array = ["17-27", "19-27", "21-27", "19-25", "17-25", "17-29", "19-29", "21-29", "21-25"];
            cellID_Array.forEach((cellID) => {
                let unitID = "worker";
                if (cellID === "14-21")
                    unitID = "knight";
                if (cellID === "14-23")
                    unitID = "barbarian";
                if (cellID === "12-23")
                    unitID = "swordsman";
                player.recruitUnit({
                    cellID,
                    unitID,
                    teamID: player.teamID,
                    teamColor: player.teamColor,
                }, this);
            });
            // **************************************************************
        }
    }
    sync() {
        setInterval(() => {
            let updatePack = [];
            for (const [, agent] of this.unitsList) {
                agent.update(this);
                updatePack.push(agent.updatePack());
            }
            this.spread("serverSync", updatePack);
        }, Math.floor(1000 / Number(process.env.SERVER_FRAME_RATE)));
    }
    // =========================================================================================
    // Methods
    // =========================================================================================
    getCell(id) {
        return this.Grid.cellsList.get(id);
    }
    setPlayerMaxPop() {
        const { battleMaxPop, playersList } = this;
        return Math.floor(battleMaxPop / playersList.size);
    }
    getIndexID(coord, value, index, cellSize) {
        return (coord + value - (cellSize * (index + 1))) / cellSize;
    }
    setVacantIDsList() {
        for (let i = 1; i < this.battleMaxPop; i++) {
            this.vacantIDsList.push(i);
        }
    }
    updateGrid() {
        this.spread("updateGrid", this.Grid.setClient_CellsList());
    }
    createNewPlayer(props) {
        const newPlayer = new _Export_1.Player({
            battleID: this.id,
            ...props
        }), { id: playerID } = newPlayer;
        this.playersList.set(playerID, newPlayer);
    }
    createNewAgent(data, playerID) {
        const { unitID, cellID, teamID, teamColor } = data;
        // Add "create unit timer" here ==> Later on !
        const agentStats = unitStats_1.UNIT_STATS[unitID], { popCost } = agentStats;
        const startCell = this.getCell(cellID), { x: cellX, y: cellY } = startCell.center;
        const vacantID = this.vacantIDsList[0];
        startCell.agentIDset.add(vacantID);
        startCell.isVacant = false;
        this.vacantIDsList.splice(0, popCost);
        this.curPop += popCost;
        const newAgent = new _Export_1.Agent({
            id: vacantID,
            playerID,
            teamID,
            teamColor,
            stats: agentStats,
            position: { x: cellX, y: cellY }, // ==> Tempory until create rally point !
            curCell: startCell, // ==> Tempory until create BuildingsClass with spawn position
        });
        this.unitsList.set(vacantID, newAgent);
        return {
            popCost,
            initPack: newAgent.initPack(),
        };
    }
    createNewBuilding(data, playerID) {
        const { buildType, cellID } = data;
        const cell = this.getCell(cellID);
        const player = this.playersList.get(playerID);
        if (!cell || !player || !buildType) {
            console.log({
                createNewBuilding: !cell ? "Building's cell does not exist!"
                    : !player ? "Player does not exist!"
                        : "build_ID does not exist!"
            });
            return null;
        }
        const stats = buildStats_1.BUILD_STATS[buildType];
        const params = {
            ...stats,
            cellID,
            id: this.buildsList.size,
            position: cell.center,
            teamID: player.teamID,
            teamColor: player.teamColor,
        };
        const newBuilding = new _Export_1.Building(params);
        cell.isVacant = false;
        cell.isBlocked = true;
        cell.child = newBuilding;
        player.buildsID_List.set(newBuilding.id, { name: newBuilding.name, cellID });
        this.buildsList.set(newBuilding.id, newBuilding);
        return {
            initPack: newBuilding.initPack(),
            footPrint: this.Grid.setZoneOccupied(cell, stats.buildSize),
        };
    }
    setClientList(elemList) {
        let tempList = [];
        for (const [, elem] of elemList) {
            tempList.push(elem.initPack());
        }
        return tempList;
    }
    setServerList(elemList, ELEM_STATS, ELEM, classType) {
        for (const [elemName, elemStats] of Object.entries(ELEM_STATS)) {
            for (const [keyName, cellID_Array] of Object.entries(ELEM)) {
                if (elemName !== keyName)
                    continue;
                for (const cellID of cellID_Array) {
                    const elemCell = this.getCell(cellID);
                    if (!elemCell)
                        continue;
                    const params = {
                        ...elemStats,
                        id: elemList.size,
                        position: elemCell.center,
                        cellID: elemCell.id,
                    };
                    if (classType === _Export_1.Node) {
                        params["baseAmount"] = elemStats.amount;
                        params["footPrint"] = this.Grid.setZoneOccupied(elemCell, elemStats.nodeSize);
                    }
                    if (classType === _Export_1.Building) {
                        params["teamID"] = 1; // ==> Temp  ************************
                        params["teamColor"] = 0; // ==> Temp  ************************
                        params["baseHealth"] = elemStats.baseHealth;
                        params["footPrint"] = this.Grid.setZoneOccupied(elemCell, elemStats.buildSize);
                    }
                    const newElem = new classType(params);
                    if (classType !== _Export_1.Agent)
                        elemCell.child = newElem;
                    elemCell.isVacant = false;
                    elemCell.isBlocked = true;
                    elemList.set(newElem.id, newElem);
                }
            }
        }
    }
    setSortedUnitList(AgentsID_List, sortedUnitList, cell, nebName, nodeID) {
        for (const id of AgentsID_List) {
            const agent = this.unitsList.get(id);
            const { Pathfinder, isWorker } = agent;
            if (!cell
                || !cell.isVacant
                || cell.isTargeted
                || cell.isBlocked
                || Pathfinder.hasTarget
                || nebName != null && !isWorker) {
                continue;
            }
            agent.isGatherable = false;
            cell.isTargeted = true;
            Pathfinder.hasTarget = true;
            Pathfinder.goalCell = cell;
            // Only for gathering
            if (nebName != null
                && nodeID != null
                // && neb.isVacant // **********************
                && isWorker) {
                agent.isGatherable = true;
                agent.nodeNebName = nebName;
                agent.harvNodeID = nodeID;
                agent.gatherCell = cell;
            }
            sortedUnitList.add(agent);
        }
    }
    unitSearchPath(sortedUnitList) {
        const { cellsList } = this.Grid;
        for (const agent of sortedUnitList) {
            agent.Pathfinder.searchPath(cellsList);
            if (!agent.Pathfinder.hasPath)
                continue;
            agent.hasArrived = false;
            agent.hasUpdated = false;
        }
    }
    startAgentPF(data) {
        const { targetCell, targetArea, AgentsID_List } = data;
        // ===========================================
        // Search path for node gathering position
        // ===========================================
        let sortedUnitList = new Set();
        const focusCell = this.getCell(targetCell?.id);
        if (focusCell && focusCell.child.isNode) {
            for (const [nebName, neb] of Object.entries(focusCell.nebStatusList)) {
                const nodeNeb = this.getCell(neb.id);
                this.setSortedUnitList(AgentsID_List, sortedUnitList, nodeNeb, nebName, focusCell.child.id);
            }
            this.unitSearchPath(sortedUnitList);
            return;
        }
        // ===========================================
        // Search path for normal position
        // ===========================================      
        // Search cells IDs from area
        const { cellSize, } = this.Grid;
        const { x, y, width, height } = targetArea;
        const colNum = width / cellSize;
        const rowNum = height / cellSize;
        // Get all cells IDs
        for (let r = 0; r < rowNum; r++) {
            const rowID = this.getIndexID(y, height, r, cellSize);
            for (let c = 0; c < colNum; c++) {
                const colID = this.getIndexID(x, width, c, cellSize);
                const cell = this.getCell(`${colID}-${rowID}`);
                this.setSortedUnitList(AgentsID_List, sortedUnitList, cell);
            }
        }
        this.unitSearchPath(sortedUnitList);
    }
}
exports.Battle = Battle;
