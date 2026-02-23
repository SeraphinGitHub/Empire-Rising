"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
// =====================================================================
// Node Class
// =====================================================================
class Node {
    id;
    name;
    cellID;
    spritePath;
    position;
    collider;
    selectRing;
    footPrint;
    nodeSize;
    spriteID;
    yieldType;
    baseAmount;
    amount;
    isNode = true;
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.cellID = params.cellID;
        this.position = params.position;
        this.collider = params.collider;
        this.selectRing = params.selectRing;
        this.footPrint = params.footPrint;
        this.nodeSize = params.nodeSize;
        this.spriteID = params.spriteID;
        this.yieldType = params.yieldType;
        this.baseAmount = params.amount;
        this.amount = params.amount;
        this.spritePath = params.spritePath;
    }
    initPack() {
        return {
            id: this.id,
            name: this.name,
            cellID: this.cellID,
            position: this.position,
            collider: this.collider,
            selectRing: this.selectRing,
            footPrint: this.footPrint,
            nodeSize: this.nodeSize,
            spriteID: this.spriteID,
            amount: this.baseAmount,
            spritePath: this.spritePath,
        };
    }
    updateAmount() {
        this.amount--;
    }
}
exports.Node = Node;
