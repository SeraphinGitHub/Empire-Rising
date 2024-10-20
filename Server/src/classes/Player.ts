
import {
   Agent,
} from "../classes/_Export";


// =====================================================================
// Player Class
// =====================================================================
export class Player {

   id:         string;
   battleID:   string = "";
   name:       string = "";
   faction:    string = "";
   
   unitsList: Map<number, Agent   > = new Map<number, Agent   >();
   // buildList: Map<number, Building> = new Map<number, Building>();

   constructor(id: string) {
      
      this.id = id;
   }

}