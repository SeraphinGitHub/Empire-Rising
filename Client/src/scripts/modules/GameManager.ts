
import {
   ICanvas,
   ICtx,
   ICircle,
   IPosition,
   ISize,
   ISquare,
   INumber,
} from "../utils/interfaces";

import {
   Agent,
   Building,
   Cell,
   Grid,
   Node,
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

   BUILD_STATS:            any;
   UNIT_STATS:             any;
   NODE_STATS:             any;

   TILES:                  any; // ==> Tempory

   Canvas:                 ICanvas;
   Ctx:                    ICtx;
   socket:                 Socket;
   
   lastUpdate:             number     = 0;
   interval:               number     = 0;
   cellSize:               number     = 0;
   gridSize:               number     = 0;
   halfGrid:               number     = 0;
   maxPop:                 number     = 0;
   curPop:                 number     = 0;

   // Constants ==> Do not modify
   Frame:                  number     = 0;
   ViewAngle:              number     = 0;
   COS_45:                 number     = 0.707;
   COS_30:                 number     = 0.866;
   
   playerYield:            INumber    = {};
   teamID:                 number     = -1;
   teamColor:              number     = -1;
   name:                   string     = "";
   buildType:              string     = "";
   wallsListID:            string[]   = [];

   gridPos:                IPosition  = {x:0, y:0};
   terrainPos:             IPosition  = {x:0, y:0};
   viewfieldPos:           IPosition  = {x:0, y:0};
   
   show_Grid:              boolean    = false;
   show_VP:                boolean    = false;
   
   isUnitMode:             boolean    = false;
   isBuildMode:            boolean    = false;
   isWallMode:             boolean    = false;
   
   unitsList:              Map<number, Agent>    = new Map();
   unitSelectList_old:     Set<Agent>            = new Set();
   unitSelectList_cur:     Set<Agent>            = new Set();
   
   nodesList:              Map<number, Node>     = new Map();
   nodeSelectList_old:     Set<Node>             = new Set();
   nodeSelectList_cur:     Set<Node>             = new Set();
   
   buildsList:             Map<number, Building> = new Map();
   buildSelectList_old:    Set<Building>         = new Set();
   buildSelectList_cur:    Set<Building>         = new Set();

   ghostBuild:             Building | null       = null;

   ringImg:                any = {
      img:        Object.assign(new Image(), { src: "/GUI/ring.png" }),
      spriteSize: 510,
   }
   
   // Classes instances
   Grid:                   Grid;
   Cursor:                 Cursor;
   Viewport:               Viewport;
   Collision:              Collision;
   

   // ***************  Temp  ***************
   // Images & Sources ==> Need to move in a dedicated class later 
   flatG_Img:              HTMLImageElement = new Image();
   highG_Img:              HTMLImageElement = new Image();

   flatG_Src:              string = "Terrain/Flat_Grass.png";
   highG_Src:              string = "Terrain/High_Grass.png";

   isFlatG_Loaded:         boolean = false;
   isHighG_Loaded:         boolean = false;
   // ***************  Temp  ***************


   
   constructor(
      Canvas:   ICanvas,
      Ctx:      ICtx,
      socket:   Socket,
      initPack: any,
   ) {
      
      // ***************  Temp  ***************
      this.flatG_Img.src = this.flatG_Src;
      this.highG_Img.src = this.highG_Src;
      // ***************  Temp  ***************

      this.Canvas     = Canvas;
      this.Ctx        = Ctx;
      this.socket     = socket;
      this.cellSize   = initPack.gridPack.cellSize;
      this.gridSize   = initPack.gridPack.gridSize;
      this.halfGrid   = this.gridSize *0.5;

      this.Viewport   = new Viewport  (this);
      this.Cursor     = new Cursor    (this);
      this.Grid       = new Grid      ();
      this.Collision  = new Collision ();
      
      this.init(initPack);
   }

   init({ battlePack, playerPack }: any) {

      this.initPlayer    (playerPack);
      this.initGame      (battlePack);
      // this.generateList  (battlePack.unitsList,  this.unitsList,  Agent    );
      this.generateList  (battlePack.buildsList, this.buildsList, Building);
      this.generateList  (battlePack.nodesList,  this.nodesList,  Node    );
      this.initMap       ();

      this.watchGame     ();
   }

   watchGame() {

      this.socket.on("updatePop",     (data: any) => this.updatePop       (data));
      this.socket.on("updateYield",   (data: any) => this.updateYield     (data));
      this.socket.on("serverSync",    (data: any) => this.syncWithServer  (data));
      this.socket.on("recruitUnit",   (data: any) => this.createNewElem   (data, this.unitsList,  Agent   ));
      this.socket.on("placeBuilding", (data: any) => this.createNewElem   (data, this.buildsList, Building));
      this.socket.on("updateCells",   (data: any) => this.Grid.updateCell (data));
   }

   initPlayer(playerPack: any) {

      this.name        = playerPack.name;
      this.teamID      = playerPack.teamID;
      this.teamColor   = playerPack.teamColor;
      this.playerYield = playerPack.yield;
   }
   
   initGame(battlePack: any) {

      this.Grid.init        (battlePack.cellsList);

      this.interval        = Math.floor(1000 / battlePack.frameRate);
      this.maxPop          = battlePack.maxPop;
      this.BUILD_STATS     = battlePack.BUILD_STATS;
      this.UNIT_STATS      = battlePack.UNIT_STATS;
      this.NODE_STATS      = battlePack.NODE_STATS;
      this.TILES           = battlePack.TILES;       // ==> Tempory
   }

   initMap() {
      
      this.setCanvasSize    ();
      this.setViewAngle     ();
      this.setTerrainPos    ();
      this.setViewfieldPos  ();
      

      // **********************************  Tempory  **********************************
      this.TILES.highGrass.forEach((ID: string) => this.getCell(ID)!.isDiffTile = true);
      
      this.flatG_Img.addEventListener("load", () => this.isFlatG_Loaded = true);
      this.highG_Img.addEventListener("load", () => this.isHighG_Loaded = true);
      
      const loadTerrain = setInterval(() => {
         
         if(!this.isFlatG_Loaded
         || !this.isHighG_Loaded) {
            console.log({ Error: "initMap() => Could not pass loadTerrain !" });
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
      
         this.clearCanvas        ("isometric");
         this.clearCanvas        ("assets"   );
         
         this.updateAllAgents    ();
         this.drawViewportElems  ();
         this.drawElemsInfos     ();
         
         this.Grid     .update   (this);
         this.Cursor   .update   (this);
         this.Viewport .update   (this);
      }

      requestAnimationFrame((newTime) => this.runAnimation(newTime));
   }

   setHtmlData() {

      const { x, y                    } = this.Viewport;
      const { curPos, hoverCell       } = this.Cursor;
      const {
         curPop,
         maxPop,
         gridPos,
         playerYield,
      } = this;
      
      return {
         curPop,
         maxPop,
         gridPos,
         playerYield,
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
   updatePop         (data: any) {
      
      if(typeof(data) == "number") this.curPop = data;
   }

   updateYield       (data: any) {
      
      this.playerYield = data;
   }

   updateAllAgents   () {

      for(const [, unit] of this.unitsList) {
      
         unit.update(this.Frame, this.getCell.bind(this));
      }
   } 

   setAgentsID_List  () {

      let agentsID_List = [];

      for(const agent of this.unitSelectList_old) {

         agentsID_List.push( agent.id );
      }

      return agentsID_List;
   }

   getCell           (id: string): Cell | undefined {
      return this.Grid.cellsList.get(id);
   }

   setElemCollider   (elem: Agent | Node): ICircle {

      const { x: elemX, y: elemY } = this.gridPos_toScreenPos(elem.position);
      const { x: vpX,   y: vpY   } = this.Viewport;
      const { radius,   offsetY  } = elem.collider;

      return {
         x: elemX -vpX,
         y: elemY -vpY -offsetY,
         radius,
      };
   }

   generateList      (
      serverList: {[key: string]: any}[],
      clientList: Map<number, any>,
      classType:  new (...args: any[]) => Agent | Node | Building,
   ) {

      for(const initPack of serverList) {

         this.createNewElem(initPack, clientList, classType);
      }
   }

   createNewElem     (
      initPack:   any,
      clientList: Map<number, any>,
      classType:  new (...args: any[]) => Agent | Node | Building,
   ) {
      
      const elemCell: Cell | undefined = this.getCell(initPack.cellID);

      if(!elemCell) return;

      const params: any = {
         ...initPack,
         teamID: this.teamID,
      };

      if(classType === Agent) {
         Object.assign( params,   { curCell: elemCell });
         elemCell.isVacant  = false;
         elemCell.isBlocked = false;
         elemCell.agentIDset.add(initPack.id);
      }
      
      if(classType === Node) {
         elemCell.isNode     = true;
         elemCell.isBlocked  = true;
      }

      if(classType === Building) {
         elemCell.isBuilding = true;
         elemCell.isBlocked  = true;
      }

      const newElem = new classType(params);
      clientList.set(newElem.id, newElem);

      if(newElem instanceof Building) newElem.setZindex({
            i: Math.floor( initPack.position.x /this.cellSize ),
            j: Math.floor( initPack.position.y /this.cellSize ),
         },
         this.getCell.bind(this)
      );
   }

   setRenderList     (): Array<Agent | Node | Building> {
      
      let renderList: Array<Agent | Node | Building> = [];
      const elemsList = [this.unitsList, this.nodesList, this.buildsList];

      if(this.ghostBuild) {
         elemsList.push( new Map([[ this.Cursor.ghostID, this.ghostBuild ]]) );
      }

      for(const allElems of elemsList) {
         for(const elem of allElems.values()) {

            const pos = this.gridPos_toScreenPos(elem.position);
            if(!this.isViewScope(pos)) continue;
      
            if(elem.screenPos.x !== pos.x
            || elem.screenPos.y !== pos.y) {

               elem.screenPos = pos;
            }
      
            if(elem instanceof Agent) {
               const newZindex = elem.position.x -elem.position.y;
               if(elem.zIndex !== newZindex) elem.zIndex = newZindex;
            }
      
            renderList.push(elem);
         }
      }

      return renderList;
   }

   toggleGhostBuild(
      property: string,
      isActive: boolean,
   ) {

      const { hoverCell } = this.Cursor;

      if(!isActive) {
         this.buildType  = "";
         this.ghostBuild = null;
         this.Cursor.clearGhostZone();
         return;
      }

      if(!hoverCell) return;

      this.buildType  = property;
      this.ghostBuild = new Building({
         ...this.BUILD_STATS[this.buildType],
         teamColor: this.teamColor,
         position:  hoverCell.center,
      });

      this.ghostBuild.displayState = this.ghostBuild.imgState.valid;
      this.ghostBuild.zIndex       = -Infinity;
   }

   createBuilding    () {
      
      if(!this.isBuildMode
      ||  this.buildType  === ""
      ||  this.ghostBuild === null) {
         return;
      }

      this.socket.emit("placeBuilding", {
         buildType: this.buildType,
         cellID:    this.Cursor.hoverCell!.id,
         ghostZone: Array.from( this.Cursor.ghostZone, (cell: Cell) => cell.id ), 
      });
   }

   createBuildingWalls() {
      
      if(!this.isBuildMode
      ||  this.ghostBuild         === null
      ||  this.wallsListID.length === 0) {
         return;
      }
      
      this.socket.emit("placeWall", {
         wallsListID: this.wallsListID,
      });
   }

   
   // =========================================================================================
   // Server Sync
   // =========================================================================================
   syncWithServer    (data: any) {

      for(const agentData of data) {
         const { id, cellID }: any = agentData;

         const agent: Agent | undefined = this.unitsList.get(id);
         const cell:  Cell  | undefined = this.getCell(cellID);
         
         if(!agent || !cell) continue;
         
         agent.serverSync(agentData, cell, this.getCell.bind(this));
      }
   }


   // =========================================================================================
   // Draw Methods
   // =========================================================================================
   drawElemsInfos    () {
      
      for(const elem of this.setRenderList()) {
         const elemPos = this.gridPos_toScreenPos(elem.position);
      
         if(!this.isViewScope(elemPos)) continue;

         if(elem.isHover) elem.drawInfos(this.Ctx.assets, elemPos, this.Viewport);
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

   drawViewportElems () {

      const {
         assets:    ctx_assets,
         isometric: ctx_isometric,
      } = this.Ctx;

      const { Viewport, ringImg } = this;

      const renderList: any = [] = this.setRenderList();

      // Top-right to Bottom-left
      renderList.sort((a: any, b: any) => {
         return b.zIndex -a.zIndex;
      });

      
      renderList.forEach((elem: any) => {
         const { screenPos } = elem;
         
         if(elem.isHover
         || elem.isSelected) {

            elem.drawSelect(ctx_assets, screenPos, Viewport, ringImg, elem.isSelected);
         }

         if(elem instanceof Node    ) elem.drawSprite(ctx_assets, screenPos, Viewport);
         if(elem instanceof Building) elem.drawSprite(ctx_assets, screenPos, Viewport);
         if(elem instanceof Agent   ) {
            elem.drawSprite   (ctx_assets, screenPos, Viewport);
            // elem.drawCollider (ctx_assets, screenPos, Viewport);

            if(this.show_Grid) {
               elem.drawPath            (ctx_isometric);
               // elem.drawServerPos       (ctx_isometric);
               // elem.curCell.drawVacancy (ctx_isometric);
            }
         }

         // elem.drawCollider(ctx_assets, screenPos, Viewport);
      });

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
   
   TEST_UnitMode     () {

      if(!this.isUnitMode) return;
      
      this.socket.emit("recruitUnit", {
         unitID:   "swordsman",
         cellID:    this.Cursor.hoverCell!.id,
         teamID:    this.teamID,
         teamColor: this.teamColor,
      });
   }

}