

// =====================================================================
// Player Class
// =====================================================================
export class Player {

   id:   number;
   name: string;

   unitsList: {};
   buildList: {};

   constructor(params: any) {
      
      this.id   = params.id;
      this.name = params.name;

      this.unitsList = {};
      this.buildList = {};
   }

}