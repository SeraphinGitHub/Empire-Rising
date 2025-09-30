

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
      type:       1,
      color:      "",
   },

   barrack: {
      name:      "Barrack",
      health:     18000,
      collider:   { offsetY: 0, radius: 20 },
      buildTime:  45, // seconds
      type:       1,
      color:      "",
   },

   farm: {
      name:      "Farm",
      health:     9000,
      collider:   { offsetY: 0, radius: 20 },
      buildTime:  35, // seconds
      type:       1,
      color:      "",
   },

   wall: {
      name:      "Wall",
      health:     15000,
      collider:   { offsetY: 0, radius: 30 },
      buildTime:  20, // seconds
      type:       1,
      color:      "",
   },

}