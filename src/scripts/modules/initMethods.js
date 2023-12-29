
"use strict"

const glo = require("./globalVar.js");

// ================================================================================================
// Initialization Methods
// ================================================================================================
module.exports = {
   
   setDOM(document) {
      return {
         message: document.querySelector(".debug-message p"),
         cartX:   document.querySelector(".coordinates .cartX"),
         cartY:   document.querySelector(".coordinates .cartY"),
         isoX:    document.querySelector(".coordinates .isoX"),
         isoY:    document.querySelector(".coordinates .isoY"),
         cellX:   document.querySelector(".coordinates .cellX"),
         cellY:   document.querySelector(".coordinates .cellY"),
         cellID:  document.querySelector(".coordinates .ID-cell"),
      };
   },
   
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
         viewport_1080p.width = laptop_17pcs.width;
      }
   
      else if(document.body.clientWidth <= laptop_15pcs.width) {
         viewport_1080p.height = laptop_15pcs.height;
         viewport_1080p.width = laptop_15pcs.width;
      }
   
      return viewport_1080p;
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
   
      return canvasObj;
   },
   
   setCtx(canvasObj) {
      const ctx = {};
   
      Object.entries(canvasObj).forEach(pair => {
         let key = pair[0];
         let value = pair[1];
         ctx[key] = value.getContext("2d");
      });
   
      return ctx;
   },
   
   setAvailableID() {
   
      for(let i = 0; i < glo.MaxPop; i++) {
         glo.AvailableIDArray.push(i +1);
      }
   },
   
   // --- Tempory ---
   setViewportSqr() {
      return {
         x: (glo.CanvasObj.selection.width  -glo.TestViewport.width ) *0.5,
         y: (glo.CanvasObj.selection.height -glo.TestViewport.height) *0.5,
         width:  glo.TestViewport.width,
         height: glo.TestViewport.height,
      };
   }
}