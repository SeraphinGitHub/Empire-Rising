

// ================================================================================================
// Common Stats
// ================================================================================================
const INFANTRY = {
   popCost:  1,
   isUnit:   true,
   collider: { offsetY: -15, radius: 15 },
}

const CAVALRY = {
   popCost: 2,
   isUnit:  true,
   collider: { offsetY: 0,   radius: 20 },
}

const MACHINERY = {
   popCost: 3,
   isUnit:  false,
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
      isUnit:        INFANTRY.isUnit,
      isWorker:      true,
      health:        200,
      armor:         0,
      damages:       15,
      moveSpeed:     3,

      buildSpeed:    10,
      gatherSpeed:   1500, // ms
      // carryAmount:   20,
      carryAmount:   5, // ==> for testing
      
      attackSpeed:   7,
      animDelay:     0.5,
      basePath:     "Infantry/Worker/",
   },

   _0101: {
      name:         "Swordsman",
      popCost:       INFANTRY.popCost,
      collider:      INFANTRY.collider,
      isUnit:        INFANTRY.isUnit,
      health:        500,
      armor:         200,
      damages:       40,
      moveSpeed:     3,
      attackSpeed:   12,
      animDelay:     0.5,
      basePath:     "Infantry/Swordsman/",
   },
   
   _0102: {
      name:         "Archer",
      popCost:       INFANTRY.popCost,
      collider:      INFANTRY.collider,
      isUnit:        INFANTRY.isUnit,
      health:        300,
      armor:         80,
      damages:       60,
      moveSpeed:     4,
      attackSpeed:   14,
      animDelay:     0.5,
      basePath:     "Infantry/Archer/",
   },
   
   _0103: {
      name:         "Spearman",
      popCost:       INFANTRY.popCost,
      collider:      INFANTRY.collider,
      isUnit:        INFANTRY.isUnit,
      health:        400,
      armor:         120,
      damages:       50,
      moveSpeed:     3,
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
      isUnit:        CAVALRY.isUnit,
      health:        700,
      armor:         300,
      damages:       50,
      moveSpeed:     6,
      attackSpeed:   12,
      animDelay:     0.5,
      basePath:     "Cavalry/Swordsman/",
   },

   _0202: {
      name:         "Mounted Archer",
      popCost:       CAVALRY.popCost,
      collider:      CAVALRY.collider,
      isUnit:        CAVALRY.isUnit,
      health:        500,
      armor:         130,
      damages:       70,
      moveSpeed:     7,
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
      isUnit:        MACHINERY.isUnit,
      health:        1200,
      armor:         500,
      damages:       200,
      moveSpeed:     2,
      attackSpeed:   8,
      animDelay:     0.5,
      basePath:     "Machinery/Ballista/",
   },

   _0302: {
      name:         "Catapult",
      popCost:       MACHINERY.popCost,
      collider:      MACHINERY.collider,
      isUnit:        MACHINERY.isUnit,
      health:        2000,
      armor:         700,
      damages:       160,
      moveSpeed:     1,
      attackSpeed:   10,
      animDelay:     0.5,
      basePath:     "Machinery/Catapult/",
   },

}