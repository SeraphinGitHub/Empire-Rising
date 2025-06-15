
import {
   Grid,
   Cell,
   Player,
   Agent,
} from "../classes/_Export";

import { Server, Socket } from "socket.io";
import { UNIT_STATS     } from "../utils/unitStats";
import dotenv             from "dotenv";
dotenv.config();

const WALLS: string[] = [
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

   "29-20",
   "30-19",
   "31-18",
   "32-17",
   "33-16",
   "34-17",
   "35-18",
   "36-19",
   "37-20",
   "36-21",
   "35-22",
   "34-23",
   "33-24",
   "32-23",
   "31-22",
   "30-21",
];

const TILES: string[] = [
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


// =====================================================================
// Battle Class
// =====================================================================
export class Battle {

   syncRate:         number = Math.floor(1000 / Number(process.env.FRAME_RATE));

   private Room:     Server;
   id:               string;

   playersID_Set:    Set<string> = new Set();
   unitsList:        Map<number, Agent   > = new Map();
   // buildsList:       Map<number, Building> = new Map();

   cellSize:         number   = 40;
   gridSize:         number;
   halfGrid:         number;
   battleMaxPop:     number;
   curPop:           number   = 0;
   vacantIDsList:    number[] = [];
   
   Grid:             Grid;

   constructor(params: any) {
      
      this.Room         = params.ServerIO.to(params.id);
      this.id           = params.id;
      this.gridSize     = params.gridSize;
      this.battleMaxPop = params.maxPop;
      this.halfGrid     = this.gridSize *0.5;

      this.Grid         = new Grid(this);

      this.init();
   }

   init() {
      this.setVacantIDsList();
      this.sync();
   }

   // initPack ==> (Sent to each client)
   initPack() {
      return {
         UNIT_STATS,

         cellSize:   this.cellSize,
         gridSize:   this.gridSize,
         halfGrid:   this.halfGrid,
         maxPop:     this.setPlayerMaxPop(),
         unitsList:  this.setClient_UnitsList(),
         // buildsList: this.buildsList,

         WALLS, // ==> Tempory
         TILES, // ==> Tempory
      }
   }

   spread(
      channel: string,
      data:    any,
   ) {
      this.Room.emit(channel, data);
   }

   watchAgents() {

      for(const [, agent] of this.unitsList) {
            
         agent.walkPath(this.Grid);

         // if(!agent.hasArrived) continue;

         if(agent.hasUpdated) continue; // skip if already sent
         agent.hasUpdated = true; // update with new key

         const path         = agent.Pathfinder.path;
         const nextCellID_1 = path[0] ? path[0].id : null;
         const nextCellID_2 = path[1] ? path[1].id : null;
         const nextCellID_3 = path[2] ? path[2].id : null;

         const shortPathID = [ nextCellID_1, nextCellID_2, nextCellID_3 ];

         this.spread("agentMove", {
            id: agent.id,
            shortPathID,
         });
      }
   }

   sync() {
      setInterval(() => {  // temp ==> very bad perf, need something better
         
         this.watchAgents();
         
      }, this.syncRate);
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

   setClient_UnitsList() {
      let cl_UnitsList = [];

      for(const [, unit] of this.unitsList) {
         cl_UnitsList.push(unit.initPack());
      }
      
      return cl_UnitsList;
   }

   startAgentPF(data: any) {

      const { Grid, cellSize            } = this;
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

            if(!cell || cell.isTargeted || cell.isBlocked || !cell.isVacant) continue;
            
            
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
         
         agent.Pathfinder.searchPath(Grid.cellsList);
      }
   }

}