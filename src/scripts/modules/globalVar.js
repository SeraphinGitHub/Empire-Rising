
"use strict"

// ================================================================================================
// Global Variables
// ================================================================================================
module.exports = {

   Debug: {
      showWallCol: false,
      hoverColor: "blue",
   },
   
   GridParams: {
      cellSize:  40,
      gridSize:  1440,
      cellRange: 0,
   },

   SelectArea: {
      oldPos: {
         cartesian: {
            x: 0,
            y: 0,
         },

         isometric: {
            x: 0,
            y: 0,
         },
      },

      currentPos: {
         cartesian: {
            x: 0,
            y: 0,
         },
         
         isometric: {
            x: 0,
            y: 0,
         },
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
   
   GridAngle:       undefined,
   ViewportOffsetX: undefined,
   ViewportOffsetY: undefined,
   


   // --- Positions ---
   IsoGridPos: {
      x: 0,
      y: 0,
   },

   HoverCell:  {
      id: "",

      gridPos: {
         x: 0,
         y: 0,
      },
   },
   
   ScrollOffset: {
      x: 0,
      y: 0,
   },
   

   // --- Lists ---
   AvailableIDArray:  [],
   AgentsList:        {},
   OldSelectList:     {},
   CurrentSelectList: {},


   // --- Ints ---
   MouseSpeed: 5,
   MaxPop:     2000,
   CurrentPop: 0,


   // --- TEST ---
   TestViewport: {
      x: 0,
      y: 0,
      width:  1000, // *0.5 => x
      height: 650,  // *0.5 => y
   },

   ViewportSqr:    undefined,
   ComputedCanvas: undefined,

}