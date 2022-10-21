
"use strict"

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
      x: undefined,
      y: undefined,
      height: undefined,
      width:  undefined,
      borderColor:   "dodgerblue",
      filledColor:   "rgba(30, 144, 255, 0.3)",
      lineWidth:     2,
      isSelectArea : false,
   },

   Cos_45deg:  0.707,
   Cos_30deg:  0.866,

   DOM:        undefined,
   Viewport:   undefined,
   CanvasObj:  undefined,
   Ctx:        undefined,

   Grid:       undefined,
   AgentsList: {},
   Population: 0,
   
   cycleList(list, callback) {

      for(let i in list) {
         callback(list[i]);
      }
   },
}