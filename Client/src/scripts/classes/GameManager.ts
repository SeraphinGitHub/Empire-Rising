
import {
   ICanvas,
   ICtx,
   IPosition,
   IPositionList,
   ISize,
   ISquare,
} from "../utils/interfaces";

import {
   Grid,
   Cell,
   Agent,
   Cursor,
   Viewport,
} from "../classes/_Export"

import { Collision  } from "../modules/collision";
import { unitParams } from "../utils/unitParams";


// =====================================================================
// Game Manager Class
// =====================================================================
export class GameManager {

   faction:          string = "Orange";

   cellSize:         number = 40;
   gridSize:         number = 1600;
   curPop:           number = 0;
   maxPop:           number = 2000;

   Canvas:           ICanvas;
   Ctx:              ICtx;

   agentsList:       Map<number, Agent> = new Map();
   vacantIDsList:    number[]      = [];
   oldSelectList:    Set<Agent>    = new Set();
   curSelectList:    Set<Agent>    = new Set();
   isoComputed:      DOMMatrix     = new DOMMatrix();
   terComputed:      DOMMatrix     = new DOMMatrix();
   
   gridPos:          IPosition     = { x: 0, y: 0 };
   offset:           IPositionList = {
      terrain:       { x: 0, y: 0 },
      viewport:      { x: 0, y: 0 },
      scroll:        { x: 0, y: 0 },
   };

   // Constants ==> Do not modify
   ViewAngle:        number = 0;
   COS_45:           number = 0.707;
   COS_30:           number = 0.866;
   max_X:            number = 0.7;
   max_Y:            number = 0.7 *0.5;

   // Classes instances
   Grid:             Grid;
   Cursor:           Cursor;
   Viewport:         Viewport;


   // Images & Sources ==> Need to move in a dedicated class later 
   flatG_Img: HTMLImageElement = new Image();
   highG_Img: HTMLImageElement = new Image();
   walls_Img: HTMLImageElement = new Image();

   flatG_Src: string = "Terrain/Flat_Grass.png";
   highG_Src: string = "Terrain/High_Grass.png";
   walls_Src: string = "Buildings/wall.png";


   constructor(params: any) {

      this.Canvas   = params.Canvas;
      this.Ctx      = params.Ctx;
      
      this.Grid     = new Grid     (this);
      this.Cursor   = new Cursor   (this);
      this.Viewport = new Viewport (this);

   }


   // =========================================================================================
   // Terrain & Canvas
   // =========================================================================================
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

   getWorldSize(): ISize{

      const hypot:   number = this.gridSize;
      const degrees: number = 26.565;  // ==> Fake isometric angle value
      const radians: number = degrees * (Math.PI / 180);

      return {
         width:  Math.floor( hypot * Math.cos(radians) *2 ) +50, // +50 ==> some margin
         height: Math.floor( hypot * Math.sin(radians) *2 ) +50, // +50 ==> some margin
      }
   }

   setViewAngle() {

      this.ViewAngle = this.gridSize *0.5 -(this.cellSize *this.COS_45 *this.COS_30);
   }

   setTerrainOffset() {
      
      const { width, height }: ISize = this.getWorldSize();

      this.offset.terrain = {
         x:  Math.floor( (width  -this.Viewport.width ) *0.5 ),
         y:  Math.floor( (height -this.Viewport.height) *0.5 ),
      }
   }

   setViewportOffset() {
      
      const diagOffset:    number = this.gridSize *this.COS_45;
      const half_vpWidth:  number = this.Viewport.width  *0.5;
      const half_vpHeight: number = this.Viewport.height *0.5;

      this.offset.viewport.x = half_vpWidth  -diagOffset;
      this.offset.viewport.y = half_vpHeight -diagOffset *0.5 +(this.cellSize *0.5 *this.COS_30);
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
   isGridScope(): boolean {

      const { x: gridX, y: gridY }: IPosition = this.gridPos;

      if(gridX > 0 && gridX < this.gridSize
      && gridY > 0 && gridY < this.gridSize) {

         return true;
      }

      return false;
   }

   isViewScope(): boolean {

      const {
         x:        vpX,
         y:        vpY,
         width:    vpWidth,
         height:   vpHeight
      }: ISquare = this.Viewport;

      const { x: gridX,    y: gridY   }: IPosition = this.gridPos;
      const { x: scrollX,  y: scrollY }: IPosition = this.offset.scroll;

      const originX: number = vpX -scrollX;
      const originY: number = vpY -scrollY;

      if(gridX >= originX && gridX <= originX +vpWidth
      && gridY >= originY && gridY <= originY +vpHeight) {

         return true;
      }

      return false;
   }


   // =========================================================================================
   // Grid / Screen conversions
   // =========================================================================================
   screenPos_toGridPos(screenPos: IPosition) {

      const { x: screenX, y: screenY }: IPosition = screenPos;
      
      const screenY_2x:     number = screenY *2;
      const half_GridWidth: number = this.gridSize *0.5;

      // Isometric <== Cartesian
      this.gridPos = {
         x:  Math.floor( (screenX -screenY_2x) /this.COS_45 *0.5 ) +half_GridWidth,
         y:  Math.floor( (screenX +screenY_2x) /this.COS_45 *0.5 ) -half_GridWidth,
      };
   }

   gridPos_toScreenPos(gridPos: IPosition): IPosition {

      const { x: gridX,   y: gridY   }: IPosition = gridPos;
      const { x: offsetX, y: offsetY }: IPosition = this.offset.viewport;

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
      typeName :    string,
      cellID:       string,
      diffImgSrc:   string,
   ) {

      const unitParameters: any = unitParams;

      const vacantID:  number = this.vacantIDsList[0];
      const division:  any    = unitParameters[divisionName];
      const unitType:  any    = division.unitType[typeName];
      const startCell: Cell   = this.Grid.cellsList.get(cellID)!;
      
      let imgSrc = unitType.imgSrc;
      if(diffImgSrc !== "") imgSrc = diffImgSrc;

      this.curPop += division.popCost;
      this.vacantIDsList.splice(0, division.popCost);

      const agentParams = {
         id:          vacantID,
         unitType,
         imgSrc,
         moveSpeed:   unitType.moveSpeed,
         popCost:     division.popCost,
         collider:    division.collider,
         startCell,   // <== Tempory until create BuildingsClass with spawn position
      };
      
      this.agentsList.set(vacantID, new Agent(agentParams));
   }

   updateUnitsList (
      collisionType: Function,
      first:         any,
      second:        any,
      agent:         Agent,
   ) {

      if(collisionType(first, second)) {
         return this.curSelectList.add(agent);
      }
      
      this.curSelectList.delete(agent);
   }

   unitSelection() {

      if(this.Cursor.isSelecting) {

         this.clearCanvas("selection");

         this.Cursor.drawSelectArea();
      }

      // If collide with mouse or select area ==> Add agent to CurrentList
      for(const [ id, agent ] of this.agentsList) {
         
         const { x: agentX,  y: agentY  }: IPosition = this.gridPos_toScreenPos(agent.position);
         const { x: scrollX, y: scrollY }: IPosition = this.offset.scroll;
         const { radius,        offsetY } = agent.collider;

         // Agent collider
         const agentCollider = {
            x:      agentX +scrollX,
            y:      agentY +scrollY +offsetY,
            radius,
         };

         if(this.Cursor.isSelecting) {
              this.updateUnitsList(Collision.square_toCircle, this.Cursor.selectArea,  agentCollider, agent);
         }
         else this.updateUnitsList(Collision.point_toCircle,  this.Cursor.curPos.cart, agentCollider, agent);
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

   setTarget(hoverCell_ID: string) {

      if(!this.isGridScope()) return;

      for(const agent of this.oldSelectList) {
         const goalCell = this.Grid!.cellsList.get(hoverCell_ID)!;

         if(goalCell.isBlocked || !goalCell.isVacant) return;
         
         agent.goalCell = goalCell;
         agent.searchPath();
      }
   }

   


}