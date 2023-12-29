
"use strict"

// ================================================================================================
// Scripts Import
// ================================================================================================
const AgentClass = require("../classes/AgentClass.js");
const unitParam  = require("./unitsParams.js");
const collision  = require("./collisions.js");
const glo  = require("./globalVar.js");
const draw = require("./drawMethods.js");


// ================================================================================================
// Extended Methods
// ================================================================================================
module.exports = {
   
   clearCanvas(canvas) {

      if(canvas === "isoSelect") {
         return glo.Ctx[canvas].clearRect(0, 0, glo.GridParams.width, glo.GridParams.height);
      }

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


   // gridPos_toScreenPos(gridPos) {

   //    if(this.cachedScreenPos) return this.cachedScreenPos;

   //    const halfGridWidth = glo.Grid.width / 2;
   //    const halfGridCellSizeCos45 = glo.Grid.cellSize * glo.Cos_45deg / 2;
   //    const halfViewportWidth = glo.Viewport.width / 2;
   //    const halfViewportHeight = glo.Viewport.height / 2;
   //    const halfCos45GridWidth = glo.Cos_45deg * (glo.Grid.height + glo.Grid.width) / 2;
   //    const halfCos30GridCellSize = glo.Cos_30deg * glo.Grid.cellSize / 2;
    
   //    // Cartesian <== Isometric
   //    const tempX = Math.floor((gridPos.x + gridPos.y) * glo.Cos_45deg);
   //    const tempY = Math.floor((gridPos.y + halfGridWidth - halfGridCellSizeCos45) * glo.Cos_45deg * 2 - tempX) / 2;
      
   //    return {
   //      x: Math.floor(halfViewportWidth - halfCos45GridWidth + tempX),
   //      y: Math.floor(halfViewportHeight - halfViewportWidth / 2 + tempY + halfCos30GridCellSize),
   //    };
   // },
   
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
      glo.ComputedCanvas.f = glo.ScrollOffset.y *2 -glo.GridParams.height /2;
      glo.CanvasObj.isoSelect.style.transform = glo.ComputedCanvas.toString();
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

   createNewAgent(categoryName, typeName, cellID, diffImgSrc) {

      const avID     = glo.AvailableIDArray[0];
      const category = unitParam[categoryName];
      const type     = category.type[typeName];

      let imgSrc     = type.imgSrc;
      if(diffImgSrc !== "") imgSrc = diffImgSrc;
   
      glo.CurrentPop += category.popCost;
      glo.AvailableIDArray.splice(0, category.popCost);
      
      const agentParams = {
         id:          avID,
         type:        type,
         imgSrc:      imgSrc,
         popCost:     category.popCost,
         collider:    category.collider,
         startCell:   glo.Grid.cellsList[cellID], // Tempory until buildings class created
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
   
}