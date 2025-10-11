

import {
   INumber
} from "./interfaces";

// ================================================================================================
// Common Stats
// ================================================================================================
const farmCol:  INumber = { offsetY: 0 , radius: 60 };
const oreCol:   INumber = { offsetY: 0 , radius: 40 };
const treeCol:  INumber = { offsetY: 0 , radius: 30 };
const oresPath: string  = "Ressources/nodes";


// ================================================================================================
// Node Stats
// ================================================================================================
export const NODE_STATS: {[key: string]: any} = {
   food: {
      name:      "Wheat Field",
      amount:     4000,
      collider:   farmCol,
      yieldType:  1,
      spriteID:   1,
      spritePath: oresPath,
   },

   stone: {
      name:      "Stone",
      amount:     20000,
      collider:   oreCol,
      yieldType:  2,
      spriteID:   4,
      spritePath: oresPath,
   },

   coal: {
      name:      "Coal Ore",
      amount:     15000,
      collider:   oreCol,
      yieldType:  4,
      spriteID:   1, // ==> has to match with sprite order
      spritePath: oresPath,
   },
   
   iron: {
      name:      "Iron Ore",
      amount:     12000,
      collider:   oreCol,
      yieldType:  5,
      spriteID:   3,
      spritePath: oresPath,
   },
   
   gold: {
      name:      "Gold Ore",
      amount:     8000,
      collider:   oreCol,
      yieldType:  7,
      spriteID:   2,
      spritePath: oresPath,
   },
   
   tree_1: {
      name:      "Tree",
      amount:     850,
      collider:   treeCol,
      yieldType:  3,
      spriteID:   5,
      spritePath: oresPath,
   },

   tree_2: {
      name:      "Tree",
      amount:     500,
      collider:   treeCol,
      yieldType:  3,
      spriteID:   6,
      spritePath: oresPath,
   },

   tree_3: {
      name:      "Tree",
      amount:     600,
      collider:   treeCol,
      yieldType:  3,
      spriteID:   7,
      spritePath: oresPath,
   },

   tree_4: {
      name:      "Tree",
      amount:     850,
      collider:   treeCol,
      yieldType:  3,
      spriteID:   8,
      spritePath: oresPath,
   },

   tree_5: {
      name:      "Tree",
      amount:     500,
      collider:   treeCol,
      yieldType:  3,
      spriteID:   9,
      spritePath: oresPath,
   },

   tree_6: {
      name:      "Tree",
      amount:     600,
      collider:   treeCol,
      yieldType:  3,
      spriteID:   10,
      spritePath: oresPath,
   },

}