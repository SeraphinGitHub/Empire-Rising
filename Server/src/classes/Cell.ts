
import {
   IPosition,
   ICoordArray,
   INebList,
   ILineList,
} from "../utils/interfaces";

import {
   Grid,
} from "./_Export";


// =====================================================================
// Cell Class
// =====================================================================
export class Cell {
   
   id:             string;

   i:              number;
   j:              number;
   x:              number;
   y:              number;
   zIndex:         number;
   size:           number;
   cellPerSide:    number;

   center:         IPosition     = {x:0, y:0};
   
   agentIDset:     Set<number>   = new Set();
   collider:       ILineList     = {};
   nebStatusList:  INebList      = {}; // { ... top: { id: "0-47", isDiagonal: false }, ... }
   nebCoordList:   ICoordArray   = {
      top:         [ 0, -1,  false], // isDiagonal ==> false
      topRight:    [ 1, -1,  true ], // isDiagonal ==> true
      right:       [ 1,  0,  false],
      bottomRight: [ 1,  1,  true ],
      bottom:      [ 0,  1,  false],
      bottomLeft:  [-1,  1,  true ],
      left:        [-1,  0,  false],
      topLeft:     [-1, -1,  true ],
   };
   
   isVacant:       boolean = true;
   isBlocked:      boolean = false;
   isTargeted:     boolean = false;
   isOverlaped:    boolean = false;
   isTransp:       boolean = false;
   isNode:         boolean = false;


   constructor(
      zIndex:      number,
      cellPerSide: number,
      size:        number,
      i:           number,
      j:           number,
   ) {
      
      this.id          = `${i}-${j}`;
      this.i           = i;
      this.j           = j;
      this.x           = i *size;
      this.y           = j *size;
      this.zIndex      = zIndex;
      this.size        = size;
      this.cellPerSide = cellPerSide;
      
      this.setCenter();
   }
   
   
   // =========================================================================================
   // Methods
   // =========================================================================================
   setCenter() {
      const { x, y, size } = this;

      this.center.x  = x +size *0.5;
      this.center.y  = y +size *0.5;
   }

   setNeighborsList() {

      for(const nebName in this.nebCoordList) {
         const nebArray = this.nebCoordList[nebName];

         this.checkExistNeb(nebName, nebArray);
      }
   }

   getNeighbors(
      cellsList: Map<string, Cell>,
   ): any {
      
      const neighbors: any = {};
      
      for(const nebName in this.nebStatusList) {
         const nebData = this.nebStatusList[nebName];

         neighbors[nebName] = cellsList.get(nebData.id);
      }

      return neighbors;
   }
   
   checkExistNeb(
      nebName:  string,
      nebArray: [number, number, boolean],
   ) {
   
      const [horizSide, vertSide] = nebArray;
      const [horizNeb,  vertNeb ] = [this.i +horizSide, this.j +vertSide];
   
      if(horizNeb >= 0
      && vertNeb  >= 0
      && horizNeb < this.cellPerSide
      && vertNeb  < this.cellPerSide) {

         this.addNeb(nebName);
      }
   }
   
   addNeb(side: string) {

      const neighbor: any = {};

      for(const nebName in this.nebCoordList) {
         const nebArray = this.nebCoordList[nebName];

         neighbor[nebName] = {
            id:         `${this.i +nebArray[0]}-${this.j +nebArray[1]}`,
            isDiagonal: nebArray[2],
         };
      }
   
      this.nebStatusList[side] = neighbor[side];
   }

   isBlockedDiag(
      cellsList: Map<string, Cell>,
      neighbor:  Cell,
   ): boolean {
      
      const {
         topLeft,
         top,
         topRight,
         right,
         bottomRight,
         bottom,
         bottomLeft,
         left, 
      } = this.getNeighbors(cellsList);

      const isBlocked_TopLeft     = top    && left  && top    .isBlocked && left  .isBlocked && neighbor.id === topLeft    .id;
      const isBlocked_TopRight    = top    && right && top    .isBlocked && right .isBlocked && neighbor.id === topRight   .id;
      const isBlocked_BottomLeft  = bottom && left  && bottom .isBlocked && left  .isBlocked && neighbor.id === bottomLeft .id;
      const isBlocked_BottomRight = bottom && right && bottom .isBlocked && right .isBlocked && neighbor.id === bottomRight.id;
      
      return isBlocked_TopLeft || isBlocked_TopRight || isBlocked_BottomLeft || isBlocked_BottomRight;
   }

   setVacant(
      agentID: number,
      Grid:    Grid,
   ) {
      this.agentIDset.delete(agentID);
      
      if(this.agentIDset.size === 0) {
         Grid.occupiedCells.delete(this);
         this.isVacant = true;
      }
   }

   setOccupied(
      agentID: number,
      Grid:    Grid,
   ) {
      this.agentIDset.add(agentID);
      this.isVacant = false;
      
      Grid.addToOccupiedMap(this);
   }

   setTransparency(cellsList: Map<string, Cell>) {
   
      if(!this.isBlocked) return;

      const {
         top,
         topRight,
         right,
      } = this.getNeighbors(cellsList);
      
      if(!top.isVacant
      || !topRight.isVacant
      || !right.isVacant) {
         
         return this.isTransp = true;
      }

      this.isTransp = false;
   }


}