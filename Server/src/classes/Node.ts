
import {
   INumber,
   IPosition,
} from "../utils/interfaces";


// =====================================================================
// Node Class
// =====================================================================
export class Node {

   id:          number;
   name:        string;
   cellID:      string;
   position:    IPosition;

   collider:    INumber;
   
   spriteID:    number;
   yieldType:   number;
   baseAmount:  number;
   amount:      number;

   isNode:      boolean = true;


   constructor(params: any) {
      
      this.id         = params.id;
      this.name       = params.name;
      this.cellID     = params.cellID;
      this.position   = params.position;
      this.collider   = params.collider;
      this.spriteID   = params.spriteID;
      this.yieldType  = params.yieldType;
      this.baseAmount = params.amount;
      this.amount     = params.amount;
   }

   initPack() {
      return {
         id:         this.id,
         name:       this.name,
         cellID:     this.cellID,
         position:   this.position,
         collider:   this.collider,
         spriteID:   this.spriteID,
         amount:     this.baseAmount,
      }
   }


   updateAmount() {
      
      this.amount--;
   }

}