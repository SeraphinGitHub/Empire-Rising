

// ================================================================================================
// Common Stats
// ================================================================================================



// ================================================================================================
// Buildings Stats
// ================================================================================================
export const BUILD_STATS: {[key: string]: any} = {
   
   castle: {
      name:         "Castle",
      baseHealth:    30000,
      offset:        { x: 195, y: 365 },
      collider:      { offsetY: 0, radius: 20 },
      buildTime:     120, // seconds
      buildSize:     8,   // occupying cells "buildSize x buildSize"
      spriteID:      1,
      spriteRatio:   0.84,
      spriteSize:    480, // pixels
      spritePath:   "Buildings/Castle/",
   },

   warehouse: {
      name:         "Warehouse",
      baseHealth:    12000,
      offset:        { x: 75, y: 135 },
      collider:      { offsetY: 0, radius: 20 },
      buildTime:     30,  // seconds
      buildSize:     2,   // occupying cells "buildSize x buildSize"
      spriteID:      1,
      spriteRatio:   0.8,
      spriteSize:    190, // pixels
      spritePath:   "Buildings/Warehouse/",
   },

   barrack: {
      name:         "Barrack",
      baseHealth:    15000,
      offset:        { x: 145, y: 278 },
      collider:      { offsetY: 0, radius: 20 },
      buildTime:     45,  // seconds
      buildSize:     5,   // occupying cells "buildSize x buildSize"
      spriteID:      1,
      spriteRatio:   0.87,
      spriteSize:    340, // pixels
      spritePath:   "Buildings/Barrack/",
   },

   farm: {
      name:         "Farm",
      baseHealth:    9000,
      offset:        { x: 0, y: 0 },
      collider:      { offsetY: 0, radius: 20 },
      buildTime:     35, // seconds
      buildSize:     0,  // occupying cells "buildSize x buildSize"
      spriteID:      1,
      spriteRatio:   1,
      spriteSize:    0,  // pixels
      spritePath:   "Buildings/Farm/",
   },

   wall: {
      name:         "Wall",
      baseHealth:    20000,
      offset:        { x: 51, y: 86 },
      collider:      { offsetY: -10, radius: 20 },
      buildTime:     20,  // seconds
      buildSize:     1,   // occupying cells "buildSize x buildSize"
      spriteID:      1,
      spriteRatio:   0.37,
      spriteSize:    280, // pixels
      spritePath:   "Buildings/Wall/",
   },

}