
"use strict"

import {
   IPosition,
   ISquare,
} from "./utils/interfaces";

import {
   CollisionClass as Collision,
   AgentClass,
   CellClass,
} from "./classes/_Export";

import { glo        } from "./utils/_GlobalVar";
import { unitParams } from "./utils/unitParams";


// ================================================================================================
// Extended Methods
// ================================================================================================
export const ext = {
   
   clearCanvas(canvasName: string) {

      if(canvasName === "isoSelect") {
         return glo.Ctx[canvasName].clearRect(0, 0, glo.GridParams.gridSize, glo.GridParams.gridSize);
      }

      glo.Ctx[canvasName].clearRect(0, 0, glo.Viewport.width, glo.Viewport.height);
   },

   isEmptyObj(obj: {}) {
      if(Object.keys(obj).length === 0) return true;
   },
   
   isWithinGrid(isoGridPos: IPosition) {

      const { x, y }: IPosition = isoGridPos;
      
      if(isoGridPos
      && x > 0
      && x < glo.GridParams.gridSize
      && y > 0
      && y < glo.GridParams.gridSize) {
   
         return true;
      }
   
      return false;
   },

   isWithinViewport(gridPos: IPosition) {

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

      const { x, y }: IPosition = gridPos;
   
      if(x >= vpX           -scrollX
      && x <= vpX +vpWidth  -scrollX
      && y >= vpY           -scrollY
      && y <= vpY +vpHeight -scrollY) {
   
         return true;
      }
   
      return false;
   },

   cycleList(
      list:     any,
      callback: Function,
   ) {

      for(let i in list) {
         callback(list[i]);
      }
   },

   getScreenPos(event: MouseEvent) {

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

   screenPos_toGridPos(screenPos: IPosition) {
   
      const screenX        = screenPos.x;
      const doubleScreenY  = screenPos.y *2;
      const half_GridWidth = glo.GridParams.gridSize *0.5;

      // Isometric <== Cartesian
      return {
         x:  Math.floor( (screenX -doubleScreenY) /glo.Cos_45deg  *0.5 ) +half_GridWidth,
         y:  Math.floor( (screenX +doubleScreenY) /glo.Cos_45deg  *0.5 ) -half_GridWidth,
      };
   },    
   
   gridPos_toScreenPos(gridPos: IPosition) {

      const {
         x: gridX,
         y: gridY,
      }: IPosition = gridPos;

      const {
         x: offsetX,
         y: offsetY,
      }: IPosition = glo.ViewportOffset;
      
      const Cos_45: number = glo.Cos_45deg;
   
      // Cartesian <== Isometric
      const TempX = Math.floor( (gridX +gridY         ) *Cos_45 );
      const TempY = Math.floor( (gridY +glo.GridAngle!) *Cos_45 *2 -TempX ) *0.5;
      
      return {
         x: Math.floor( TempX +offsetX ),
         y: Math.floor( TempY +offsetY ),
      };
   },
   
   getHoverCell() {

      const cellSize: number = glo.Grid!.cellSize;
      
      const {
         x: isoX,
         y: isoY,
      }: IPosition = glo.IsoGridPos;

      const cellPos: IPosition = {
         x: isoX - (isoX % cellSize),
         y: isoY - (isoY % cellSize),
      };
   
      const cellCenter: IPosition = {
         x: cellPos.x +cellSize *0.5,
         y: cellPos.y +cellSize *0.5,
      };
   
      return {
         id:       `${cellPos.x /cellSize}-${cellPos.y /cellSize}`,
         center:    cellCenter,
         gridPos:   cellPos,
         screenPos: this.gridPos_toScreenPos(cellCenter),
      }
   },
   
   drawSelectArea() {

      let selected   = glo.SelectArea;

      const { x: oldX,     y: oldY     }: IPosition = selected.oldPos.cartesian;
      const { x: currentX, y: currentY }: IPosition = selected.currentPos.cartesian;

      // Set rect size
      selected.width  = currentX -oldX;
      selected.height = currentY -oldY;

      // Set rect params
      glo.Ctx.selection.lineWidth   = selected.lineWidth;
      glo.Ctx.selection.strokeStyle = selected.borderColor;
      glo.Ctx.selection.fillStyle   = selected.filledColor;

      // Draw borders
      glo.Ctx.selection.strokeRect(
         oldX,
         oldY,
         selected.width,
         selected.height
      );
      
      // Draw filled rect
      glo.Ctx.selection.fillRect(
         oldX,
         oldY,
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
         glo.Grid!.cellSize,
         glo.Grid!.cellSize,
      );
   },

   scrollCam() {

      const detSize = 50;

      const {
         x:      vpX,
         y:      vpY,
         width:  vpWidth,
         height: vpHeight,
      }: ISquare = glo.ViewportSqr;

      const bounderies: any = {

         top: {
            x:       vpX,
            y:       vpY,
            width:   vpWidth,
            height:  detSize,
         },

         right: {
            x:       vpX +vpWidth -detSize,
            y:       vpY,
            width:   detSize,
            height:  vpHeight,
         },

         bottom: {
            x:       vpX,
            y:       vpY +vpHeight -detSize,
            width:   vpWidth,
            height:  detSize,
         },

         left: {
            x:       vpX,
            y:       vpY,
            width:   detSize,
            height:  vpHeight,
         },
      }

      for(let i in bounderies) {

         const { x, y, width, height }: ISquare = bounderies[i];

         glo.Ctx.units.fillStyle = "rgba(255, 0, 255, 0.5)";
         glo.Ctx.units.fillRect(
            x,
            y,
            width,
            height
         );
      }      

      const mousePos = glo.SelectArea.currentPos.cartesian;
      
      if(mousePos) {
         
         if(Collision.point_toSquare(mousePos, bounderies.top   )) glo.ScrollOffset.y += glo.MouseSpeed;
         if(Collision.point_toSquare(mousePos, bounderies.right )) glo.ScrollOffset.x -= glo.MouseSpeed;
         if(Collision.point_toSquare(mousePos, bounderies.bottom)) glo.ScrollOffset.y -= glo.MouseSpeed;
         if(Collision.point_toSquare(mousePos, bounderies.left  )) glo.ScrollOffset.x += glo.MouseSpeed;
      }
      
      glo.ComputedCanvas!.e = glo.ScrollOffset.x;
      glo.ComputedCanvas!.f = glo.ScrollOffset.y *2 -glo.GridParams.gridSize /2;
      
      glo.Canvas.isoSelect.style.transform = glo.ComputedCanvas!.toString();
   },

   updateUnitsList(
      collideCallback: Function,
      first:  unknown,
      second: unknown,
      agent:  AgentClass
   ) {
      
      if(collideCallback(first, second)) glo.CurrentSelectList[agent.id] = agent;
      else delete glo.CurrentSelectList[agent.id];
   },
   
   unitSelection() {

      let selectArea: unknown;
      let isSelecting: boolean = glo.SelectArea.isSelecting;
      
      const {
         oldPos,
         currentPos,
         height: selectHeight,
         width:  selectWidth,
      } = glo.SelectArea;

      if(isSelecting) {
         this.clearCanvas("selection");
         this.drawSelectArea();

         selectArea = {
            x:      oldPos.cartesian.x,
            y:      oldPos.cartesian.y,
            height: selectHeight,
            width:  selectWidth,
         };
      }

      const mousePos = {
         x: currentPos.cartesian.x,
         y: currentPos.cartesian.y,
      };

      // If collide with mouse or select area ==> Add agent to CurrentList 
      this.cycleList(glo.AgentsList, (agent: AgentClass) => {
         
         const { x: agentX,  y: agentY  }: IPosition = this.gridPos_toScreenPos(agent.position);
         const { x: scrollX, y: scrollY }: IPosition = glo.ScrollOffset;

         // Agent collider
         const agentCollider = {
            x:      agentX +scrollX,
            y:      agentY +scrollY,
            radius: agent.collider.radius,
         };

         if(isSelecting) {
            return this.updateUnitsList(Collision.square_toCircle, selectArea, agentCollider, agent);
         }

         this.updateUnitsList(Collision.point_toCircle, mousePos, agentCollider, agent);
      });
   },

   unitDiselection() {

      this.clearCanvas("selection");
      
      // If OldList === Empty ==> Set OldList
      if(this.isEmptyObj(glo.OldSelectList)) {

         glo.OldSelectList     = glo.CurrentSelectList;
         glo.CurrentSelectList = {};

         this.cycleList(glo.OldSelectList, (agent: AgentClass) => agent.isSelected = true);
      }

      // If OldList !== Empty && CurrentList !== Empty
      else if(!this.isEmptyObj(glo.CurrentSelectList)) {

         // Remove old selected agents
         this.cycleList(glo.OldSelectList, (agent: AgentClass) => {

            if(!Object.keys(glo.CurrentSelectList).includes( agent.id.toString() )) {
               agent.isSelected = false;
               delete glo.OldSelectList[agent.id];
            }
         });

         // Add new selected agents
         this.cycleList(glo.CurrentSelectList, (agent: AgentClass) => {

            agent.isSelected = true;
            glo.OldSelectList[agent.id] = agent;
            delete glo.CurrentSelectList[agent.id];
         });
      }

      // If OldList === Empty && CurrentList !== Empty
      else this.cycleList(glo.OldSelectList, (agent: AgentClass) => {
         
         if(agent.isSelected) {
            agent.isSelected = false;
            delete glo.OldSelectList[agent.id];
         }
      });
   },

   createNewAgent(
      divisionName: string, 
      typeName :    string, 
      cellID:       string, 
      diffImgSrc:   string,
   ) {

      const avID:     number  = glo.AvailableIDArray[0];
      const division: unknown = unitParams[divisionName];
      const unitType: unknown = division.unitType[typeName];
      
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
         startCell:   glo.Grid!.cellsList[cellID], // <== Tempory until create JS file "BuildingsClass"
      };

      this.cycleList(glo.Grid!.cellsList, (cell: CellClass) => {
         cell.agentList[avID] = {
            hCost: 0,
            gCost: 0,
            fCost: 0,
            cameFromCell: undefined,
         }
      });
      
      glo.AgentsList[avID] = new AgentClass(agentParams);
   },

   drawUnits(frame: number) {

      this.cycleList(glo.AgentsList, (agent: AgentClass) => {
         let agentPos = this.gridPos_toScreenPos(agent.position);
   
         agent.updateState(frame);
         agent.walkPath();
   
         if(!this.isWithinViewport(agentPos)) return;
         
         const { units, isoSelect } = glo.Ctx;

         agent.drawSprite(units, agentPos, glo.ScrollOffset);
         // agent.drawCollider(units, agentPos, glo.ScrollOffset);
         agent.drawPath(isoSelect);
      });
   },
   
   drawBuildings() {
   
      this.cycleList(glo.Grid!.cellsList, (cell: CellClass) => {
         let cellPos = this.gridPos_toScreenPos(cell.center);
   
         if(!this.isWithinViewport(cellPos)) return;

         const { units, isoSelect, terrain } = glo.Ctx;
   
         // cell.drawSprite(terrain, cellPos, glo.ScrollOffset);
         cell.drawWall   (units, cellPos, glo.ScrollOffset);
         cell.drawInfos  (isoSelect);
         cell.drawVacancy(isoSelect);
      }); 
   },
   
   drawSelection() {
   
      this.cycleList(glo.OldSelectList, (agent: AgentClass) => {
         let agentPos = this.gridPos_toScreenPos(agent.position);
   
         if(!this.isWithinViewport(agentPos)) return;

         agent.drawSelect(glo.Ctx.isoSelect, "yellow");
      });
   },
   
   drawHover() {
   
      this.cycleList(glo.CurrentSelectList, (agent: AgentClass) => {
         let agentPos = this.gridPos_toScreenPos(agent.position);
   
         if(!this.isWithinViewport(agentPos)) return;

         agent.drawSelect(glo.Ctx.isoSelect, "blue");
      });
   },

   Test_PathRandomize(agent: AgentClass) {

      let i = glo.Grid!.rand(glo.Grid!.cellRange);
      let j = glo.Grid!.rand(glo.Grid!.cellRange);
      
      const targetCell = glo.Grid!.cellsList[`${i}-${j}`];
      
      if(targetCell.isBlocked) return;
      
      agent.goalCell = targetCell;
      agent.searchPath();
   },
   
   Test_GenerateUnits() {
   
      let pop = 30;
   
      const blue   = "Units/Swordsman_Blue.png";
      const purple = "Units/Swordsman_Purple.png";
      const red    = "Units/Swordsman_Red.png";
      
      while(pop > 0) {
   
         let index = glo.Grid!.rand(4);
         let i = glo.Grid!.rand(glo.Grid!.cellRange);
         let j = glo.Grid!.rand(glo.Grid!.cellRange);
   
         let unitType = glo.Grid!.rand(2);
   
         if( glo.Grid!.cellsList[`${i}-${j}`].isVacant
         && !glo.Grid!.cellsList[`${i}-${j}`].isBlocked) {
   
            let color = "";
   
            if(index === 0) color = blue;
            if(index === 1) color = purple;
            if(index === 2) color = red;
   
            if(unitType === 0) this.createNewAgent("infantry", "swordsman", `${i}-${j}`, color);
            if(unitType === 1) this.createNewAgent("infantry", "worker", `${i}-${j}`, "");
            
            glo.Grid!.cellsList[`${i}-${j}`].isVacant = false;
            pop--;
   
            glo.CurrentPop++;
         }
         
         else continue;
      }
   },

}