
import {
   Agent,
} from "../classes/_Export";


// =====================================================================
// Player Class
// =====================================================================
export class Player {

   id:        string;
   battleID:  string;
   name:      string;
   team:      string;
   teamColor: string;
   
   unitsList: Map<number, Agent   > = new Map<number, Agent   >();
   // buildList: Map<number, Building> = new Map<number, Building>();

   constructor(params: any) {
      
      this.id        = params.id;
      this.battleID  = params.battleID;
      this.name      = params.name;
      this.team      = params.team;
      this.teamColor = params.teamColor;
   }

}