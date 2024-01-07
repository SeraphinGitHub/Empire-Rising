
"use strict"

import { glo        } from "./utils/_GlobalVar";
import { unitParams } from "./utils/unitParams";

import {
   CollisionClass,
   AgentClass,
} from "./classes/_Export";

// ================================================================================================
// Extended Methods
// ================================================================================================
export const ext = {
   
   clearCanvas(canvas) {

      if(canvas === "isoSelect") {
         return glo.Ctx[canvas].clearRect(0, 0, glo.GridParams.gridSize, glo.GridParams.gridSize);
      }

      glo.Ctx[canvas].clearRect(0, 0, glo.Viewport.width, glo.Viewport.height);
   },

   isEmptyObj(obj) {
      if(Object.keys(obj).length === 0) return true;
   },
   
   isWithinGrid(isoGridPos) {
      
      if(isoGridPos
      && isoGridPos.x > 0
      && isoGridPos.x < glo.GridParams.gridSize
      && isoGridPos.y > 0
      && isoGridPos.y < glo.GridParams.gridSize) {
   
         return true;
      }
   
      return false;
   },

   isWithinViewport(gridPos) {

      const {
         x:      vpX,
         y:      vpY,
         width:  vpWidth,
         height: vpHeight
      } = glo.ViewportSqr;
   
      const {
         x:      scrollX,
         y:      scrollY,
      } = glo.ScrollOffset;
   
      if(gridPos.x >= vpX           -scrollX
      && gridPos.x <= vpX +vpWidth  -scrollX
      && gridPos.y >= vpY           -scrollY
      && gridPos.y <= vpY +vpHeight -scrollY) {
   
         return true;
      }
   
      return false;
   },

   cycleList(list, callback) {

      for(let i in list) {
         callback(list[i]);
      }
   },

   getScreenPos(event) {

      let screenBound  = glo.Canvas.selection.getBoundingClientRect();
      let isoGridBound = glo.Canvas.isoSelect.getBoundingClientRect();
   
      return {
         cartesian: {
            x: Math.floor( event.clientX -screenBound.left ),
            y: Math.floor( event.clientY -screenBound.top  ),
         },
   
         isometric: {
            x: Math.floor( event.clientX -isoGridBound.left ),
            y: Math.floor( event.clientY -isoGridBound.top  ),
         },
      }
   },
   
   screenPos_toGridPos(screenPos) {
   
      const screenX        = screenPos.x;
      const doubleScreenY  = screenPos.y *2;
      const half_GridWidth = glo.GridParams.gridSize *0.5;

      // Isometric <== Cartesian
      return {
         x:  Math.floor( (screenX -doubleScreenY) /glo.Cos_45deg  *0.5 ) +half_GridWidth,
         y:  Math.floor( (screenX +doubleScreenY) /glo.Cos_45deg  *0.5 ) -half_GridWidth,
      };
   },
   
   gridPos_toScreenPos(gridPos) {
   
      // Cartesian <== Isometric
      const TempX = Math.floor( (gridPos.x +gridPos.y) *glo.Cos_45deg );
      const TempY = Math.floor( (gridPos.y +glo.GridAngle) *glo.Cos_45deg *2 -TempX ) /2;
      
      return {
         x: Math.floor( TempX +glo.ViewportOffset.x),
         y: Math.floor( TempY +glo.ViewportOffset.x),
      };
   },
   
   getHoverCell() {

      let isoGridPos = glo.IsoGridPos;
      let cellSize   = glo.Grid.cellSize;

      const cellPos = {
         x: isoGridPos.x - (isoGridPos.x % cellSize),
         y: isoGridPos.y - (isoGridPos.y % cellSize),
      };
   
      const cellCenter = {
         x: cellPos.x +cellSize /2,
         y: cellPos.y +cellSize /2,
      };
   
      const screenPos = this.gridPos_toScreenPos(cellCenter);
   
      return {
         id:       `${cellPos.x /cellSize}-${cellPos.y /cellSize}`,
         center:    cellCenter,
         gridPos:   cellPos,
         screenPos: screenPos,
      }
   },
   
   drawSelectArea() {

      let selected   = glo.SelectArea;
      let oldPos     = selected.oldPos.cartesian;
      let currentPos = selected.currentPos.cartesian;

      // Set rect size
      selected.width  = currentPos.x -oldPos.x;
      selected.height = currentPos.y -oldPos.y;

      // Set rect params
      glo.Ctx.selection.lineWidth   = selected.lineWidth;
      glo.Ctx.selection.strokeStyle = selected.borderColor;
      glo.Ctx.selection.fillStyle   = selected.filledColor;

      // Draw borders
      glo.Ctx.selection.strokeRect(
         oldPos.x,
         oldPos.y,
         selected.width,
         selected.height
      );
      
      // Draw filled rect
      glo.Ctx.selection.fillRect(
         oldPos.x,
         oldPos.y,
         selected.width,
         selected.height
      );
   },

   drawHoverCell() {

      glo.Ctx.isoSelect.strokeStyle = "yellow";
      glo.Ctx.isoSelect.lineWidth = 4;
      
      // Draw hovelCell frame
      glo.Ctx.isoSelect.strokeRect(
         glo.HoverCell.gridPos.x,
         glo.HoverCell.gridPos.y,
         glo.Grid.cellSize,
         glo.Grid.cellSize,
      );
   },

   scrollCam() {

      const detSize = 50;

      const vp = {
         x: glo.ViewportSqr.x,
         y: glo.ViewportSqr.y,
         w: glo.ViewportSqr.width,
         h: glo.ViewportSqr.height,
      }

      const bounderies = {

         top: {
            x:       vp.x,
            y:       vp.y,
            width:   vp.w,
            height:  detSize,
         },

         right: {
            x:       vp.x +vp.w -detSize,
            y:       vp.y,
            width:   detSize,
            height:  vp.h,
         },

         bottom: {
            x:       vp.x,
            y:       vp.y +vp.h -detSize,
            width:   vp.w,
            height:  detSize,
         },

         left: {
            x:       vp.x,
            y:       vp.y,
            width:   detSize,
            height:  vp.h,
         },
      }

      for(let i in bounderies) {
         let rect = bounderies[i];

         glo.Ctx.units.fillStyle = "rgba(255, 0, 255, 0.5)";
         glo.Ctx.units.fillRect(
            rect.x,
            rect.y,
            rect.width,
            rect.height
         );
      }      

      const mousePos = glo.SelectArea.currentPos.cartesian;
      
      if(mousePos) {
         
         if(collision.point_toSquare(mousePos, bounderies.top   )) glo.ScrollOffset.y += glo.MouseSpeed;
         if(collision.point_toSquare(mousePos, bounderies.right )) glo.ScrollOffset.x -= glo.MouseSpeed;
         if(collision.point_toSquare(mousePos, bounderies.bottom)) glo.ScrollOffset.y -= glo.MouseSpeed;
         if(collision.point_toSquare(mousePos, bounderies.left  )) glo.ScrollOffset.x += glo.MouseSpeed;
      }
      
      glo.ComputedCanvas.e = glo.ScrollOffset.x;
      glo.ComputedCanvas.f = glo.ScrollOffset.y *2 -glo.GridParams.gridSize /2;
      
      glo.Canvas.isoSelect.style.transform = glo.ComputedCanvas.toString();
   },

   updateUnitsList(collideCallback, first, second, agent) {
      
      if(collideCallback(first, second)) glo.CurrentSelectList[agent.id] = agent;
      else delete glo.CurrentSelectList[agent.id];
   },
   
   unitSelection() {
      let isSelecting = glo.SelectArea.isSelecting;
      let square;

      if(isSelecting) {
         this.clearCanvas("selection");
         this.drawSelectArea();

         square = {
            x: glo.SelectArea.oldPos.cartesian.x,
            y: glo.SelectArea.oldPos.cartesian.y,
            height: glo.SelectArea.height,
            width:  glo.SelectArea.width,
         };
      }

      const point = {
         x: glo.SelectArea.currentPos.cartesian.x,
         y: glo.SelectArea.currentPos.cartesian.y,
      };

      // If collide with mouse or select area ==> Add agent to CurrentList 
      this.cycleList(glo.AgentsList, (agent) => {
         const agentPos = this.gridPos_toScreenPos(agent.position);
         
         // Agent collider
         const circle = {
            x: agentPos.x +glo.ScrollOffset.x,
            y: agentPos.y +glo.ScrollOffset.y,
            radius: agent.collider.radius,
         };

         if(isSelecting) {
            this.updateUnitsList(collision.square_toCircle, square, circle, agent);
         }
         else this.updateUnitsList(collision.point_toCircle, point, circle, agent);
      });
   },

   unitDiselection() {
      this.clearCanvas("selection");
      
      // If OldList === Empty ==> Set OldList
      if(this.isEmptyObj(glo.OldSelectList)) {
         glo.OldSelectList = glo.CurrentSelectList;
         glo.CurrentSelectList = {};
         this.cycleList(glo.OldSelectList, (agent) => agent.isSelected = true);
      }

      // If OldList !== Empty && CurrentList !== Empty
      else if(!this.isEmptyObj(glo.CurrentSelectList)) {

         // Remove old selected agents
         this.cycleList(glo.OldSelectList, (agent) => {
            if(!Object.keys(glo.CurrentSelectList).includes(agent.id)) {
               agent.isSelected = false;
               delete glo.OldSelectList[agent.id];
            }
         });

         // Add new selected agents
         this.cycleList(glo.CurrentSelectList, (agent) => {
            agent.isSelected = true;
            glo.OldSelectList[agent.id] = agent;
            delete glo.CurrentSelectList[agent.id];
         });
      }

      // If OldList === Empty && CurrentList !== Empty
      else this.cycleList(glo.OldSelectList, (agent) => {
         if(agent.isSelected) {
            agent.isSelected = false;
            delete glo.OldSelectList[agent.id];
         }
      });
   },

   createNewAgent(divisionName, typeName, cellID, diffImgSrc) {

      const avID     = glo.AvailableIDArray[0];
      const division = unitParam[divisionName];
      const unitType = division.unitType[typeName];

      let imgSrc     = unitType.imgSrc;
      if(diffImgSrc !== "") imgSrc = diffImgSrc;
   
      glo.CurrentPop += division.popCost;
      glo.AvailableIDArray.splice(0, division.popCost);
      
      const agentParams = {
         id:          avID,
         unitType,
         imgSrc,
         moveSpeed:   unitType.moveSpeed,
         popCost:     division.popCost,
         collider:    division.collider,
         startCell:   glo.Grid.cellsList[cellID], // <== Tempory until create JS file "BuildingsClass"
      };

      this.cycleList(glo.Grid.cellsList, (cell) => {
         cell.agentList[avID] = {
            hCost: 0,
            gCost: 0,
            fCost: 0,
            cameFromCell: undefined,
         }
      });
      
      glo.AgentsList[avID] = new AgentClass(agentParams);
   },

   Test_PathRandomize(agent) {

      let i = glo.Grid.rand(glo.Grid.cellRange);
      let j = glo.Grid.rand(glo.Grid.cellRange);
      
      const targetCell = glo.Grid.cellsList[`${i}-${j}`];
      
      if(targetCell.isBlocked) return;
      
      agent.endCell = targetCell;
      agent.searchPath(glo.Grid.cellsList);
   },
   
   Test_GenerateUnits() {
   
      let pop = 30;
   
      const blue   = "Units/Swordsman_Blue.png";
      const purple = "Units/Swordsman_Purple.png";
      const red    = "Units/Swordsman_Red.png";
      
      while(pop > 0) {
   
         let index = glo.Grid.rand(4);
         let i = glo.Grid.rand(glo.Grid.cellRange);
         let j = glo.Grid.rand(glo.Grid.cellRange);
   
         let unitType = glo.Grid.rand(2);
   
         if( glo.Grid.cellsList[`${i}-${j}`].isVacant
         && !glo.Grid.cellsList[`${i}-${j}`].isBlocked) {
   
            let color = "";
   
            if(index === 0) color = blue;
            if(index === 1) color = purple;
            if(index === 2) color = red;
   
            if(unitType === 0) this.createNewAgent("infantry", "swordsman", `${i}-${j}`, color);
            if(unitType === 1) this.createNewAgent("infantry", "worker", `${i}-${j}`, "");
            
            glo.Grid.cellsList[`${i}-${j}`].isVacant = false;
            pop--;
   
            glo.CurrentPop++;
         }
         
         else continue;
      }
   },

}