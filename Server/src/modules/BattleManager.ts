
import {
   Grid,
   Cell,
   Agent,
   Player,
} from "../classes/_Export";

import { UNIT_STATS } from "../utils/unitStats";

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
// BattleManager Class
// =====================================================================
export class BattleManager {

   id:               string;

   cellSize:         number = 40;
   gridSize:         number;
   halfGrid:         number;
   battleMaxPop:     number;
   curPop:           number = 0;

   playersList:      Map<string, Player> = new Map();
   vacantIDsList:    number[]            = [];
   
   Grid:             Grid;


   constructor(params: any) {
      
      this.id           = params.id;
      this.gridSize     = params.gridSize;
      this.battleMaxPop = params.maxPop;
      this.halfGrid     = this.gridSize *0.5;

      this.Grid         = new Grid(this);

      this.init();
   }

   init() {
      this.setVacantIDsList();
      this.setPlayersMaxPop();
   }

   initPack() {

      const {
         cellSize,
         gridSize,
         halfGrid,
      } = this;

      return {
         UNIT_STATS,

         cellSize,
         gridSize,
         halfGrid,
         maxPop: this.getMaxPop(),

         WALLS, // ==> Tempory
         TILES, // ==> Tempory
      }
   }


   // =========================================================================================
   // Methods
   // =========================================================================================
   getCell(id: string): Cell | undefined {
      return this.Grid.cellsList.get(id);
   }

   getMaxPop(): number {
      const { battleMaxPop, playersList } = this;
      return Math.floor(battleMaxPop /playersList.size);
   }

   setVacantIDsList() {

      for(let i = 1; i < this.battleMaxPop; i++) {
         this.vacantIDsList.push(i);
      }
   }

   setPlayersMaxPop() {

      for(const [, player] of this.playersList) {
         player.maxPop = this.getMaxPop();
      }
   }

   addNewPlayer(newPlayer: Player) {
      this.playersList.set(newPlayer.id, newPlayer);
   }

   createNewAgent(
      player: Player,
      unitID: string,
      cellID: string,
   ) {
      const agentStats: any    = UNIT_STATS[unitID],    { popCost            } = agentStats;      
      const startCell:  Cell   = this.getCell(cellID)!, { x: cellX, y: cellY } = startCell.center;
      const vacantID:   number = this.vacantIDsList[0];

      startCell.agentIDset.add(vacantID);
      startCell.isVacant = false;

      this.Grid.addToOccupiedMap(startCell);
      this.vacantIDsList.splice(0, popCost);
      this.curPop   += popCost;
      player.curPop += popCost;

      const newAgent = new Agent({
         id:         vacantID,
         team:       player.team,
         teamColor:  player.teamColor,
         stats:      agentStats,
         position: { x: cellX, y: cellY }, // ==> Tempory until create rally point !
         startCell,                        // ==> Tempory until create BuildingsClass with spawn position
      });
      
      player.unitsList.set(vacantID, newAgent);
   }

}