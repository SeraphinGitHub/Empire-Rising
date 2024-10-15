
import {
   IPlayer,
} from "utils/interfaces";

// =====================================================================
// Battle Class
// =====================================================================
export class Battle {

   id:           number;
   hostPlayerID: number | undefined;
   playersList:  IPlayer;

   constructor(params: any) {
      
      this.id           = params.id;
      this.hostPlayerID = undefined;
      this.playersList  = {};
   }

}