
"use strict"

import {
   ISize,
   ISquare,
   IPosition,
} from "./utils/interfaces";

import {
   Grid,
   Cell,
   Agent,
} from "./classes/_Export";

import { glo        } from "./utils/_GlobalVar";
import { Collision  } from "./modules/collision";
import { unitParams } from "./utils/unitParams";


let frame = 0;


const walls: string[] = [
   "9-21",
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
   "20-12",

   "20-13",
   "20-14",
   "20-15",
   "20-16",
   "20-17",
   "20-18",

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

   "14-13",
   "14-14",
   "14-18",
   "14-19",
   "14-20",
   "14-21",
   "14-22",
   "14-23",
   "14-24",
   "14-25",
   "14-26",

   "15-27",
   "16-26",
   "17-25",
   "18-24",
   "19-23",
   "20-22",
];

const tiles: string[] = [
   "6-9",
   "6-10",
   "7-9",
   "7-8",
   "6-8",
   "5-9",
   "5-8",
   "5-10",
   "7-10",
   "8-9",
   "8-8",
   "9-8",
   "9-7",
   "10-7",
   "8-7",
   "9-6",
   "5-11",
   "4-11",
   "4-10",
   "3-10",
   "4-9",
   "6-7",
   "7-11",
   "8-10",
   "4-12",
   "3-11",
   "13-13",
   "13-14",
   "12-13",
   "11-12",
   "12-11",
   "8-23",
   "9-24",
   "10-24",
   "11-24",
   "13-26",
   "13-27",
   "14-27",
   "14-28",
   "15-28",
   "16-27",
   "17-26",
   "19-13",
   "19-14",
   "19-15",
   "18-13",
   "23-7",
   "24-8",
   "25-9",
   "26-10",
   "26-11",
   "24-8",
   "22-7",
   "17-4",
   "18-4",
   "18-5",
   "17-5",
   "16-3",
   "17-3",
   "16-4",
   "15-3",
   "16-2",
   "31-4",
   "32-4",
   "33-4",
   "33-4",
   "33-5",
   "32-5",
   "33-6",
   "33-3",
   "34-4",
   "25-23",
   "26-24",
   "27-25",
   "28-26",
   "28-27",
   "28-29",
   "27-30",
   "26-30",
   "26-31",
   "25-31",
   "24-31",
   "27-26",
   "28-25",
   "29-26",
   "29-26",
   "29-28",
   "29-27",
   "29-29",
   "25-23",
   "25-23",
   "25-24",
   "26-25",
   "27-24",
   "29-25",
   "28-30",
   "27-30",
   "27-31",
   "30-27",
   "22-27",
   "21-28",
   "21-29",
   "20-30",
   "19-30",
   "20-29",
   "20-29",
   "19-31",
   "20-31",
   "18-29",
   "18-30",
   "22-29",
   "4-28",
   "5-28",
   "5-29",
   "6-29",
   "7-29",
   "6-30",
   "6-28",
];


//  ------  Tempory  ------
let randPathIntervals: any = [];

const setWallsList = () => {

   walls.forEach((cellID) => {
      const cell:     Cell = glo.Grid!.cellsList.get(cellID)!;
      const { x, y }: IPosition = gridPos_toScreenPos(cell.center);
      
      cell.isBlocked   = true;
      cell.screenPos.x = x;
      cell.screenPos.y = y;

      glo.Grid!.addToOccupiedMap(cell);
   });
}
//  ------  Tempory  ------





// =========================================================================================
// Draw Methods
// =========================================================================================
const drawScrollBounds = () => {

   if(glo.Params.isFrameHidden) return;
   
   const scrollBounds: any = setScrollBounds();

   for(let i in scrollBounds) {

      const { x, y, width, height }: ISquare = scrollBounds[i];

      glo.Ctx.assets.fillStyle = "rgba(255, 0, 255, 0.5)";
      glo.Ctx.assets.fillRect(
         x,
         y,
         width,
         height
      );
   }
}



const drawHoverCell = () => {

   if(!isWithinGrid(glo.IsoGridPos)) return;

   glo.Ctx.isoSelect.strokeStyle = "yellow";
   glo.Ctx.isoSelect.lineWidth = 4;
   
   // Draw hovelCell frame
   glo.Ctx.isoSelect.strokeRect(
      glo.HoverCell.gridPos.x,
      glo.HoverCell.gridPos.y,
      glo.Grid!.cellSize,
      glo.Grid!.cellSize,
   );
}

const drawSelectUnit = () => {

   glo.OldSelectList.forEach((agent: Agent) => {
      let agentPos = gridPos_toScreenPos(agent.position);

      if(!isWithinViewport(agentPos)) return;

      agent.drawSelect(glo.Ctx.isoSelect, "yellow");
   });
}

const drawHoverUnit = () => {

   glo.CurrentSelectList.forEach((agent: Agent) => {
      let agentPos = gridPos_toScreenPos(agent.position);

      if(!isWithinViewport(agentPos)) return;

      agent.drawSelect(glo.Ctx.isoSelect, "blue");
   });
}

const drawGrid = () => {
   if(glo.Params.isGridHidden) return;

   const { isoSelect } = glo.Ctx;
   
   glo.Grid!.cellsList.forEach((cell: Cell) => {
      const cellPos = gridPos_toScreenPos(cell.center);
      
      if(!isWithinViewport(cellPos)) return;
         
      cell.screenPos.x = cellPos.x;
      cell.screenPos.y = cellPos.y;
      cell.drawInfos(isoSelect);
   });
}


// =========================================================================================
// Terrain - Units - Walls
// =========================================================================================
const drawTerrain = () => {
   
   glo.Grid!.cellsList.forEach((cell: Cell) => {
      let cellPos = gridPos_toScreenPos(cell.center);

      cell.drawSprite(glo.Ctx.terrain, cellPos);
   });   
}

const draw_UnitsAndBuild = (frame: number) => {

   const { assets, isoSelect } = glo.Ctx;

   for(const cell of glo.Grid!.occupiedCells) {
         
      if(cell.agentIDset.size > 0) {
         
         for(const agentID of cell.agentIDset) {

            const agent    = glo.AgentsList.get(agentID)!;
            const agentPos = gridPos_toScreenPos(agent.position);
      
            agent.updateState(frame);
            agent.walkPath();
         
            if(!isWithinViewport(agentPos)) continue;
         
            agent.drawSprite(assets, agentPos, glo.Scroll);
            // agent.drawCollider(units, agentPos, glo.Scroll);
            agent.drawPath(isoSelect);
         }
      }

      if(cell.isBlocked) {
         const srcSize  = 280;
         const destSize = 90;
         const offsetX  = 48;
         const offsetY  = 75;

         if(cell.isTransp) {
            assets.save();
            assets.globalAlpha = 0.5;
      
            assets.drawImage(
               glo.walls_Img,
      
               // Source
               0,
               0,
               srcSize,
               srcSize,
               
               // Destination
               cell.screenPos.x -offsetX + glo.Scroll.x,
               cell.screenPos.y -offsetY + glo.Scroll.y,
               destSize +10,
               destSize,
            );
            
            assets.restore();
            return;
         }
      
         assets.drawImage(
            glo.walls_Img,

            // Source
            0,
            0,
            srcSize,
            srcSize,
            
            // Destination
            cell.screenPos.x -offsetX +glo.Scroll.x,
            cell.screenPos.y -offsetY +glo.Scroll.y,
            destSize +10,
            destSize,
         );
      }
   }
}


// =========================================================================================
// Peripherals Inputs
// =========================================================================================
const setPeripherals = () => {

   window.addEventListener("keydown",   (event) => keyboard_Input(event));
}

const keyboard_Input = (event: KeyboardEvent) => {

   switch(event.key) {

      case "Enter": {
         glo.AgentsList.forEach((agent: Agent) => {
            
            Test_PathRandomize(agent);
            const intervalID = setInterval(() => Test_PathRandomize(agent), 3000);
            randPathIntervals.push(intervalID);
         });
      } break;

      case "Backspace": {
         randPathIntervals.forEach((intervalID: number) => clearInterval(intervalID));
      } break;
   }
}



// =========================================================================================
// Animation
// =========================================================================================
const runAnimation = () => {

   frame++;

   clearCanvas("isoSelect");
   clearCanvas("assets");
   
   scrollCam();
   
   drawScrollBounds();
   draw_UnitsAndBuild(frame);
   drawHoverUnit();
   drawSelectUnit();
   drawGrid();
   drawHoverCell();

   requestAnimationFrame(runAnimation);
}


// =========================================================================================
// Test Methods
// =========================================================================================
const rand = (
   maxValue: number,
): number => {

   return Math.floor( Math.random() *maxValue );
}

const Test_PathRandomize = (agent: Agent) => {

   let i = rand(glo.Grid!.cellPerSide);
   let j = rand(glo.Grid!.cellPerSide);
   
   const targetCell = glo.Grid!.cellsList.get(`${i}-${j}`)!;
   
   if(targetCell.isBlocked) return;
   
   agent.goalCell = targetCell;
   agent.searchPath();
}

const Test_GenerateUnits = () => {

   let pop = 30;

   const blue   = "Units/Swordsman_Blue.png";
   const purple = "Units/Swordsman_Purple.png";
   const red    = "Units/Swordsman_Red.png";
   
   while(pop > 0) {

      let index = rand(4);
      let i = rand(glo.Grid!.cellPerSide);
      let j = rand(glo.Grid!.cellPerSide);

      let unitType = rand(2);

      if( glo.Grid!.cellsList.get(`${i}-${j}`)!.isVacant
      && !glo.Grid!.cellsList.get(`${i}-${j}`)!.isBlocked) {

         let color = "";

         if(index === 0) color = blue;
         if(index === 1) color = purple;
         if(index === 2) color = red;

         if(unitType === 0) createNewAgent("infantry", "swordsman", `${i}-${j}`, color);
         if(unitType === 1) createNewAgent("infantry", "worker", `${i}-${j}`, "");
         
         glo.Grid!.cellsList.get(`${i}-${j}`)!.isVacant = false;
         pop--;

         glo.CurrentPop++;
      }
      
      else continue;
   }
}


export const GameHandler = {

   init(
      document: Document,
      params:   any,
      // socket:   any,
   ) {
      
      glo.Params = params;
      glo.Grid   = new Grid(GridParams);

      // Set scrollCam max Bounds
      glo.max_X *= glo.Grid!.gridSize;
      glo.max_Y *= glo.Grid!.gridSize;

      // Set tiles Images
      glo.flatG_Img.src = glo.flatG_Src;
      glo.highG_Img.src = glo.highG_Src;
      glo.walls_Img.src = glo.walls_Src;


      // Set DOM & some data
      // setViewportSize(document);
      setCanvasSize ();
      setAvailableID();
      setViewAngle ();
      setPeripherals();     
      

      // CSS ScrollCanvas
      glo.IsoSelectComputed = new DOMMatrix(window.getComputedStyle(glo.Canvas.isoSelect).transform);
      glo.TerrainComputed   = new DOMMatrix(window.getComputedStyle(glo.Canvas.terrain  ).transform);


      // --- Tempory ---
      setWallsList();
      tiles.forEach(ID => glo.Grid!.cellsList.get(ID)!.isDiffTile = true);
      
      setTimeout(() => {
         drawTerrain();
      }, 0);

      createNewAgent("infantry", "swordsman", "6-16",  "");
      createNewAgent("infantry", "swordsman", "9-20",  "");
      createNewAgent("infantry", "swordsman", "9-22",  "");
      createNewAgent("infantry", "swordsman", "9-24",  "");
      createNewAgent("infantry", "swordsman", "13-24", "");
      createNewAgent("infantry", "swordsman", "24-14", "");
      
      // createNewAgent("infantry",  "worker",    "5-3", "");
      // createNewAgent("cavalry",   "swordsman", "9-2", "");
      // createNewAgent("cavalry",   "bowman",    "2-6", "");
      // createNewAgent("machinery", "ballista",  "8-5", "");
      // createNewAgent("machinery", "catapult",  "6-9", "");
      
      // Test_GenerateUnits();
      // --- Tempory ---

      runAnimation();
   },

}