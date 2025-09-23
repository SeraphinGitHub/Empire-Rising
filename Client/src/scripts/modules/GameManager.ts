
import {
   ICanvas,
   ICtx,
   ICircle,
   IPosition,
   ISize,
   ISquare,
} from "../utils/interfaces";

import {
   Grid,
   Cell,
   Agent,
} from "../classes/_Export"

import {
   Cursor,
   Viewport,
   Collision,
} from "./_Export"

import { Socket } from "socket.io-client";


// =====================================================================
// Game Manager Class
// =====================================================================
export class GameManager {

   UNIT_STATS:       any;
   WALLS:            string[]   = [];
   TILES:            string[]   = [];

   Canvas:           ICanvas;
   Ctx:              ICtx;
   socket:           Socket;

   lastUpdate:       number     = 0;
   interval:         number     = 0;
   cellSize:         number     = 0;
   gridSize:         number     = 0;
   halfGrid:         number     = 0;
   maxPop:           number     = 0;
   curPop:           number     = 0;

   // Constants ==> Do not modify
   Frame:            number     = 0;
   ViewAngle:        number     = 0;
   COS_45:           number     = 0.707;
   COS_30:           number     = 0.866;
   
   teamID:           number     = 0;
   teamColor:        string     = "";
   name:             string     = "";


   unitsList:        Map<number, Agent> = new Map();
   // buildsList:       Map<number, Building> = new Map();

   oldSelectList:    Set<Agent> = new Set();
   curSelectList:    Set<Agent> = new Set();
   
   gridPos:          IPosition  = {x:0, y:0};
   terrainPos:       IPosition  = {x:0, y:0};
   viewfieldPos:     IPosition  = {x:0, y:0};

   show_Grid:        boolean    = true;
   show_VP:          boolean    = false;
   isWallMode:       boolean    = false;
   isUnitMode:       boolean    = false;
   
   // Classes instances
   Grid:             Grid;
   Cursor:           Cursor;
   Viewport:         Viewport;
   Collision:        Collision;
   

   // Images & Sources ==> Need to move in a dedicated class later 
   flatG_Img: HTMLImageElement = new Image();
   highG_Img: HTMLImageElement = new Image();
   walls_Img: HTMLImageElement = new Image();

   flatG_Src: string = "Terrain/Flat_Grass.png";
   highG_Src: string = "Terrain/High_Grass.png";
   walls_Src: string = "Buildings/wall.png";

   isFlatG_Loaded: boolean = false;
   isHighG_Loaded: boolean = false;
   isWalls_Loaded: boolean = false;

   
   constructor(
      Canvas:   ICanvas,
      Ctx:      ICtx,
      socket:   Socket,
      initPack: any,
   ) {
      
      // ***************  Temp  ***************
      this.flatG_Img.src = this.flatG_Src;
      this.highG_Img.src = this.highG_Src;
      this.walls_Img.src = this.walls_Src;
      // ***************  Temp  ***************

      this.Canvas     = Canvas;
      this.Ctx        = Ctx;
      this.socket     = socket;
      this.cellSize   = initPack.gridPack.cellSize;
      this.gridSize   = initPack.gridPack.gridSize;
      this.halfGrid   = this.gridSize *0.5;

      this.Viewport   = new Viewport  (this);
      this.Grid       = new Grid      (this);
      this.Cursor     = new Cursor    (this);
      this.Collision  = new Collision ();
      
      this.init(initPack);
   }

   init({ battlePack, playerPack }: any) {

      this.initPlayer (playerPack);
      this.initGame   (battlePack);
      this.initUnits  (battlePack);
      // this.initBuilds ();
      this.initMap    ();

      this.watchGame  ();
   }

   watchGame() {

      this.socket.on("updatePop",   (data: any) => this.updatePop      (data));
      this.socket.on("recruitUnit", (data: any) => this.createNewAgent (data));
      this.socket.on("moveAgent",   (data: any) => this.setAgentTarget (data));
      this.socket.on("getAgentPos", (data: any) => this.checkAgentPos  (data));
   }

   initPlayer(playerPack: any) {

      this.name       = playerPack.name;
      this.teamID     = playerPack.teamID;
      this.teamColor  = playerPack.teamColor;
   }
   
   initGame(battlePack: any) {

      this.interval   = Math.floor(1000 / battlePack.frameRate);
      this.maxPop     = battlePack.maxPop;
      this.UNIT_STATS = battlePack.UNIT_STATS;
      this.WALLS      = battlePack.WALLS; // ==> Tempory
      this.TILES      = battlePack.TILES; // ==> Tempory
   }

   initUnits(battlePack: any) {

      for(const unit of battlePack.unitsList) {
         this.createNewAgent(unit);
      }
   }

   initBuilds() {
      // this.buildsList = battlePack.buildsList;
   }

   initMap() {
      
      this.setCanvasSize    ();
      this.setViewAngle     ();
      this.setTerrainPos    ();
      this.setViewfieldPos  ();
      

      // **********************************  Tempory  **********************************
      this.TEST_SetWallsList();
      this.TILES.forEach((ID: string) => this.getCell(ID)!.isDiffTile = true);
      
      this.flatG_Img.addEventListener("load", () => this.isFlatG_Loaded = true);
      this.highG_Img.addEventListener("load", () => this.isHighG_Loaded = true);
      this.walls_Img.addEventListener("load", () => this.isWalls_Loaded = true);
      
      const loadTerrain = setInterval(() => {
         
         if(!this.isFlatG_Loaded
         || !this.isHighG_Loaded
         || !this.isWalls_Loaded) {
            return;
         }
         
         this.drawTerrain();
         clearInterval(loadTerrain);
         
      }, 50);
      // **********************************  Tempory  **********************************

      requestAnimationFrame((now) => this.runAnimation(now));
   }

   runAnimation(now: number) {

      const delta = now -this.lastUpdate;

      if(delta >= this.interval) {
         this.lastUpdate = now - (delta % this.interval); // remove drift
         
         this.Frame++;
      
         this.clearCanvas("isometric");
         this.clearCanvas("assets"   );
         
         this.drawHoverUnit      ();
         this.drawSelectUnit     ();
         this.draw_UnitsAndBuild ();
         
         this.Grid     .update   (this);
         this.Cursor   .update   (this);
         this.Viewport .update   (this);
      }

      requestAnimationFrame((newTime) => this.runAnimation(newTime));
   }

   setHtmlData() {

      const { x, y                    } = this.Viewport;
      const { curPos, hoverCell       } = this.Cursor;
      const { curPop, maxPop, gridPos } = this;
      
      return {
         curPop,
         maxPop,
         gridPos,
         hoverCell: hoverCell ? hoverCell : { id: "null", x: 0, y: 0 },
         cartPos: curPos.cart,
         viewPort: { x, y },
      }
   }


   // =========================================================================================
   // Terrain & Canvas
   // =========================================================================================
   getWorldSize      (): ISize{

      const hypot:   number = this.gridSize;
      const degrees: number = 26.565;  // ==> Fake isometric angle value
      const radians: number = degrees * (Math.PI / 180);

      return {
         width:  Math.floor( hypot * Math.cos(radians) *2 ) +50, // +50 ==> some margin
         height: Math.floor( hypot * Math.sin(radians) *2 ) +50, // +50 ==> some margin
      }
   }

   setCanvasSize     () {
      
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

   setViewAngle      () {

      this.ViewAngle = this.gridSize *0.5 -(this.cellSize *this.COS_45 *this.COS_30);
   }

   setTerrainPos     () {
      
      const { width, height }: ISize = this.getWorldSize();

      this.terrainPos = {
         x:  Math.floor( (width  -this.Viewport.width ) *0.5 ),
         y:  Math.floor( (height -this.Viewport.height) *0.5 ),
      }
   }

   setViewfieldPos   () {
      
      const diagOffset:    number = this.gridSize *this.COS_45;
      const half_vpWidth:  number = this.Viewport.width  *0.5;
      const half_vpHeight: number = this.Viewport.height *0.5;

      this.viewfieldPos.x = half_vpWidth  -diagOffset;
      this.viewfieldPos.y = half_vpHeight -diagOffset *0.5 +(this.cellSize *0.5 *this.COS_30);
   }

   clearCanvas       (canvasName: string) {

      const { width, height } = (canvasName === "isometric")
      ? { width: this.gridSize,       height: this.gridSize        }
      : { width: this.Viewport.width, height: this.Viewport.height };

      this.Ctx[canvasName].clearRect(0, 0, width, height);
   }


   // =========================================================================================
   // Boolean methods
   // =========================================================================================
   isMouseGridScope  (): boolean {
      
      const { gridSize,  gridPos   } = this;
      const { x: mouseX, y: mouseY } = gridPos;
      
      if(mouseX > 0 && mouseX < gridSize
      && mouseY > 0 && mouseY < gridSize) {

         return true;
      }

      return false;
   }

   isViewScope       (entityPos: IPosition): boolean {

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
   updatePop(data: any) {
      
      if(typeof(data) == "number") this.curPop = data;
   }

   setAgentsID_List() {

      let agentsID_List = [];

      for(const agent of this.oldSelectList) {

         agentsID_List.push( agent.id );
      }

      return agentsID_List;
   }

   getCell           (id: string): Cell | undefined {
      return this.Grid.cellsList.get(id);
   }

   setAgentCollider  (agent: Agent): ICircle {

      const { x: agentX, y: agentY  } = this.gridPos_toScreenPos(agent.position);
      const { x: vpX,    y: vpY     } = this.Viewport;
      const { radius,       offsetY } = agent.collider;

      return {
         x: agentX -vpX,
         y: agentY -vpY +offsetY,
         radius,
      };
   }

   unitSelection     () {
      const { isSelecting, selectArea, curPos } = this.Cursor;

      // If collide with mouse or select area ==> Add agent to CurrentList
      for(const [, agent] of this.unitsList) {
         const agentCol = this.setAgentCollider(agent);
         
         if(isSelecting
         && this.Collision.square_toCircle(selectArea,  agentCol) 
         || this.Collision.point_toCircle (curPos.cart, agentCol)) {
            
            if(agent.teamID === this.teamID) this.curSelectList.add(agent);
         }
         else this.curSelectList.delete(agent);
      }
   }

   unitDiselection   () {

      this.clearCanvas("selection");
      
      // If OldList === Empty ==> Set OldList
      if(this.oldSelectList.size === 0) {
         
         for(const agent of this.curSelectList) {
            agent.isSelected = true;
            this.oldSelectList.add(agent);
         }

         this.curSelectList.clear();
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

   createNewAgent(unit: any) {

      const curCell = this.getCell(unit.curCellID)!;

      const newAgent = new Agent({
         id:               unit.id,
         playerID:         unit.playerID,
         teamID:           unit.teamID,
         teamColor:        unit.teamColor,
         position:         unit.position,
         curCell,

         stats: {
            popCost:       unit.popCost,        
            collider:      unit.collider,
            health:        unit.health,
            armor:         unit.armor,
            damages:       unit.damages,
            moveSpeed:     unit.moveSpeed,
            buildSpeed:    unit.buildSpeed,
            attackSpeed:   unit.attackSpeed,
            animDelay:     unit.animDelay,
            basePath:      unit.basePath,
         },
      });


      curCell.agentIDset.add(unit.id);
      this.Grid.addToOccupiedMap(curCell);
      this.unitsList.set(unit.id, newAgent);
   }

   setAgentTarget(data: any) {

      const { id, pathID }: any      = data;
      const agent: Agent | undefined = this.unitsList.get(id);
      
      if(!agent) return;

      agent.pathID  = pathID;
      agent.path    = [];
      agent.setNextCell(this.getCell.bind(this));
      agent.setGoalCell(this.getCell.bind(this));

      if(pathID.length === 0) agent.inMovement(false);

      pathID.forEach((ID: string) => agent.path.push( this.getCell(ID)! ));
   }

   checkAgentPos(data: any) {

      const { id, pos }: any         = data;
      const agent: Agent | undefined = this.unitsList.get(id);
      
      if(!agent) return;

      agent.servPos.x = pos.x;
      agent.servPos.y = pos.y;
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawSelectUnit    () { // ==> Recast later with good selected halo
      
      if(this.oldSelectList.size === 0 ) return;

      for(const agent of this.oldSelectList) {
         const agentPos = this.gridPos_toScreenPos(agent.position);
   
         if(!this.isViewScope(agentPos)) return;
   
         agent.drawSelect(this.Ctx.isometric, "yellow");
      }
   }
   
   drawHoverUnit     () {  // ==> Recast later with some agent infos

      if(this.curSelectList.size === 0 ) return;

      const {
         assets:    ctx_assets,
         isometric: ctx_isometric,
      } = this.Ctx;

      for(const agent of this.curSelectList) {
         const agentPos = this.gridPos_toScreenPos(agent.position);
         
         if(!this.isViewScope(agentPos)) return;
         
         agent.drawSelect(ctx_isometric, "blue");
         agent.drawInfos (ctx_assets, agentPos, this.Viewport);
      }
   }
   
   drawTerrain       () {   // ==> Tempory until WFC terrain generation

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

      const { Viewport, Frame, walls_Img } = this;

      for(const cell of this.Grid.occupiedCells) {

         // Draw all units
         if(cell.agentIDset.size > 0) {
            
            for(const agentID of cell.agentIDset) {

               const agent    = this.unitsList.get(agentID)!;
               const agentPos = this.gridPos_toScreenPos(agent.position);
         
               agent.walkPath(this.getCell.bind(this));
               agent.updateAnimState(Frame);
               
               if(!this.isViewScope(agentPos)) continue;
               
               // agent.drawPos      (ctx_isometric);
               agent.drawSprite   (ctx_assets, agentPos, Viewport);
               // agent.drawCollider (ctx_assets, agentPos, Viewport);

               if(this.show_Grid) agent.drawPath(ctx_isometric);
            }
         }
                  
         // Draw all buildings
         if(cell.isBlocked) {
            const cellPos = this.gridPos_toScreenPos(cell.center);

            if(!this.isViewScope(cellPos)) continue;

            if(cell.isTransp) {
               ctx_assets.save();
               ctx_assets.globalAlpha = 0.5;
               
               cell.drawWall(ctx_assets, cellPos, Viewport, walls_Img);

               ctx_assets.restore();
               return;
            }

            cell.drawWall(ctx_assets, cellPos, Viewport, walls_Img);
         }
      }
   }


   // =========================================================================================
   // Test Methods   ==>   To delete later
   // =========================================================================================
   TEST_Rand         (maxValue: number): number {

      return Math.floor( Math.random() *maxValue );
   }

   TEST_PathRandomize(agent: Agent) {
      
      const { gridSize, cellSize } = this;
      const cellPerSide = Math.floor(gridSize / cellSize);
      
      let i = this.TEST_Rand(cellPerSide);
      let j = this.TEST_Rand(cellPerSide);
      
      const targetCell = this.getCell(`${i}-${j}`)!;
      
      if(targetCell.isBlocked) return;
      
      // agent.Pathfinder.goalCell = targetCell;
      // agent.Pathfinder.searchPath(this.Grid.cellsList);
   }

   TEST_GenerateUnits() {

      // let pop = 30;

      // const { gridSize, cellSize } = this;
      // const cellPerSide = Math.floor(gridSize / cellSize);

      // const blue   = "Units/Swordsman_Blue.png";
      // const purple = "Units/Swordsman_Purple.png";
      // const red    = "Units/Swordsman_Red.png";
      
      // while(pop > 0) {

      //    let unitType = this.TEST_Rand(2);
      //    let index    = this.TEST_Rand(4);
      //    let i        = this.TEST_Rand(cellPerSide);
      //    let j        = this.TEST_Rand(cellPerSide);

      //    if( this.getCell(`${i}-${j}`)!.isVacant
      //    && !this.getCell(`${i}-${j}`)!.isBlocked) {

      //       let color = "";

      //       if(index === 0) color = blue;
      //       if(index === 1) color = purple;
      //       if(index === 2) color = red;

      //       if(unitType === 0) this.createNewAgent("infantry", "swordsman", `${i}-${j}`, color);
      //       if(unitType === 1) this.createNewAgent("infantry", "worker",    `${i}-${j}`, ""   );
            
      //       this.getCell(`${i}-${j}`)!.isVacant = false;
      //       pop--;

      //       this.curPop++;
      //    }
         
      //    else continue;
      // }
   }

   TEST_SetWallsList () {

      this.WALLS.forEach((cellID: string) => {
         const cell:     Cell      = this.getCell(cellID)!;
         const { x, y }: IPosition = this.gridPos_toScreenPos(cell.center);
         
         cell.isBlocked   = true;
         cell.screenPos.x = x;
         cell.screenPos.y = y;
   
         this.Grid.addToOccupiedMap(cell);
      });
   }
   
   TEST_UnitMode     () {

      if(!this.isUnitMode) return;
      
      this.socket.emit("recruitUnit", {
         unitID: "_0101",
         cellID:  this.Cursor.hoverCell!.id,
      });
   }

}