
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const AgentClass = require("../classes/AgentClass.js");
const unitParam  = require("./mod_unitsParams.js");
const collision  = require("./mod_collisions.js");
const glo  = require("./mod_globalVar.js");
const draw = require("./mod_drawMethods.js");


// ================================================================================================
// Extended Methods
// ================================================================================================
module.exports = {
   
   clearCanvas(canvas) {
      glo.Ctx[canvas].clearRect(0, 0, glo.Viewport.width, glo.Viewport.height);
   },

   isEmptyObj(obj) {
      if(Object.keys(obj).length === 0) return true;
   },

   updateDOM() {

      glo.DOM.cartX.textContent = `x : ${glo.SelectArea.currentPos.cartesian.x}`;
      glo.DOM.cartY.textContent = `y : ${glo.SelectArea.currentPos.cartesian.y}`;
      glo.DOM.isoX.textContent  = `x : ${glo.IsoGridPos.x}`;
      glo.DOM.isoY.textContent  = `y : ${glo.IsoGridPos.y}`;
      
      this.withinTheGrid(() => {
         glo.DOM.cellX.textContent  =  `x : ${glo.HoverCell.gridPos.x}`;
         glo.DOM.cellY.textContent  =  `y : ${glo.HoverCell.gridPos.y}`;
         glo.DOM.cellID.textContent = `id : ${glo.HoverCell.id}`;
      });
   },

   cycleList(list, callback) {

      for(let i in list) {
         callback(list[i]);
      }
   },

   getScreenPos(event) {

      let screenBound  = glo.CanvasObj.selection.getBoundingClientRect();
      let isoGridBound = glo.CanvasObj.isoSelect.getBoundingClientRect();
   
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
   
      // Isometric <== Cartesian
      return {
         x:  Math.floor( (screenPos.x -screenPos.y *2) /glo.Cos_45deg /2 ) +glo.Grid.width /2,
         y:  Math.floor( (screenPos.x +screenPos.y *2) /glo.Cos_45deg /2 ) -glo.Grid.width /2,
      };
   },
   
   gridPos_toScreenPos(gridPos) {
   
      // Cartesian <== Isometric
      let TempX = Math.floor( (gridPos.x + gridPos.y) *glo.Cos_45deg );
      let TempY = Math.floor( (gridPos.y +glo.Grid.width /2 -glo.Grid.cellSize *glo.Cos_45deg *glo.Cos_30deg) *glo.Cos_45deg *2 -TempX ) /2;
      
      return {
         x: Math.floor( glo.Viewport.width  /2 - glo.Cos_45deg /2 *(glo.Grid.height +glo.Grid.width) +TempX ),
         y: Math.floor( glo.Viewport.height /2 - glo.Cos_45deg /4 *(glo.Grid.height +glo.Grid.width) +TempY +glo.Cos_30deg *glo.Grid.cellSize /2 ),
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
         id: `${cellPos.x /cellSize}-${cellPos.y /cellSize}`,
         center: cellCenter,
         gridPos: cellPos,
         screenPos: screenPos,
      }
   },
   
   withinTheGrid(callback) {
      let isoGridPos = glo.IsoGridPos;
      
      if(isoGridPos
      && isoGridPos.x > 0
      && isoGridPos.x < glo.Grid.width
      && isoGridPos.y > 0
      && isoGridPos.y < glo.Grid.height) {
   
         callback();
      }
   },

   scrollCam() {

      // --- Draw Viewport - Tempory ---
      glo.Ctx.selection.strokeStyle = "yellow";
      glo.Ctx.selection.lineWidth = 4;
      glo.Ctx.selection.strokeRect(
         glo.ViewportSqr.x,
         glo.ViewportSqr.y,
         glo.ViewportSqr.width,
         glo.ViewportSqr.height,
      );
      // --- Draw Viewport - Tempory ---
      

      const mousePos = glo.SelectArea.currentPos.cartesian;
      
      if(mousePos) {
         
         const cursorSqr = {
            x: mousePos.x,
            y: mousePos.y,
            width:  glo.CursorSize,
            height: glo.CursorSize,
         }
   
         const cursor   = collision.extractSides(cursorSqr);
         const viewport = collision.extractSides(glo.ViewportSqr);

         if(collision.line_toLine(cursor.left, viewport.top   )) glo.ScrollOffset.y += glo.MouseSpeed;
         if(collision.line_toLine(cursor.top,  viewport.right )) glo.ScrollOffset.x -= glo.MouseSpeed;
         if(collision.line_toLine(cursor.left, viewport.bottom)) glo.ScrollOffset.y -= glo.MouseSpeed;
         if(collision.line_toLine(cursor.top,  viewport.left  )) glo.ScrollOffset.x += glo.MouseSpeed;
      }
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
         draw.selectArea();

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
            x: agentPos.x,
            y: agentPos.y,
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

   createNewAgent(categoryName, typeName, cellID) {

      const avID     = glo.AvailableIDArray[0];
      const category = unitParam[categoryName];
      const type     = category.type[typeName];
   
      glo.CurrentPop += category.popCost;
      glo.AvailableIDArray.splice(0, category.popCost);
      
      const agentParams = {
         id:          avID,
         type:        type,
         popCost:     category.popCost,
         collider:    category.collider,
         startCell:   glo.Grid.cellsList[cellID], // Tempory until buildings class created
         isEuclidean: glo.Grid.isEuclidean,
      };
      
      glo.AgentsList[avID] = new AgentClass(agentParams);
      glo.AgentsList[avID].drawAgent(glo.Ctx.isoSelect, "yellow");
   },   
   
}