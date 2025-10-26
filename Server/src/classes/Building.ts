
import {
   INumber,
   IPosition,
} from "utils/interfaces";

import {
   Cell,
} from "./_Export";


// =====================================================================
// Building Class
// =====================================================================
export class Building {

   id:            number;
   name:          string;
   teamColor:     string;
   cellID:        string;
   spritePath:    string;
   position:      IPosition;

   offset:        INumber;
   collider:      INumber;
   
   spriteID:      number;
   teamID:        number;
   buildTime:     number;
   buildSize:     number;
   spriteRatio:   number;
   spriteSize:    number;
   health:        number;
   baseHealth:    number;

   isBuilding:    boolean = true;


   constructor(params: any) {

      this.id           = params.id;
      this.name         = params.name;
      this.cellID       = params.cellID;
      this.position     = params.position;
      this.offset       = params.offset;
      this.collider     = params.collider;
      this.spriteID     = params.spriteID;
      this.teamID       = params.teamID;
      this.buildTime    = params.buildTime;
      this.buildSize    = params.buildSize;
      this.spriteRatio  = params.spriteRatio;
      this.spriteSize   = params.spriteSize;
      this.health       = params.baseHealth;
      this.baseHealth   = params.baseHealth;
      this.teamColor    = params.teamColor;
      this.spritePath   = params.spritePath;
   }

   initPack() {
      return {
         id:            this.id,
         name:          this.name,
         cellID:        this.cellID,
         position:      this.position,
         offset:        this.offset,
         collider:      this.collider,
         spriteID:      this.spriteID,
         teamID:        this.teamID,
         buildTime:     this.buildTime,
         buildSize:     this.buildSize,
         spriteRatio:   this.spriteRatio,
         spriteSize:    this.spriteSize,
         health:        this.health,
         baseHealth:    this.baseHealth,
         teamColor:     this.teamColor,
         spritePath:    this.spritePath,
      }
   }

}