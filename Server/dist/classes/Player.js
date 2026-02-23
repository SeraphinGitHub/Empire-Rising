"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
// =====================================================================
// Player Class
// =====================================================================
class Player {
    socket;
    id;
    battleID;
    name;
    buildsID_List = new Map();
    teamID;
    teamColor;
    maxPop = 0;
    curPop = 0;
    yield = {
        food: 0,
        stone: 0,
        wood: 0,
        coal: 0,
        ironOre: 0,
        ironBar: 0,
        goldOre: 0,
        goldBar: 0,
    };
    constructor(params) {
        this.id = params.socket.id;
        this.socket = params.socket;
        this.battleID = params.battleID;
        this.name = params.name;
        this.teamColor = params.teamColor;
        this.teamID = params.teamID;
    }
    initPack() {
        return {
            name: this.name,
            teamID: this.teamID,
            teamColor: this.teamColor,
            yield: this.yield,
        };
    }
    watch(battle) {
        this.socket.on("recruitUnit", (data) => this.recruitUnit(data, battle));
        this.socket.on("placeBuilding", (data) => this.placeBuilding(data, battle));
        this.socket.on("placeWall", (data) => this.placeWall(data, battle));
        this.socket.on("startAgentPF", (data) => battle.startAgentPF(data));
    }
    // =========================================================================================
    // Methods
    // =========================================================================================
    initBattle(gridPack, battlePack) {
        for (const { id, name, teamID, cellID } of battlePack.buildsList) {
            if (teamID === this.teamID)
                this.buildsID_List.set(id, { name, cellID });
        }
        this.socket.emit("initBattle", {
            gridPack,
            battlePack,
            playerPack: this.initPack(),
        });
    }
    updatePop(popCost) {
        this.curPop += popCost;
        this.socket.emit("updatePop", this.curPop);
    }
    recruitUnit(data, battle) {
        const { popCost, initPack } = battle.createNewAgent(data, this.id);
        this.updatePop(popCost);
        battle.spread("recruitUnit", initPack);
    }
    placeBuilding(data, battle) {
        const { ghostZone } = data;
        const hasBlocked = ghostZone.some((cellID) => {
            const cell = battle.getCell(cellID);
            return !cell || cell.isBlocked;
        });
        if (hasBlocked)
            return;
        const result = battle.createNewBuilding(data, this.id);
        if (!result)
            return;
        battle.spread("placeBuilding", result.initPack);
        battle.spread("updateCells", {
            cellsIDlist: result.footPrint,
            property: "isBlocked",
            state: true,
        });
    }
    placeWall(data, battle) {
        const { wallsListID } = data;
        for (const cellID of wallsListID) {
            const cell = battle.getCell(cellID);
            if (cell?.isBlocked)
                continue;
            const result = battle.createNewBuilding({ buildType: "wall", cellID }, this.id);
            if (!result)
                return;
            battle.spread("placeBuilding", result.initPack);
            battle.spread("updateCells", {
                cellsIDlist: result.footPrint,
                property: "isBlocked",
                state: true,
            });
        }
    }
    updateYield(yieldType, amount) {
        switch (yieldType) {
            case 1:
                this.yield.food += amount;
                break;
            case 2:
                this.yield.stone += amount;
                break;
            case 3:
                this.yield.wood += amount;
                break;
            case 4:
                this.yield.coal += amount;
                break;
            case 5:
                this.yield.ironOre += amount;
                break;
            case 6:
                this.yield.ironBar += amount;
                break;
            case 7:
                this.yield.goldOre += amount;
                break;
            case 8:
                this.yield.goldBar += amount;
                break;
        }
        this.socket.emit("updateYield", this.yield);
    }
}
exports.Player = Player;
