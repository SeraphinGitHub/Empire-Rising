

import {
   INumber
} from "./interfaces";

// ================================================================================================
// Common Stats
// ================================================================================================
const oresPath: string  = "Ressources/nodes";
const farmCol:  INumber = { offsetY: 0,  radius:  60 };

const oresSize: number  = 2;
const oreCol:   INumber = { offsetY: 25, radius:  30 };
const oreRing:  INumber = { offsetX: 54, offsetY: 65, size: 110 };

const treeSize: number  = 1;
const treeCol:  INumber = { offsetY:  5, radius:  15 };
const treeRing: INumber = { offsetX: 35, offsetY: 35, size: 70 };


// ================================================================================================
// Node Stats
// ================================================================================================
export const NODE_STATS: {[key: string]: any} = {
   food: {
      name:      "Wheat Field",
      amount:     4000,
      collider:   farmCol,
      nodeSize:   oresSize,
      yieldType:  1,
      spriteID:   1,  // ==> has to match with sprite order
      spritePath: oresPath,
      selectRing: oreRing,
   },

   stone: {
      name:      "Stone",
      amount:     20000,
      collider:   oreCol,
      nodeSize:   oresSize,
      yieldType:  2,
      spriteID:   4,
      spritePath: oresPath,
      selectRing: oreRing,
   },

   coal: {
      name:      "Coal Ore",
      amount:     15000,
      collider:   oreCol,
      nodeSize:   oresSize,
      yieldType:  4,
      spriteID:   1,
      spritePath: oresPath,
      selectRing: oreRing,
   },
   
   iron: {
      name:      "Iron Ore",
      amount:     12000,
      collider:   oreCol,
      nodeSize:   oresSize,
      yieldType:  5,
      spriteID:   3,
      spritePath: oresPath,
      selectRing: oreRing,
   },
   
   gold: {
      name:      "Gold Ore",
      amount:     8000,
      collider:   oreCol,
      nodeSize:   oresSize,
      yieldType:  7,
      spriteID:   2,
      spritePath: oresPath,
      selectRing: oreRing,
   },
   
   tree_1: {
      name:      "Tree",
      amount:     850,
      collider:   treeCol,
      nodeSize:   treeSize,
      yieldType:  3,
      spriteID:   5,
      spritePath: oresPath,
      selectRing: treeRing,
   },

   tree_2: {
      name:      "Tree",
      amount:     500,
      collider:   treeCol,
      nodeSize:   treeSize,
      yieldType:  3,
      spriteID:   6,
      spritePath: oresPath,
      selectRing: treeRing,
   },

   tree_3: {
      name:      "Tree",
      amount:     600,
      collider:   treeCol,
      nodeSize:   treeSize,
      yieldType:  3,
      spriteID:   7,
      spritePath: oresPath,
      selectRing: treeRing,
   },

   tree_4: {
      name:      "Tree",
      amount:     850,
      collider:   treeCol,
      nodeSize:   treeSize,
      yieldType:  3,
      spriteID:   8,
      spritePath: oresPath,
      selectRing: treeRing,
   },

   tree_5: {
      name:      "Tree",
      amount:     500,
      collider:   treeCol,
      nodeSize:   treeSize,
      yieldType:  3,
      spriteID:   9,
      spritePath: oresPath,
      selectRing: treeRing,
   },

   tree_6: {
      name:      "Tree",
      amount:     600,
      collider:   treeCol,
      nodeSize:   treeSize,
      yieldType:  3,
      spriteID:   10,
      spritePath: oresPath,
      selectRing: treeRing,
   },

}