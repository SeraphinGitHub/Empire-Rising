
"use strict"

const glo = require("./globalVar.js");
const ext = require("./extendedMethods.js");

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
            canvas.width  = glo.Grid.gridSize;
            canvas.height = glo.Grid.gridSize;
         }
         else {
            canvas.width  = glo.Viewport.width;
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
      const cellSize            = glo.GridParams.cellSize;
      const half_GridWidth      = glo.GridParams.gridSize *0.5;
      const diagonalOffset      = half_GridWidth *2 *Cos_45;
      const half_ViewportWidth  = glo.Viewport.width  *0.5;
      const half_ViewportHeight = glo.Viewport.height *0.5;

      glo.GridAngle       = half_GridWidth -(cellSize *Cos_45 *Cos_30);
      glo.ViewportOffsetX = half_ViewportWidth  -diagonalOffset;
      glo.ViewportOffsetY = half_ViewportHeight -diagonalOffset /2 +(Cos_30 *cellSize /2);
   },


   // Peripherals Inputs
   peripherals_Input() {

      window.addEventListener("keydown",   (event) => this.keyboard_Input(event));
      window.addEventListener("mousemove", (event) => this.mouse_Move    (event));
      window.addEventListener("mousedown", (event) => this.mouse_Input   (event, "Down"));
      window.addEventListener("mouseup",   (event) => this.mouse_Input   (event, "Up"  ));
   },

   keyboard_Input(event) {

      switch(event.key) {

         case "Enter": {
            ext.cycleList(glo.AgentsList, (agent) => {
               
               ext.Test_PathRandomize(agent);
               const intervalID = setInterval(() => ext.Test_PathRandomize(agent), 3000);
               randPathIntervals.push(intervalID);
            });
         } break;

         case "Backspace": {
            randPathIntervals.forEach((intervalID) => clearInterval(intervalID));
         } break;
      }
   },

   mouse_Move(event) {
      
      glo.SelectArea.currentPos = ext.getScreenPos(event);
      glo.IsoGridPos = ext.screenPos_toGridPos(glo.SelectArea.currentPos.isometric);
      
      if(ext.isWithinGrid(glo.IsoGridPos)) {
         glo.HoverCell = ext.getHoverCell();
      }

      ext.unitSelection();
   },

   mouse_Input(event, state) {

      if(state === "Down") glo.SelectArea.oldPos = ext.getScreenPos(event);

      switch(event.which) {

         // Left click
         case 1: {

            if(state === "Down") { 
               glo.SelectArea.isSelecting = true;
            }
            
            if(state === "Up") {
               glo.SelectArea.isSelecting = false;
               ext.unitDiselection();
            }
            
         } break;


         // Scroll click
         case 2: {

            if(state === "Down") {

            }
         
            if(state === "Up") {

            }

         } break;


         // Right click
         case 3: {

            if(state === "Down") {
               if(ext.isWithinGrid(glo.IsoGridPos)) {
                  ext.cycleList(glo.OldSelectList, (agent) => {
                     
                     const goalCell = glo.Grid.cellsList[glo.HoverCell.id];

                     if(goalCell.isBlocked || !goalCell.isVacant) return;
                     
                     agent.goalCell = goalCell;
                     agent.searchPath();
                  });
               }
            }
         
            if(state === "Up") {

            }

         } break;
      }
   },

}