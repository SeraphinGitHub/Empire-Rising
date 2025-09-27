
import {
   Agent,
   Building,
   Cell,
   Grid,
   Node,
   Player,
} from "../classes/_Export";

import { BUILD_STATS    } from "../utils/buildStats";
import { UNIT_STATS     } from "../utils/unitStats";
import { NODE_STATS     } from "../utils/nodeStats";

import { Server, Socket } from "socket.io";
import dotenv             from "dotenv";
dotenv.config();


const TILES = {
   highGrass: [
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
   ],
}

const BUILDINGS = {
   wall: [
      "9-21",
      "9-23",
      "9-25",

      "21-8",
      "22-8",
      "23-8",
      "24-8",
      "25-8",
      "25-9",
      "25-10",
      "25-11",
      "25-12",
      "24-12",
      "23-12",
      "22-12",
      "21-12",
      "21-11",
      "21-10",
      "21-9",
      
      "33-16",
      "34-17",
      "35-18",
      "36-19",
      "34-15",
      "35-14",
      "36-13",
      "37-12",
      "38-13",
      "39-14",
      "40-15",
      "40-15",
      "39-16",
      "38-17",
      "37-18",
   ],
}

const NODES = {
   coal: [
      "26-28",
      "28-42",
      "33-22",
   ],

   gold: [
      "32-11",
      "36-31",
      "14-32",
   ],

   iron: [
      "24-15",
      "21-36",
   ],

   stone: [
      "15-18",
      "40-26",
   ],

   tree: [
      "14-10",
      "11-11",
      "12-12",
      "13-11",
      "13-12",
      "14-12",
      "14-13",
      "08-16",
      "08-18",
      "06-18",
   ]
}


// =====================================================================
// Battle Class
// =====================================================================
export class Battle {

   syncRate:         number = Math.floor( 1000 / Number(process.env.SERVER_FRAME_RATE));

   private Room:     Server;
   id:               string;

   playersID_Set:    Set<string>           = new Set();
   unitsList:        Map<number, Agent   > = new Map();
   nodesList:        Map<number, Node    > = new Map();
   buildsList:       Map<number, Building> = new Map();

   battleMaxPop:     number;
   curPop:           number   = 0;
   vacantIDsList:    number[] = [];
   
   Grid:             Grid;

   constructor(params: any) {
      
      this.Room         = params.ServerIO.to(params.id);
      this.id           = params.id;
      this.battleMaxPop = params.maxPop;

      this.Grid         = new Grid(params);

      this.init();
   }

   init() {
      this.setVacantIDsList();

      // this.setServerList(this.unitsList,  UNIT_STATS,  UNITS,     Agent   );
      this.setServerList(this.nodesList,  NODE_STATS,  NODES,     Node    );
      this.setServerList(this.buildsList, BUILD_STATS, BUILDINGS, Building);
      
      this.sync();
   }
   
   // initPack ==> (Sent to each client)
   initPack() {
      return {
         frameRate:  Number(process.env.CLIENT_FRAME_RATE),
         maxPop:     this.setPlayerMaxPop(),

         // unitsList:  this.setClientList(this.unitsList),
         nodesList:  this.setClientList(this.nodesList),
         buildsList: this.setClientList(this.buildsList),
         
         BUILD_STATS,
         UNIT_STATS,
         NODE_STATS,

         TILES,    // ==> Tempory
      }
   }

   spread(
      channel: string,
      data:    any,
   ) {
      this.Room.emit(channel, data);
   }

   sync() {
      setInterval(() => {

         let stateList = [];
         let moveList  = [];

         for(const [, agent] of this.unitsList) {

            const { id, position, curCell, hasArrived, Pathfinder } = agent;

            // Send agent state (Every tick)
            stateList.push({
               id,
               position,
               cellID:   curCell.id,
               isVacant: curCell.isVacant,
            });

            if(hasArrived) continue;
            
            const path = Pathfinder.path;
            let pathID: string[] = [];
            path.forEach((cell: Cell) => pathID.push(cell.id));
            
            agent.walkPath(this.Grid);
            
            // Skip sending pathID pack if already sent once (Not every tick)
            if(agent.hasUpdated) continue;
            agent.hasUpdated = true;
            
            moveList.push({
               id,
               pathID,
            });
         }
         
         this.spread("agentState", stateList);
         this.spread("agentMove",  moveList );

      }, Math.floor( 1000/ Number(process.env.SERVER_FRAME_RATE) ));
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   createNewPlayer(
      socket: Socket,
      props:  any,
   ): Player {
      
      const newPlayer = new Player({
         id:       socket.id,
         socket:   socket,
         battleID: this.id,
         ...props
      }), { id: playerID} = newPlayer;

      this.playersID_Set.add(playerID);

      return newPlayer;
   }
   
   getCell(id: string): Cell | undefined {
      return this.Grid.cellsList.get(id);
   }

   setPlayerMaxPop(): number {
      const { battleMaxPop, playersID_Set } = this;
      return Math.floor(battleMaxPop /playersID_Set.size);
   }

   getIndexID(
      coord:    number,
      value:    number,
      index:    number,
      cellSize: number,
   ): number {

      return ( coord +value - (cellSize * (index +1)) ) /cellSize;
   }

   setVacantIDsList() {

      for(let i = 1; i < this.battleMaxPop; i++) {
         this.vacantIDsList.push(i);
      }
   }

   setClientList(elemList: Map<number, any>) {
      let tempList: any = [];

      for(const [, elem] of elemList) {

         tempList.push( elem.initPack() );
      }
      
      return tempList;
   }

   setServerList(
      elemList:   Map<number, any>,
      ELEM_STATS: {[key: string]: any},
      ELEM:       {[key: string]: any},
      classType:  new (...args: any[]) => Agent | Node | Building,
   ) {

      for(const [elemName, elemStats] of Object.entries(ELEM_STATS) ) {
         for(const [keyName, cellID_Array] of Object.entries(ELEM) ) {
         
            if(elemName !== keyName) continue;

            for(const cellID of cellID_Array) {
               const elemCell = this.getCell(cellID);

               if(!elemCell) continue;

               const params: any = {
                  ...elemStats,
                  id:       elemList.size,
                  position: elemCell.center,
                  cellID:   elemCell.id,
               };

               if(classType === Node) {
                  params["baseAmount"] = elemStats.amount;                  
                  elemCell.isNode      = true;
               }
               
               if(classType === Building) {
                  params["teamID"    ] = 1;
                  params["baseHealth"] = elemStats.health;
                  elemCell.isBuilding  = true;
               }
               
               elemCell.isVacant  = false;
               elemCell.isBlocked = true;

               const newElem = new classType(params);
               elemList.set(newElem.id, newElem);
            }
         }
      }
   }

   startAgentPF(data: any) {

      const { cellSize, cellsList       } = this.Grid;
      const { targetArea, AgentsID_List } = data;
      const { x, y, width, height       } = targetArea;

      // Search cells IDs from area
      const colNum = width  /cellSize;
      const rowNum = height /cellSize;
      
      let sortedUnitList = new Set<Agent>();
      
      // Get all cells IDs
      for(let r = 0; r < rowNum; r++) {
         const rowID = this.getIndexID(y, height, r, cellSize);
         
         for(let c = 0; c < colNum; c++) {
            const colID = this.getIndexID(x, width, c, cellSize);
            const cell  = this.getCell(`${colID}-${rowID}`);

            if(!cell
            || !cell.isVacant
            ||  cell.isTargeted
            ||  cell.isBlocked && !cell.isNode) {
               
               continue;
            }
            


            // ********************************************************************
            // ********************************************************************

            if(cell.isNode) {

               for(const neb of Object.values(cell.nebStatusList)) {
                  
                  const nodeNeb = this.getCell(neb.id)!;
                  
                  for(const id of AgentsID_List) {
                     const agent = this.unitsList.get(id)!;
                     const { Pathfinder } = agent;
                     
                     if(nodeNeb.isTargeted || Pathfinder.hasTarget) continue;
                     
                     nodeNeb.isTargeted      = true;
                     Pathfinder.hasTarget = true;
                     Pathfinder.goalCell  = nodeNeb;
                     
                     sortedUnitList.add(agent);
                  }
               }              

               continue;
            }

            // ********************************************************************
            // ********************************************************************



            
            // Set all Agents goalCells
            for(const id of AgentsID_List) {
               const agent = this.unitsList.get(id)!;
               const { Pathfinder } = agent;
               
               if(cell.isTargeted || Pathfinder.hasTarget) continue;
               
               cell.isTargeted      = true;
               Pathfinder.hasTarget = true;
               Pathfinder.goalCell  = cell;
               
               sortedUnitList.add(agent);
            }
         }
      }

      // Start all Agents search path
      for(const agent of sortedUnitList) {
         
         agent.Pathfinder.searchPath(cellsList);

         if(agent.Pathfinder.hasPath) {
            
            agent.hasArrived = false;
            agent.hasUpdated = false;
         }
      }
   }

}