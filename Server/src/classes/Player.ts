

// =====================================================================
// Player Class
// =====================================================================
export class PlayerClass {

   id:   number;
   name: string;

   unitsList:     {};
   buildingsList: {};

   constructor(params: any) {
      
      this.id   = params.userID;
      this.name = params.playerName;

      this.unitsList     = {};
      this.buildingsList = {};
   }

}