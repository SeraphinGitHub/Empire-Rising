
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

   collider:      INumber;
   
   spriteID:      number;
   teamID:        number;
   buildTime:     number;
   health:        number;
   baseHealth:    number;

   color:         string;

   isBuilding:    boolean = true;


   constructor(params: any) {

      this.id           = params.id;
      this.name         = params.name;
      this.cellID       = params.cellID;
      this.position     = params.position;
      this.collider     = params.collider;
      this.spriteID     = params.spriteID;
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
         spriteID:   this.spriteID,
         teamID:     this.teamID,
         buildTime:  this.buildTime,
         health:     this.baseHealth,
         color:      this.color,
      }
   }

}