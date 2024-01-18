
"use strict"

import { GridClass } from "./classes/_Export";
import { glo       } from "./utils/_GlobalVar";
import { set_DOM   } from "./DOM_Params";
import { ext       } from "./extended";


// ================================================================================================
// Prevent context menu
// ================================================================================================
document.body.oncontextmenu = (event) => {
   event.preventDefault();
   event.stopPropagation();
}


let frame = 0;
let walls = [
   
   // Top
   "21-6",
   "22-6",
   "23-6",
   
   "24-7",
   "25-8",
   "26-9",
   "27-10",
   "27-11",
   "27-12",

   // Middle
   "12-12",
   "13-12",
   "14-12",
   "15-12",
   "16-12",
   "17-12",
   "18-12",
   "19-12",

   "20-13",
   "20-14",
   "20-15",
   "20-16",
   "20-17",

   "21-18",
   "22-18",
   "23-18",
   "24-18",
   "25-18",

   // Bottom
   "13-23",
   "12-23",
   "11-23",
   "10-23",
   "9-23",

   "14-17",
   "14-18",
   "14-19",
   "14-20",
   "14-21",
   "14-22",
   "14-23",
   "14-24",
   "14-25",
   "14-26",
   "14-27",
];

// ================================================================================================
// Animation
// ================================================================================================
const runAnimation = () => {

   frame++;

   ext.clearCanvas("isoSelect");
   // ext.clearCanvas("terrain");
   // ext.clearCanvas("buildings");
   ext.clearCanvas("units");

   
   ext.scrollCam();

   ext.drawUnits(frame);
   ext.drawBuildings();
   ext.drawSelection();
   ext.drawHover();   
   
   if(ext.isWithinGrid(glo.IsoGridPos)) ext.drawHoverCell();

   requestAnimationFrame(runAnimation);
}


// ================================================================================================
// Init Game Handler
// ================================================================================================
export const GameHandler = {

   init(document: Document) {

      glo.Grid = new GridClass(glo.GridParams);

      set_DOM.init(document);
      
      glo.ComputedCanvas = new DOMMatrix(window.getComputedStyle(glo.Canvas.isoSelect).transform);

      
      // --- Tempory ---
      walls.forEach(ID => glo.Grid!.cellsList[ID].isBlocked = true);
      
      ext.createNewAgent("infantry",  "swordsman", "7-16", "");
      ext.createNewAgent("infantry",  "swordsman", "7-19", "");
      ext.createNewAgent("infantry",  "swordsman", "10-16", "");
      ext.createNewAgent("infantry",  "swordsman", "10-19", "");

      // ext.createNewAgent("infantry",  "worker",    "5-3", "");
      // ext.createNewAgent("cavalry",   "swordsman", "9-2", "");
      // ext.createNewAgent("cavalry",   "bowman",    "2-6", "");
      // ext.createNewAgent("machinery", "ballista",  "8-5", "");
      // ext.createNewAgent("machinery", "catapult",  "6-9", "");
      
      // ext.Test_GenerateUnits();
      // --- Tempory ---
      

      runAnimation();
   },
}