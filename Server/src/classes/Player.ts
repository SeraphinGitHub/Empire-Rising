
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
   teamColor: string;

   team:      number;
   maxPop:    number = 0;
   curPop:    number = 0;
   
   unitsList: Map<number, Agent   > = new Map();
   // buildList: Map<number, Building> = new Map();

   constructor(params: any) {
      
      this.id        = params.id;
      this.battleID  = params.battleID;
      this.name      = params.name;
      this.teamColor = params.teamColor;
      this.team      = params.team;

   }

}