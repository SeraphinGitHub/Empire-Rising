
import {
   INumber,
   IPlayer,
} from "utils/interfaces";

import {
   Player,
   Grid,
} from "../classes/_Export";


// =====================================================================
// Battle Class
// =====================================================================
export class Battle {

   id:           string;
   playID_List:  Set<string> = new Set();

   cellSize:     number = 40;
   gridSize:     number;
   halfGrid:     number;
   maxPop:       number;
   curPop:       number = 0;
   
   Grid:         Grid;

   constructor(params: any) {
      
      this.id       = params.id;
      this.maxPop   = params.maxPop;
      this.gridSize = params.gridSize;
      this.halfGrid = this.gridSize *0.5;

      this.Grid     = new Grid();
   }

   init() {


      // const { mapSize } = data;

      // if(!mapSize || !this.mapSize[mapSize]) return;

      // const gridParams = {
      //    gridSize: this.mapSize[mapSize],
      //    cellSize: this.cellSize,
      // }

      // this.Grid.init(gridParams);
   }

   start() {
      
   }

}