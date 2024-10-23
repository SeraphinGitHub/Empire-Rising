

// ================================================================================================
// Common Stats
// ================================================================================================
const INFANTRY = {
   popCost:  1,
   collider: { offsetY: -15, radius: 15 },
}

const CAVALRY = {
   popCost: 2,
   collider: { offsetY: 0,   radius: 20 },
}

const MACHINERY = {
   popCost: 3,
   collider: { offsetY: 0,   radius: 30 },
}


// ================================================================================================
// Unit Stats
// ================================================================================================
export const UNIT_STATS: {[key: string]: any} = {

   // ===========================================
   // Infantry
   // ===========================================
   _0100: {
      name:         "Worker",
      popCost:       INFANTRY.popCost,
      collider:      INFANTRY.collider,
      health:        200,
      armor:         0,
      damages:       15,
      moveSpeed:     4,
      buildSpeed:    10,
      attackSpeed:   7,
      animDelay:     0.5,
      basePath:     "Infantry/Worker/",
   },

   _0101: {
      name:         "Swordsman",
      popCost:       INFANTRY.popCost,
      collider:      INFANTRY.collider,
      health:        500,
      armor:         200,
      damages:       40,
      moveSpeed:     3,
      buildSpeed:    0,
      attackSpeed:   12,
      animDelay:     0.5,
      basePath:     "Infantry/Swordsman/",
   },
   
   _0102: {
      name:         "Archer",
      popCost:       INFANTRY.popCost,
      collider:      INFANTRY.collider,
      health:        300,
      armor:         80,
      damages:       60,
      moveSpeed:     4,
      buildSpeed:    0,
      attackSpeed:   14,
      animDelay:     0.5,
      basePath:     "Infantry/Archer/",
   },
   
   _0103: {
      name:         "Spearman",
      popCost:       INFANTRY.popCost,
      collider:      INFANTRY.collider,
      health:        400,
      armor:         120,
      damages:       50,
      moveSpeed:     3,
      buildSpeed:    0,
      attackSpeed:   10,
      animDelay:     0.5,
      basePath:     "Infantry/Spearman/",
   },

   
   // ===========================================
   // Cavalry
   // ===========================================
   _0201: {
      name:         "Mounted Swordsman",
      popCost:       CAVALRY.popCost,
      collider:      CAVALRY.collider,
      health:        700,
      armor:         300,
      damages:       50,
      moveSpeed:     6,
      buildSpeed:    0,
      attackSpeed:   12,
      animDelay:     0.5,
      basePath:     "Cavalry/Swordsman/",
   },

   _0202: {
      name:         "Mounted Archer",
      popCost:       CAVALRY.popCost,
      collider:      CAVALRY.collider,
      health:        500,
      armor:         130,
      damages:       70,
      moveSpeed:     7,
      buildSpeed:    0,
      attackSpeed:   14,
      animDelay:     0.5,
      basePath:     "Cavalry/Archer/",
   },


   // ===========================================
   // Machinery
   // ===========================================
   _0301: {
      name:         "Ballista",
      popCost:       MACHINERY.popCost,
      collider:      MACHINERY.collider,
      health:        1200,
      armor:         500,
      damages:       200,
      moveSpeed:     2,
      buildSpeed:    0,
      attackSpeed:   8,
      animDelay:     0.5,
      basePath:     "Machinery/Ballista/",
   },

   _0302: {
      name:         "Catapult",
      popCost:       MACHINERY.popCost,
      collider:      MACHINERY.collider,
      health:        2000,
      armor:         700,
      damages:       160,
      moveSpeed:     1,
      buildSpeed:    0,
      attackSpeed:   10,
      animDelay:     0.5,
      basePath:     "Machinery/Catapult/",
   },

}