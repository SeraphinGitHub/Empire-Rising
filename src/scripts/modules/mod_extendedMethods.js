
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const AgentClass = require("../classes/AgentClass.js");
const glo        = require("./mod_globalVar.js");
const unitParam  = require("./mod_unitsParams.js");
const collision  = require("./mod_collisions.js");


// ================================================================================================
// Extended Methods
// ================================================================================================
module.exports = {
   
   clearCanvas(canvas) {
      glo.Ctx[canvas].clearRect(0, 0, glo.Viewport.width, glo.Viewport.height);
   },

   updateDOM() {

      glo.DOM.cartX.textContent =   `x : ${glo.SelectArea.currentPos.cartesian.x}`;
      glo.DOM.cartY.textContent =   `y : ${glo.SelectArea.currentPos.cartesian.y}`;
      glo.DOM.isoX.textContent =    `x : ${glo.IsoGridPos.x}`;
      glo.DOM.isoY.textContent =    `y : ${glo.IsoGridPos.y}`;
      glo.DOM.cellX.textContent =   `x : ${glo.HoverCell.gridPos.x}`;
      glo.DOM.cellY.textContent =   `y : ${glo.HoverCell.gridPos.y}`;
      glo.DOM.cellID.textContent = `id : ${glo.HoverCell.id}`;
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
   
   setHoverCell() {

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
   
   unitSelection() {
      this.cycleList(glo.AgentsList, (agent) => {
   
         const agentPos = this.gridPos_toScreenPos(agent.currentCell.center);
         
         // Selected area
         const square = {
            x: glo.SelectArea.oldPos.cartesian.x,
            y: glo.SelectArea.oldPos.cartesian.y,
            height: glo.SelectArea.height,
            width:  glo.SelectArea.width,
         };
         
         // Agent collider
         const circle = {
            x: agentPos.x,
            y: agentPos.y,
            radius: agent.collider.radius,
         };
   
         if(collision.square_toCircle(square, circle)) {
            glo.SelectedUnitsList[agent.id] = agent;
         }
         else {
            delete glo.SelectedUnitsList[agent.id];
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