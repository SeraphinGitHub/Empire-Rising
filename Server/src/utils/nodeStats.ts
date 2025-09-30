

import {
   INumber
} from "./interfaces";

// ================================================================================================
// Common Stats
// ================================================================================================
const oreCol:  INumber = { offsetY: 0 , radius: 40 };
const treeCol: INumber = { offsetY: 0 , radius: 30 };


// ================================================================================================
// Node Stats
// ================================================================================================
export const NODE_STATS: {[key: string]: any} = {
   
   coal: {
      name:      "Coal Ore",
      amount:     15000,
      collider:   oreCol,
      type:       1, // ==> has to match with sprite order
   },
   
   gold: {
      name:      "Gold Ore",
      amount:     8000,
      collider:   oreCol,
      type:       2,
   },
   
   iron: {
      name:      "Iron Ore",
      amount:     12000,
      collider:   oreCol,
      type:       3,
   },
   
   stone: {
      name:      "Stone",
      amount:     20000,
      collider:   oreCol,
      type:       4,
   },
   
   tree_1: {
      name:      "Tree",
      amount:     850,
      collider:   treeCol,
      type:       5,
   },

   tree_2: {
      name:      "Tree",
      amount:     500,
      collider:   treeCol,
      type:       6,
   },

   tree_3: {
      name:      "Tree",
      amount:     600,
      collider:   treeCol,
      type:       7,
   },

   tree_4: {
      name:      "Tree",
      amount:     850,
      collider:   treeCol,
      type:       8,
   },

   tree_5: {
      name:      "Tree",
      amount:     500,
      collider:   treeCol,
      type:       9,
   },

   tree_6: {
      name:      "Tree",
      amount:     600,
      collider:   treeCol,
      type:       10,
   },

}