

// =====================================================================
// Player Class
// =====================================================================
export class PlayerClass {

   id:   number;
   name: string;

   unitsList:     {};
   buildingsList: {};

   constructor(params: any) {
      
      this.id   = params.id;
      this.name = params.name;

      this.unitsList     = {};
      this.buildingsList = {};
   }

}