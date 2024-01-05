
"use strict"

// =====================================================================
// Cell Class
// =====================================================================
export class CellClass {

   id: string;
   
   constructor(
      cellPerSide: number,
      size:        number,
      i:           number,
      j:           number,
   ) {

      this.id = `${i}-${j}`;

      this.init();
   }

   init() {

   }

   initNeighborsList() {

   }
}