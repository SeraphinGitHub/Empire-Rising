
import {
   ICanvas,
   ICircle,
   ICtx,
   IPosition,
   ISize,
   ISquare,
} from "../utils/interfaces";

import {
   Grid,
   Cell,
   Agent,
   Cursor,
   Viewport,
   Collision,
} from "../classes/_Export"

//  ------------  Tempory  ------------
let randPathIntervals: any = [];

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
//  ------------  Tempory  ------------


// =====================================================================
// Game Manager Class
// =====================================================================
export class GameManager {

   unitParams:       any;
   faction:          string = "Orange";

   gridSize:         number = 1600;
   cellSize:         number = 40;
   maxPop:           number = 2000;
   curPop:           number = 0;
   halfGrid:         number;

   Canvas:           ICanvas;
   Ctx:              ICtx;

   agentsList:       Map<number, Agent> = new Map();
   vacantIDsList:    number[]   = [];
   oldSelectList:    Set<Agent> = new Set();
   curSelectList:    Set<Agent> = new Set();
   
   gridPos:          IPosition  = {x:0, y:0};
   terrainPos:       IPosition  = {x:0, y:0};
   viewfieldPos:     IPosition  = {x:0, y:0};

   // Constants ==> Do not modify
   Frame:            number = 0;
   ViewAngle:        number = 0;
   COS_45:           number = 0.707;
   COS_30:           number = 0.866;

   // Classes instances
   Grid:             Grid;
   Cursor:           Cursor;
   Viewport:         Viewport;
   Collision:        Collision;

   HideGrid:         boolean;
   HideViewport:     boolean;
   

   // Images & Sources ==> Need to move in a dedicated class later 
   flatG_Img: HTMLImageElement = new Image();
   highG_Img: HTMLImageElement = new Image();
   walls_Img: HTMLImageElement = new Image();

   flatG_Src: string = "Terrain/Flat_Grass.png";
   highG_Src: string = "Terrain/High_Grass.png";
   walls_Src: string = "Buildings/wall.png";

   
   constructor(params: any) {
      
      // ***************  Temp  ***************
      this.flatG_Img.src = this.flatG_Src;
      this.highG_Img.src = this.highG_Src;
      this.walls_Img.src = this.walls_Src;
      // ***************  Temp  ***************

      this.unitParams    = params.unitParams;
      this.Canvas        = params.Canvas;
      this.Ctx           = params.Ctx;
      this.HideGrid      = params.props.HideGrid;
      this.HideViewport  = params.props.HideViewport;
      this.halfGrid      = this.gridSize *0.5;

      this.Viewport      = new Viewport  (this, params.docBody);
      this.Grid          = new Grid      (this);
      this.Cursor        = new Cursor    (this);
      this.Collision     = new Collision ();

      this.init();
   }

   init() {

      this.setCanvasSize();
      this.setViewAngle();
      this.setTerrainPos();
      this.setViewfieldPos();
      this.setVacantIDsList();

      // **********************************  Tempory  **********************************
      this.createNewAgent("infantry", "swordsman", "6-16",  "");
      this.createNewAgent("infantry", "swordsman", "9-20",  "");
      this.createNewAgent("infantry", "swordsman", "9-22",  "");
      this.createNewAgent("infantry", "swordsman", "9-24",  "");
      this.createNewAgent("infantry", "swordsman", "13-24", "");
      this.createNewAgent("infantry", "swordsman", "24-14", "");
      
      // this.createNewAgent("infantry",  "worker",    "5-3", "");
      // this.createNewAgent("cavalry",   "swordsman", "9-2", "");
      // this.createNewAgent("cavalry",   "bowman",    "2-6", "");
      // this.createNewAgent("machinery", "ballista",  "8-5", "");
      // this.createNewAgent("machinery", "catapult",  "6-9", "");

      // this.Test_GenerateUnits();
      this.Test_SetWallsList();
      tiles.forEach(ID => this.Grid.cellsList.get(ID)!.isDiffTile = true);
      setTimeout   (() => this.drawTerrain(), 100);
      // **********************************  Tempory  **********************************

      this.runAnimation();
   }

   runAnimation() {

      this.Frame++;
   
      this.clearCanvas("isometric");
      this.clearCanvas("assets");
      
      this.Viewport.detectScrolling();
      this.Viewport.drawInfos(this);
      
      this.draw_UnitsAndBuild();
      this.drawHoverUnit();
      this.drawSelectUnit();

      this.Grid.drawGrid();
   
      this.Cursor.drawHoverCell();
      this.Cursor.drawTargetArea();
   
      requestAnimationFrame(() => this.runAnimation());
   }

   setHtmlData() {

      const { x, y                    } = this.Viewport;
      const { curPos, hoverCell       } = this.Cursor;
      const { curPop, maxPop, gridPos } = this;

      return {
         curPop,
         maxPop,
         gridPos,
         hoverCell,
         cartPos: curPos.cart,
         viewPort: { x, y },
      }
   }


   // =========================================================================================
   // Terrain & Canvas
   // =========================================================================================
   getWorldSize(): ISize{

      const hypot:   number = this.gridSize;
      const degrees: number = 26.565;  // ==> Fake isometric angle value
      const radians: number = degrees * (Math.PI / 180);

      return {
         width:  Math.floor( hypot * Math.cos(radians) *2 ) +50, // +50 ==> some margin
         height: Math.floor( hypot * Math.sin(radians) *2 ) +50, // +50 ==> some margin
      }
   }

   setCanvasSize() {
      
      const gridCanvas: any = {
         terrain:   this.getWorldSize(),
         
         isometric: {
            width:  this.gridSize,
            height: this.gridSize,
         },
      };
 
      for(const canvasName in this.Canvas) {
         const canvas: HTMLCanvasElement = this.Canvas[canvasName];
   
         if(gridCanvas[canvasName]) {
            const { width, height } = gridCanvas[canvasName];
            canvas.width  = width;
            canvas.height = height;
         }
         
         else {
            canvas.width  = this.Viewport.width;
            canvas.height = this.Viewport.height;
         }
      }
   }

   setViewAngle() {

      this.ViewAngle = this.gridSize *0.5 -(this.cellSize *this.COS_45 *this.COS_30);
   }

   setTerrainPos() {
      
      const { width, height }: ISize = this.getWorldSize();

      this.terrainPos = {
         x:  Math.floor( (width  -this.Viewport.width ) *0.5 ),
         y:  Math.floor( (height -this.Viewport.height) *0.5 ),
      }
   }

   setViewfieldPos() {
      
      const diagOffset:    number = this.gridSize *this.COS_45;
      const half_vpWidth:  number = this.Viewport.width  *0.5;
      const half_vpHeight: number = this.Viewport.height *0.5;

      this.viewfieldPos.x = half_vpWidth  -diagOffset;
      this.viewfieldPos.y = half_vpHeight -diagOffset *0.5 +(this.cellSize *0.5 *this.COS_30);
   }

   setVacantIDsList() {

      for(let i = 1; i < this.maxPop; i++) {
         this.vacantIDsList.push(i);
      }
   }

   clearCanvas(canvasName: string) {

      const { width, height } = (canvasName === "isometric")
      ? { width: this.gridSize,       height: this.gridSize        }
      : { width: this.Viewport.width, height: this.Viewport.height };

      this.Ctx[canvasName].clearRect(0, 0, width, height);
   }


   // =========================================================================================
   // Boolean methods
   // =========================================================================================
   isMouseGridScope(): boolean {
      
      const { x: mouseX, y: mouseY }: IPosition = this.gridPos;
      
      if(mouseX > 0 && mouseX < this.gridSize
      && mouseY > 0 && mouseY < this.gridSize) {

         return true;
      }

      return false;
   }

   isViewScope(entityPos: IPosition): boolean {

      const {
         x:        vpX,
         y:        vpY,
         width:    vpWidth,
         height:   vpHeight
      }: ISquare = this.Viewport;

      const { x: entX, y: entY }: IPosition = entityPos;
      const margin = this.cellSize *5;
      
      if(entX > vpX -margin && entX < vpX +vpWidth  +margin
      && entY > vpY -margin && entY < vpY +vpHeight +margin) {

         return true;
      }

      return false;
   }


   // =========================================================================================
   // Grid / Screen conversions
   // =========================================================================================
   screenPos_toGridPos(screenPos: IPosition): IPosition {

      const { x: screenX, y: screenY }: IPosition = screenPos;
      
      const screenY_2x: number = screenY *2;

      // Isometric <== Cartesian
      return {
         x:  Math.floor( (screenX -screenY_2x) /this.COS_45 *0.5 ) +this.halfGrid,
         y:  Math.floor( (screenX +screenY_2x) /this.COS_45 *0.5 ) -this.halfGrid,
      }
   }

   gridPos_toScreenPos(gridPos: IPosition): IPosition {

      const { x: gridX,   y: gridY   }: IPosition = gridPos;
      const { x: offsetX, y: offsetY }: IPosition = this.viewfieldPos;

      // Cartesian <== Isometric
      const tempX = Math.floor( (gridX +gridY         ) *this.COS_45 );
      const tempY = Math.floor( (gridY +this.ViewAngle) *this.COS_45 *2 -tempX ) *0.5;
      
      return {
         x: Math.floor( tempX +offsetX ),
         y: Math.floor( tempY +offsetY ),
      };
   }

   
   // =========================================================================================
   // Methods
   // =========================================================================================
   createNewAgent( // =======>  Super tempory ==> Need huge recast
      divisionName: string,
      typeName:     string,
      cellID:       string,
      diffImgSrc:   string,
   ) {
      const division:  any    = this.unitParams   [divisionName];
      const unitType:  any    = division.unitType [typeName];
      const vacantID:  number = this.vacantIDsList[0];
      const startCell: Cell   = this.Grid.cellsList.get(cellID)!;

      startCell.isVacant = false;
      startCell.agentIDset.add(vacantID);

      this.Grid.addToOccupiedMap(startCell);
      this.curPop += division.popCost;
      this.vacantIDsList.splice(0, division.popCost);

      let imgSrc = unitType.imgSrc;
      if(diffImgSrc !== "") imgSrc = diffImgSrc;

      // Set agent position
      const { x: cellX, y: cellY } = startCell.center;
      const position = { x: cellX, y: cellY }; // Tempory until create rally point !

      const newAgent = new Agent({
         id:          vacantID,
         collider:    division.collider,
         position,
         startCell,   // <== Tempory until create BuildingsClass with spawn position
         unitType,
         imgSrc,
         moveSpeed:   unitType.moveSpeed,
         popCost:     division.popCost,
      });
      
      this.agentsList.set(vacantID, newAgent);
   }

   setAgentCollider(agent: Agent): ICircle {

      const { x: agentX, y: agentY  } = this.gridPos_toScreenPos(agent.position);
      const { x: vpX,    y: vpY     } = this.Viewport;
      const { radius,       offsetY } = agent.collider;

      return {
         x: agentX -vpX,
         y: agentY -vpY +offsetY,
         radius,
      };
   }

   unitSelection() {
      const { isSelecting, selectArea, curPos } = this.Cursor;

      // If collide with mouse or select area ==> Add agent to CurrentList
      for(const [, agent] of this.agentsList) {
         const agentCol = this.setAgentCollider(agent);
         
         if(isSelecting
         && this.Collision.square_toCircle(selectArea,  agentCol) 
         || this.Collision.point_toCircle (curPos.cart, agentCol)) {
            
            this.curSelectList.add(agent);
         }
         else this.curSelectList.delete(agent);
      }
   }

   unitDiselection() {

      this.clearCanvas("selection");
      
      // If OldList === Empty ==> Set OldList
      if(this.oldSelectList.size === 0) {
         
         for(const agent of this.curSelectList) {
            this.oldSelectList.add(agent);
         }

         this.curSelectList.clear();

         for(const agent of this.oldSelectList) {
            agent.isSelected = true;
         }
      }


      // If OldList !== Empty && CurrentList !== Empty
      else if(this.curSelectList.size !== 0) {

         // Remove old selected agents
         for(const agent of this.oldSelectList) {

            if(this.curSelectList.has(agent)) continue;

            agent.isSelected = false;
            this.oldSelectList.delete(agent);
         }

         // Add new selected agents
         for(const agent of this.curSelectList) {

            agent.isSelected = true;
            this.oldSelectList.add(agent);
            this.curSelectList.delete(agent);
         }
      }


      // If OldList === Empty && CurrentList !== Empty
      else for(const agent of this.oldSelectList) {
         
         if(!agent.isSelected) continue;

         agent.isSelected = false;
         this.oldSelectList.delete(agent);
      }
   }

   setTargetCell(hoverCell_ID: string) {

      if(!this.isMouseGridScope()) return;

      const goalCell = this.Grid.cellsList.get(hoverCell_ID)!;
      
      if(goalCell.isBlocked || !goalCell.isVacant) return;
      
      for(const agent of this.oldSelectList) {
         
         agent.Pathfinder.goalCell = goalCell;
         agent.Pathfinder.searchPath(this.Grid.cellsList);
      }
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawSelectUnit() { // ==> Recast later with good selected halo
      
      if(this.oldSelectList.size === 0 ) return;

      for(const agent of this.oldSelectList) {
         const agentPos = this.gridPos_toScreenPos(agent.position);
   
         if(!this.isViewScope(agentPos)) return;
   
         agent.drawSelect(this.Ctx.isometric, "yellow");
      }
   }
   
   drawHoverUnit() {  // ==> Recast later with some agent infos

      if(this.curSelectList.size === 0 ) return;

      for(const agent of this.curSelectList) {
         const agentPos = this.gridPos_toScreenPos(agent.position);
         
         if(!this.isViewScope(agentPos)) return;
         
         agent.drawSelect(this.Ctx.isometric, "blue");
      }
   }
   
   drawTerrain() {   // ==> Tempory until WFC terrain generation

      for(const [, cell] of this.Grid.cellsList) {

         const { x: cellX, y: cellY } = this.gridPos_toScreenPos(cell.center);
         const { x: terX,  y: terY  } = this.terrainPos;

         cell.drawTile(
            this.Ctx.terrain,
            { x: cellX + terX, y: cellY + terY },
            this.flatG_Img,
            this.highG_Img
         );
      }
   }

   draw_UnitsAndBuild() {

      const {
         assets:    ctx_assets,
         isometric: ctx_isometric,
      } = this.Ctx;

      for(const cell of this.Grid.occupiedCells) {

         // Draw all units
         if(cell.agentIDset.size > 0) {
            
            for(const agentID of cell.agentIDset) {

               const agent    = this.agentsList.get(agentID)!;
               const agentPos = this.gridPos_toScreenPos(agent.position);
         
               agent.walkPath(this.Grid);
               agent.updateAnimState(this.Frame);
            
               if(!this.isViewScope(agentPos)) continue;
            
               agent.drawSprite(ctx_assets, agentPos, this.Viewport);
               // agent.drawCollider(ctx_assets, agentPos, this.Viewport);
               if(!this.HideGrid) agent.drawPath(ctx_isometric);
            }
         }

         // Draw all buildings
         if(cell.isBlocked) {
            const cellPos = this.gridPos_toScreenPos(cell.center);

            if(!this.isViewScope(cellPos)) continue;

            if(cell.isTransp) {
               ctx_assets.save();
               ctx_assets.globalAlpha = 0.5;
               
               cell.drawWall(ctx_assets, cellPos, this.Viewport, this.walls_Img);

               ctx_assets.restore();
               return;
            }

            cell.drawWall(ctx_assets, cellPos, this.Viewport, this.walls_Img);
         }
      }
   }


   // =========================================================================================
   // Test Methods   ==>   To delete later
   // =========================================================================================
   Test_Rand(maxValue: number): number {

      return Math.floor( Math.random() *maxValue );
   }

   Test_PathRandomize(agent: Agent) {
      
      const { gridSize, cellSize } = this;
      const cellPerSide = Math.floor(gridSize / cellSize);
      
      let i = this.Test_Rand(cellPerSide);
      let j = this.Test_Rand(cellPerSide);
      
      const targetCell = this.Grid.cellsList.get(`${i}-${j}`)!;
      
      if(targetCell.isBlocked) return;
      
      agent.Pathfinder.goalCell = targetCell;
      agent.Pathfinder.searchPath(this.Grid.cellsList);
   }

   Test_GenerateUnits() {

      let pop = 30;

      const { gridSize, cellSize } = this;
      const cellPerSide = Math.floor(gridSize / cellSize);

      const blue   = "Units/Swordsman_Blue.png";
      const purple = "Units/Swordsman_Purple.png";
      const red    = "Units/Swordsman_Red.png";
      
      while(pop > 0) {

         let unitType = this.Test_Rand(2);
         let index    = this.Test_Rand(4);
         let i        = this.Test_Rand(cellPerSide);
         let j        = this.Test_Rand(cellPerSide);

         if( this.Grid.cellsList.get(`${i}-${j}`)!.isVacant
         && !this.Grid.cellsList.get(`${i}-${j}`)!.isBlocked) {

            let color = "";

            if(index === 0) color = blue;
            if(index === 1) color = purple;
            if(index === 2) color = red;

            if(unitType === 0) this.createNewAgent("infantry", "swordsman", `${i}-${j}`, color);
            if(unitType === 1) this.createNewAgent("infantry", "worker",    `${i}-${j}`, ""   );
            
            this.Grid.cellsList.get(`${i}-${j}`)!.isVacant = false;
            pop--;

            this.curPop++;
         }
         
         else continue;
      }
   }

   Test_SetWallsList = () => {

      walls.forEach((cellID) => {
         const cell:     Cell      = this.Grid.cellsList.get(cellID)!;
         const { x, y }: IPosition = this.gridPos_toScreenPos(cell.center);
         
         cell.isBlocked   = true;
         cell.screenPos.x = x;
         cell.screenPos.y = y;
   
         this.Grid.addToOccupiedMap(cell);
      });
   }
   
}