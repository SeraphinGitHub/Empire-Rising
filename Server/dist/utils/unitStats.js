"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNIT_STATS = void 0;
// ================================================================================================
// Common Stats
// ================================================================================================
const INFANTRY = {
    popCost: 1,
    isUnit: true,
    collider: { offsetY: 15, radius: 15 },
};
const CAVALRY = {
    popCost: 2,
    isUnit: true,
    collider: { offsetY: 0, radius: 20 },
};
const MACHINERY = {
    popCost: 3,
    collider: { offsetY: 0, radius: 30 },
};
// ================================================================================================
// Unit Stats
// ================================================================================================
exports.UNIT_STATS = {
    // ===========================================
    // Infantry
    // ===========================================
    worker: {
        name: "Worker",
        popCost: INFANTRY.popCost,
        collider: INFANTRY.collider,
        isUnit: INFANTRY.isUnit,
        isWorker: true,
        health: 200,
        armor: 0,
        damages: 15,
        moveSpeed: 3,
        buildSpeed: 10,
        gatherSpeed: 1500, // ms
        carryAmount: 4,
        // carryAmount:   20,
        attackSpeed: 7,
        animDelay: 0.5,
        spritePath: "Units/Worker/",
        spriteSpecs: {
            die: { srcY: 0, size: 64, index: 6, spriteNum: 5 },
            idle: { srcY: 64, size: 64, index: 20, spriteNum: 2 },
            walk: { srcY: 320, size: 64, index: 6, spriteNum: 8 },
            // attack: { srcY: 576,  size: 192,  index: 6,   spriteNum: 5 },
            gather: { srcY: 576, size: 192, index: 6, spriteNum: 4 },
        },
    },
    knight: {
        name: "Knight",
        popCost: INFANTRY.popCost,
        collider: INFANTRY.collider,
        isUnit: INFANTRY.isUnit,
        health: 650,
        armor: 400,
        damages: 55,
        moveSpeed: 3,
        attackSpeed: 16,
        animDelay: 0.7,
        spritePath: "Units/Knight/",
        spriteSpecs: {
            die: { srcY: 0, size: 64, index: 6, spriteNum: 5 },
            idle: { srcY: 64, size: 64, index: 20, spriteNum: 2 },
            walk: { srcY: 320, size: 64, index: 6, spriteNum: 8 },
            attack: { srcY: 576, size: 192, index: 6, spriteNum: 5 },
        },
    },
    barbarian: {
        name: "Barbarian",
        popCost: INFANTRY.popCost,
        collider: INFANTRY.collider,
        isUnit: INFANTRY.isUnit,
        health: 400,
        armor: 120,
        damages: 50,
        moveSpeed: 3,
        attackSpeed: 10,
        animDelay: 0.5,
        spritePath: "Units/Barbarian/",
        spriteSpecs: {
            die: { srcY: 0, size: 64, index: 6, spriteNum: 5 },
            idle: { srcY: 64, size: 64, index: 20, spriteNum: 2 },
            walk: { srcY: 320, size: 64, index: 6, spriteNum: 8 },
            attack: { srcY: 576, size: 192, index: 6, spriteNum: 5 },
        },
    },
    swordsman: {
        name: "Swordsman",
        popCost: INFANTRY.popCost,
        collider: INFANTRY.collider,
        isUnit: INFANTRY.isUnit,
        health: 500,
        armor: 200,
        damages: 40,
        moveSpeed: 3,
        attackSpeed: 12,
        animDelay: 0.5,
        spritePath: "Units/Swordsman/",
        spriteSpecs: {
            die: { srcY: 0, size: 192, index: 6, spriteNum: 5 },
            idle: { srcY: 192, size: 192, index: 20, spriteNum: 2 },
            walk: { srcY: 960, size: 192, index: 6, spriteNum: 8 },
            attack: { srcY: 1728, size: 192, index: 6, spriteNum: 5 },
        },
    },
    spearman: {
        name: "Spearman",
        popCost: INFANTRY.popCost,
        collider: INFANTRY.collider,
        isUnit: INFANTRY.isUnit,
        health: 400,
        armor: 120,
        damages: 50,
        moveSpeed: 3,
        attackSpeed: 10,
        animDelay: 0.5,
        spritePath: "Units/Spearman/",
        spriteSpecs: {
            die: { srcY: 0, size: 192, index: 6, spriteNum: 5 },
            idle: { srcY: 192, size: 192, index: 20, spriteNum: 2 },
            walk: { srcY: 960, size: 192, index: 6, spriteNum: 8 },
            attack: { srcY: 1728, size: 192, index: 6, spriteNum: 5 },
        },
    },
    archer: {
        name: "Archer",
        popCost: INFANTRY.popCost,
        collider: INFANTRY.collider,
        isUnit: INFANTRY.isUnit,
        health: 300,
        armor: 80,
        damages: 60,
        moveSpeed: 4,
        attackSpeed: 14,
        animDelay: 0.5,
        spritePath: "Units/Archer/",
        spriteSpecs: {},
    },
    // ===========================================
    // Cavalry
    // ===========================================
    m_swordsman: {
        name: "Mounted Swordsman",
        popCost: CAVALRY.popCost,
        collider: CAVALRY.collider,
        isUnit: CAVALRY.isUnit,
        health: 700,
        armor: 300,
        damages: 50,
        moveSpeed: 6,
        attackSpeed: 12,
        animDelay: 0.5,
        spritePath: "Cavalry/Swordsman/",
        spriteSpecs: {},
    },
    m_archer: {
        name: "Mounted Archer",
        popCost: CAVALRY.popCost,
        collider: CAVALRY.collider,
        isUnit: CAVALRY.isUnit,
        health: 500,
        armor: 130,
        damages: 70,
        moveSpeed: 7,
        attackSpeed: 14,
        animDelay: 0.5,
        spritePath: "Cavalry/Archer/",
        spriteSpecs: {},
    },
    // ===========================================
    // Machinery
    // ===========================================
    ballista: {
        name: "Ballista",
        popCost: MACHINERY.popCost,
        collider: MACHINERY.collider,
        health: 1200,
        armor: 500,
        damages: 200,
        moveSpeed: 2,
        attackSpeed: 8,
        animDelay: 0.5,
        spritePath: "Machinery/Ballista/",
        spriteSpecs: {},
    },
    catapult: {
        name: "Catapult",
        popCost: MACHINERY.popCost,
        collider: MACHINERY.collider,
        health: 2000,
        armor: 700,
        damages: 160,
        moveSpeed: 1,
        attackSpeed: 10,
        animDelay: 0.5,
        spritePath: "Machinery/Catapult/",
        spriteSpecs: {},
    },
};
