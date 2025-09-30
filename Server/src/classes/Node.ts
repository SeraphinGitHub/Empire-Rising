
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
   
   type:        number;
   baseAmount:  number;
   amount:      number;


   constructor(params: any) {
      
      this.id         = params.id;
      this.name       = params.name;
      this.cellID     = params.cellID;
      this.position   = params.position;
      this.collider   = params.collider;
      this.type       = params.type;
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
         type:       this.type,
         amount:     this.baseAmount,
      }
   }

}