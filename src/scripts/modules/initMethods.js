
"use strict"

const glo = require("./globalVar.js");

// ================================================================================================
// Initialization Methods
// ================================================================================================
module.exports = {
   
   setViewport(document) {
   
      const viewport_1080p = {
         x: 0,
         y: 0,
         height: 1080,
         width: 1920,
      };
   
      const laptop_17pcs = {
         height: 900,
         width: 1600,
      };
   
      const laptop_15pcs = {
         height: 768,
         width: 1366,
      };
   
      if(document.body.clientWidth <= laptop_17pcs.width
      && document.body.clientWidth > laptop_15pcs.width) {
         viewport_1080p.height = laptop_17pcs.height;
         viewport_1080p.width  = laptop_17pcs.width;
      }
   
      else if(document.body.clientWidth <= laptop_15pcs.width) {
         viewport_1080p.height = laptop_15pcs.height;
         viewport_1080p.width  = laptop_15pcs.width;
      }
   
      glo.Viewport = viewport_1080p;
   },
   
   setCanvas(document) {
   
      const canvasObj = {
         isoSelect: document.querySelector(".canvas-isoSelect"),
         terrain:   document.querySelector(".canvas-terrain"),
         buildings: document.querySelector(".canvas-buildings"),
         units:     document.querySelector(".canvas-units"),
         selection: document.querySelector(".canvas-selection"),
      };
   
      // Set canvas sizes
      Object.values(canvasObj).forEach(canvas => {
   
         if(canvas === canvasObj.isoSelect) {
            canvas.width = glo.Grid.width;
            canvas.height = glo.Grid.height;
         }
         else {
            canvas.width = glo.Viewport.width;
            canvas.height = glo.Viewport.height;
         }
      });
   
      glo.CanvasObj = canvasObj;
   },
   
   setCtx(canvasObj) {
      const ctx = {};
   
      Object.entries(canvasObj).forEach(pair => {
         let key = pair[0];
         let value = pair[1];
         ctx[key] = value.getContext("2d");
      });
   
      glo.Ctx = ctx;
   },
   
   setAvailableID() {
   
      for(let i = 0; i < glo.MaxPop; i++) {
         glo.AvailableIDArray.push(i +1);
      }
   },
   
   setViewportSqr() {

      glo.ViewportSqr = {
         x: (glo.CanvasObj.selection.width  -glo.TestViewport.width ) *0.5,
         y: (glo.CanvasObj.selection.height -glo.TestViewport.height) *0.5,
         width:  glo.TestViewport.width,
         height: glo.TestViewport.height,
      };
   },

   setPosConvert() {

      const Cos_45              = glo.Cos_45deg;
      const Cos_30              = glo.Cos_30deg;
      const cellSize            = glo.Grid.cellSize;
      const diagonalOffset      = (glo.Grid.height +glo.Grid.width) *Cos_45 *0.5;
      const half_GridWidth      = glo.Grid.width      *0.5;
      const half_ViewportWidth  = glo.Viewport.width  *0.5;
      const half_ViewportHeight = glo.Viewport.height *0.5;

      glo.GridAngle       = half_GridWidth -(cellSize *Cos_45 *Cos_30);
      glo.ViewportOffsetX = half_ViewportWidth  -diagonalOffset;
      glo.ViewportOffsetY = half_ViewportHeight -diagonalOffset /2 +(Cos_30 *cellSize /2);
   }
}