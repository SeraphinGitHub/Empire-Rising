"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
// =====================================================================
// Building Class
// =====================================================================
class Building {
    id;
    teamColor;
    name;
    cellID;
    spritePath;
    position;
    offset;
    collider;
    selectRing;
    footPrint;
    spriteID;
    teamID;
    buildTime;
    buildSize;
    spriteRatio;
    spriteSize;
    health;
    baseHealth;
    isBuilding = true;
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.cellID = params.cellID;
        this.position = params.position;
        this.offset = params.offset;
        this.collider = params.collider;
        this.selectRing = params.selectRing;
        this.footPrint = params.footPrint;
        this.spriteID = params.spriteID;
        this.teamID = params.teamID;
        this.buildTime = params.buildTime;
        this.buildSize = params.buildSize;
        this.spriteRatio = params.spriteRatio;
        this.spriteSize = params.spriteSize;
        this.health = params.baseHealth;
        this.baseHealth = params.baseHealth;
        this.teamColor = params.teamColor;
        this.spritePath = params.spritePath;
    }
    initPack() {
        return {
            id: this.id,
            name: this.name,
            cellID: this.cellID,
            position: this.position,
            offset: this.offset,
            collider: this.collider,
            selectRing: this.selectRing,
            footPrint: this.footPrint,
            spriteID: this.spriteID,
            teamID: this.teamID,
            buildTime: this.buildTime,
            buildSize: this.buildSize,
            spriteRatio: this.spriteRatio,
            spriteSize: this.spriteSize,
            health: this.health,
            baseHealth: this.baseHealth,
            teamColor: this.teamColor,
            spritePath: this.spritePath,
        };
    }
}
exports.Building = Building;
