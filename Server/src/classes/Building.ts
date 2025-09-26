
import {
   INumber,
   IPosition,
} from "utils/interfaces";


// =====================================================================
// Building Class
// =====================================================================
export class Building {

   id:            number;
   name:          string;
   cellID:        string;
   position:      IPosition;

   collider:      INumber = { offsetY: 0, radius: 30 };
   
   type:          number;
   teamID:        number;
   buildTime:     number;
   health:        number;
   baseHealth:    number;

   color:         string;

   constructor(params: any) {

      this.id           = params.id;
      this.name         = params.name;
      this.cellID       = params.cellID;
      this.position     = params.position;
      this.type         = params.type;
      this.teamID       = params.teamID;
      this.buildTime    = params.buildTime;
      this.health       = params.health;
      this.baseHealth   = params.baseHealth;
      this.color        = params.color;
   }

   initPack() {
      return {
         id:         this.id,
         name:       this.name,
         cellID:     this.cellID,
         position:   this.position,
         collider:   this.collider,
         type:       this.type,
         teamID:     this.teamID,
         buildTime:  this.buildTime,
         health:     this.baseHealth,
         color:      this.color,
      }
   }

}