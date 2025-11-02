
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
   spritePath:  string;
   position:    IPosition;

   collider:    INumber;
   footPrint:   string[];

   nodeSize:    number;
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
      this.footPrint  = params.footPrint;
      this.nodeSize   = params.nodeSize;
      this.spriteID   = params.spriteID;
      this.yieldType  = params.yieldType;
      this.baseAmount = params.amount;
      this.amount     = params.amount;
      this.spritePath = params.spritePath;
   }

   initPack() {
      return {
         id:         this.id,
         name:       this.name,
         cellID:     this.cellID,
         position:   this.position,
         collider:   this.collider,
         footPrint:  this.footPrint,
         nodeSize:   this.nodeSize,
         spriteID:   this.spriteID,
         amount:     this.baseAmount,
         spritePath: this.spritePath,
      }
   }


   updateAmount() {
      
      this.amount--;
   }

}