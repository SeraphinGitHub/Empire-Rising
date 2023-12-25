
"use strict"

// ================================================================================================
// thisbal Variables
// ================================================================================================
module.exports = {

   Debug: {
      showWallCol: false,
      showCellInfo: true,
      hoverColor: "blue",
   },
   
   GridParams: {
      cellSize: 80,
      height: 960,
      width: 960,
      isEuclidean: true,
   },

   SelectArea: {

      oldPos: {
         cartesian: undefined,
         isometric: undefined,
      },

      currentPos: {
         cartesian: undefined,
         isometric: undefined,
      },

      height: undefined,
      width:  undefined,

      borderColor:   "dodgerblue",
      filledColor:   "rgba(30, 144, 255, 0.3)",
      lineWidth:     2,
      isSelecting : false,
   },

   faction: "Orange",
   

   // --- Constants ---
   Cos_45deg:  0.707,
   Cos_30deg:  0.866,
   DOM:        undefined,
   Viewport:   undefined,
   CanvasObj:  undefined,
   Ctx:        undefined,
   Grid:       undefined,


   // --- Positions ---
   IsoGridPos: undefined,
   HoverCell:  undefined,
   
   ScrollOffset: { // <== Tempory
      x: 0,
      y: 0,
   },
   

   // --- Lists ---
   AvailableIDArray:  [],
   AgentsList:        {},
   OldSelectList:     {},
   CurrentSelectList: {},


   // --- Ints ---
   CursorSize: 50,
   MouseSpeed: 3,
   MaxPop:    2000,
   CurrentPop: 0,


   // --- TEST ---
   TestViewport: {
      x: 200,
      y: 180,
      width:  900, // *0.5 => x
      height: 600, // *0.5 => y
   },

   ViewportSqr: undefined,

}