"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const _Export_1 = require("./_Export");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// =====================================================================
// Agent Class
// =====================================================================
class Agent {
    id;
    playerID;
    teamID;
    teamColor;
    name;
    nodeNebName = "";
    spritePath;
    spriteSpecs;
    state = 1;
    oldHarvNodeID = 0;
    harvNodeID = -1;
    popCost;
    health;
    armor;
    damages;
    buildSpeed;
    gatherSpeed;
    gatherAmount = 0;
    carryAmount;
    gatherIntID = null;
    baseSpeed;
    moveSpeed;
    attackSpeed;
    animDelay;
    lastUpdate = Date.now();
    position;
    collider;
    pathID = [];
    oldCell = null;
    curCell;
    gatherCell = null;
    dropOffCell = null;
    isUnit;
    isWorker;
    hasArrived = true;
    hasReachNext = true;
    hasUpdated = false;
    isMoving = false;
    isSelected = false;
    isAttacking = false;
    isGatherable = false;
    isGathering = false;
    isPathReload = false;
    // -----------------
    // States
    // -----------------
    // die    => 0
    // idle   => 1
    // walk   => 2
    // attack => 3
    // gather => 4
    // **********************************************
    hasGathered = false;
    // **********************************************
    Pathfinder;
    constructor(params) {
        const { stats } = params;
        this.id = params.id;
        this.playerID = params.playerID;
        this.teamID = params.teamID;
        this.teamColor = params.teamColor;
        this.position = params.position;
        this.curCell = params.curCell;
        this.name = stats.name;
        this.collider = stats.collider;
        this.popCost = stats.popCost;
        this.health = stats.health;
        this.armor = stats.armor;
        this.damages = stats.damages;
        this.buildSpeed = stats.buildSpeed;
        this.gatherSpeed = stats.gatherSpeed;
        this.carryAmount = stats.carryAmount;
        this.baseSpeed = stats.moveSpeed;
        this.moveSpeed = this.setMoveSpeed(stats.moveSpeed);
        this.buildSpeed = stats.buildSpeed;
        this.attackSpeed = stats.attackSpeed;
        this.animDelay = stats.animDelay;
        this.spritePath = stats.spritePath;
        this.spriteSpecs = stats.spriteSpecs;
        this.isWorker = stats.isWorker;
        this.isUnit = stats.isUnit;
        this.Pathfinder = new _Export_1.Pathfinder(this);
    }
    initPack() {
        return {
            id: this.id,
            playerID: this.playerID,
            teamID: this.teamID,
            teamColor: this.teamColor,
            popCost: this.popCost,
            cellID: this.curCell.id,
            name: this.name,
            position: this.position,
            collider: this.collider,
            health: this.health,
            armor: this.armor,
            damages: this.damages,
            moveSpeed: this.baseSpeed,
            buildSpeed: this.buildSpeed,
            attackSpeed: this.attackSpeed,
            animDelay: this.animDelay,
            spritePath: this.spritePath,
            spriteSpecs: this.spriteSpecs,
            isUnit: this.isUnit,
            isWorker: this.isWorker,
        };
    }
    updatePack() {
        return {
            id: this.id,
            state: this.state,
            position: this.position,
            cellID: this.curCell.id,
            isVacant: this.curCell.isVacant,
            nodeNebName: this.nodeNebName,
            isGathering: this.isGathering,
            isGatherable: this.isGatherable,
            pathID: this.pathID,
        };
    }
    setMoveSpeed(moveSpeed) {
        const clientFPS = Number(process.env.CLIENT_FRAME_RATE);
        const serverFPS = Number(process.env.SERVER_FRAME_RATE);
        return moveSpeed * Math.floor(clientFPS / serverFPS);
    }
    hasArrivedTo(cell) {
        const { x: posX, y: posY } = this.position;
        const { x: cellX, y: cellY } = cell.center;
        if (posX === cellX
            && posY === cellY) {
            return true;
        }
        return false;
    }
    // =========================================================================================
    // Methods
    // =========================================================================================
    setState(newState) {
        let tempState = null;
        switch (newState) {
            case "die":
                tempState = 0;
                break;
            case "idle":
                tempState = 1;
                break;
            case "walk":
                tempState = 2;
                break;
            case "attack":
                tempState = 3;
                break;
            case "gather":
                tempState = 4;
                break;
        }
        if (tempState === null
            || tempState === this.state) {
            return;
        }
        this.state = tempState;
    }
    setCellState(battle) {
        this.oldCell = this.curCell;
        this.curCell = this.Pathfinder.path[0];
        const isPathCompromized = this.Pathfinder.path.some(cell => cell.isBlocked === true);
        if (isPathCompromized && !this.isPathReload) {
            this.Pathfinder.searchPath(battle.Grid.cellsList);
            this.hasUpdated = false;
            this.isPathReload = true;
        }
        this.Pathfinder.path.shift();
        this.Pathfinder.nextCell = this.Pathfinder.path[0] ?? null;
        this.oldCell.setVacant(this.id);
        this.curCell.setOccupied(this.id);
    }
    cancelWalking(nextCell) {
        this.position.x = nextCell.center.x;
        this.position.y = nextCell.center.y;
        this.isMoving = false;
        this.hasUpdated = false;
        this.hasArrived = true;
        this.hasReachNext = true;
    }
    cancelGathering() {
        clearInterval(this.gatherIntID);
        this.isGathering = false;
        this.gatherIntID = null;
    }
    gatherRessource(battle) {
        if (!this.isGatherable)
            return;
        if (!this.gatherSpeed || !this.carryAmount) {
            console.log({ gatherRessource: "No gatherSpeed or carryAmount stat !" });
            return;
        }
        const { Grid, playersList, nodesList } = battle;
        this.isGathering = true;
        this.gatherIntID = setInterval(() => {
            this.gatherAmount++;
            const node = nodesList.get(this.harvNodeID);
            const player = playersList.get(this.playerID);
            if (!node || !player)
                return;
            node.updateAmount();
            if (this.gatherAmount >= this.carryAmount) {
                this.isGathering = false;
                this.isGatherable = false;
                this.hasGathered = true;
                if (this.gatherIntID)
                    clearInterval(this.gatherIntID);
                if (this.dropOffCell
                    && this.oldHarvNodeID === this.harvNodeID) {
                    this.setTargetTo(this.dropOffCell, Grid.cellsList);
                }
                else
                    this.searchNearestWarehouse(player, Grid.cellsList);
            }
            ;
        }, this.gatherSpeed);
    }
    searchNearestWarehouse(player, cellsList) {
        let bottomNebList = [];
        let pathList = [];
        for (const [, { name, cellID }] of player.buildsID_List) {
            if (name !== "Warehouse")
                continue;
            const warehouseCell = cellsList.get(cellID);
            if (!warehouseCell)
                continue;
            for (const [nebName, neb] of Object.entries(warehouseCell.nebStatusList)) {
                if (nebName === "bottom")
                    bottomNebList.push(cellsList.get(neb.id));
            }
        }
        for (const cell of bottomNebList) {
            if (!cell)
                continue;
            this.Pathfinder.goalCell = cell;
            this.Pathfinder.searchPath(cellsList);
            if (!this.Pathfinder.hasPath)
                continue;
            pathList.push(this.Pathfinder.path);
        }
        const nearestPath = pathList.sort((a, b) => a.length - b.length)[0];
        const dropOffCell = nearestPath[nearestPath.length - 1];
        this.Pathfinder.path = nearestPath;
        if (this.dropOffCell !== dropOffCell)
            this.dropOffCell = dropOffCell;
        if (this.oldHarvNodeID !== this.harvNodeID)
            this.oldHarvNodeID = this.harvNodeID;
        this.setTargetTo(dropOffCell);
    }
    setTargetTo(targetCell, cellsList) {
        targetCell.isTargeted = true;
        this.Pathfinder.hasTarget = true;
        this.Pathfinder.goalCell = targetCell;
        if (cellsList)
            this.Pathfinder.searchPath(cellsList);
        this.hasArrived = false;
        this.hasUpdated = false;
    }
    dropAndReturn(battle, goalCell) {
        const { Grid, playersList, nodesList } = battle;
        if (!this.dropOffCell
            || !this.gatherCell
            || goalCell.id !== this.dropOffCell.id) {
            return;
        }
        this.setTargetTo(this.gatherCell, Grid.cellsList);
        this.isGatherable = true;
        const node = nodesList.get(this.harvNodeID);
        const player = playersList.get(this.playerID);
        if (!node || !player)
            return;
        player.updateYield(node.yieldType, this.gatherAmount);
        this.gatherAmount = 0;
    }
    walkPath(battle) {
        const { nextCell, goalCell, hasPath } = this.Pathfinder;
        if (!nextCell || !goalCell)
            return;
        if (this.isGathering && this.gatherIntID)
            this.cancelGathering();
        if (!hasPath)
            return this.cancelWalking(nextCell);
        this.moveTo(nextCell);
        if (!this.isMoving)
            this.isMoving = true;
        if (this.hasReachNext)
            this.hasReachNext = false;
        if (!this.hasArrivedTo(nextCell))
            return;
        this.setCellState(battle);
        if (!this.hasArrivedTo(goalCell))
            return;
        this.isMoving = false;
        this.hasArrived = true;
        this.Pathfinder.resetPath();
        if (!this.isWorker)
            return;
        this.gatherRessource(battle);
        this.dropAndReturn(battle, goalCell);
    }
    moveTo(nextCell) {
        const now = Date.now();
        const dt = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        const { x: posX, y: posY } = this.position;
        const { x: nextX, y: nextY } = nextCell.center;
        const deltaX = nextX - posX;
        const deltaY = nextY - posY;
        const dist = Math.hypot(deltaX, deltaY);
        if (dist === 0) {
            this.position.x = nextX;
            this.position.y = nextY;
            return;
        }
        const step = Math.round(this.moveSpeed + this.moveSpeed * dt);
        const moveX = deltaX / dist * Math.min(dist, step);
        const moveY = deltaY / dist * Math.min(dist, step);
        this.position.x += moveX;
        this.position.y += moveY;
    }
    // =========================================================================================
    // Update (Every frame)
    // =========================================================================================
    update(battle) {
        if (this.hasArrived)
            return;
        this.walkPath(battle);
        if (this.hasArrived
            && !this.isMoving
            && !this.isGathering
            && !this.isAttacking)
            this.setState("idle");
        if (this.isGathering)
            this.setState("gather");
        // Skip sending pathID if already sent once (Not every tick)
        if (this.hasUpdated)
            return;
        this.hasUpdated = true;
        this.isPathReload = false;
        this.pathID = this.Pathfinder.path.map((cell) => cell.id);
        if (this.isMoving)
            this.setState("walk");
    }
}
exports.Agent = Agent;
