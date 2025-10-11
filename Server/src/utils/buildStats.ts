

// ================================================================================================
// Common Stats
// ================================================================================================



// ================================================================================================
// Buildings Stats
// ================================================================================================
export const BUILD_STATS: {[key: string]: any} = {
   
   castle: {
      name:      "Castle",
      health:     30000,
      collider:   { offsetY: 0, radius: 20 },
      buildTime:  120, // seconds
      spriteID:   1,
      spritePath: "",
   },

   warehouse: {
      name:      "Warehouse",
      health:     12000,
      collider:   { offsetY: 0, radius: 20 },
      buildTime:  30, // seconds
      spriteID:   1,
      spritePath: "Buildings/Warehouse/",
   },

   barrack: {
      name:      "Barrack",
      health:     15000,
      collider:   { offsetY: 0, radius: 20 },
      buildTime:  45, // seconds
      spriteID:   1,
      spritePath: "",
   },

   farm: {
      name:      "Farm",
      health:     9000,
      collider:   { offsetY: 0, radius: 20 },
      buildTime:  35, // seconds
      spriteID:   1,
      spritePath: "",
   },

   wall: {
      name:      "Wall",
      health:     20000,
      collider:   { offsetY: 0, radius: 30 },
      buildTime:  20, // seconds
      spriteID:   1,
      spritePath: "Buildings/Wall/",
   },

}