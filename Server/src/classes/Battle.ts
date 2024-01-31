
import {
   IPlayerClass,
} from "utils/interfaces";

// =====================================================================
// Battle Class
// =====================================================================
export class BattleClass {

   id:           number;
   hostPlayerID: number | undefined;
   playersList:  IPlayerClass;

   constructor(params: any) {
      
      this.id           = params.id;
      this.hostPlayerID = undefined;
      this.playersList  = {};
   }

}