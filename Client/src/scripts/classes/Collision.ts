
import {
   INumber,
   IPosition,
   ISquare,
   ICircle,
   ILine,
} from "../utils/interfaces";


// =====================================================================
// Colision Class
// =====================================================================
export class Collision {

   flipSide(
      first:  number,
      second: number,
   ) {
      if(first > second) return [second, first];
      return [first, second];
   }
   
   extractSides(
     square: ISquare
   ) {         
      return {
   
         top: {
            startX: square.x,
            startY: square.y,
            endX:   square.x +square.width,
            endY:   square.y,
         },         
   
         right: {
            startX: square.x +square.width,
            startY: square.y,
            endX:   square.x +square.width,
            endY:   square.y +square.height,
         },
   
         bottom: {
            startX: square.x +square.width,
            startY: square.y +square.height,
            endX:   square.x,
            endY:   square.y +square.height,
         },
   
         left: {
            startX: square.x,
            startY: square.y +square.height,
            endX:   square.x,
            endY:   square.y,
         },
      };
   }
   
   calcDist(
      first:  IPosition | ISquare,
      second: IPosition | ISquare,
   ): number {
   
      const distX = second.x -first.x;
      const distY = second.y -first.y;
      const hypot = Math.floor( Math.hypot(distX, distY) );
   
      return hypot;
   }


   // =====================================================================
   // Collisions Types
   // =====================================================================
   square_toSquare(
      first:  ISquare,
      second: ISquare,
   ): boolean {

      const { x: firstX,  y: firstY,  width: firstW,  height: firstH  } = first;
      const { x: secondX, y: secondY, width: secondW, height: secondH } = second;

      const [ LoR_1, LoR_2 ] = this.flipSide(firstX, secondX);
      const [ ToB_1, ToB_2 ] = this.flipSide(firstY, secondY);

      const isOverLaping: boolean =
         !(LoR_1 > LoR_2 + secondW
         ||ToB_1 > ToB_2 + secondH
         ||LoR_1 + firstW  < LoR_2
         ||ToB_1 + firstH  < ToB_2)
      ;

      return isOverLaping;
   }

   square_toCircle(
      square: ISquare,
      circle: ICircle,
   ): boolean {

      const { x: sqrX,  y: sqrY,  width:  sqrW,   height: sqrH } = square;
      const { x: circX, y: circY, radius: circRad              } = circle;

      const sqrCol: INumber = {
         top:    sqrY,
         right:  sqrX +sqrW,
         bottom: sqrY +sqrH,
         left:   sqrX,
      }

      const circCol: INumber = {
         top:    circY -circRad,
         right:  circX +circRad,
         bottom: circY +circRad,
         left:   circX -circRad,
      }

      const [ LoR_1, LoR_2 ] = this.flipSide(sqrCol.left, sqrCol.right);
      const [ ToB_1, ToB_2 ] = this.flipSide(sqrCol.top, sqrCol.bottom);

      const isOverLaping: boolean =
            circCol.top    < ToB_2
         && circCol.right  > LoR_1
         && circCol.bottom > ToB_1
         && circCol.left   < LoR_2
      ;

      return isOverLaping;
   }

   circle_toCircle(
      firstPos:  IPosition,
      firstRad:  number,
      secondPos: IPosition,
      secondRad: number,
   ): boolean {

      const distance    = this.calcDist(firstPos, secondPos);
      const minDistance = firstRad +secondRad;

      const isOverLaping: boolean =
         distance <= minDistance
      ;

      return isOverLaping;
   }

   point_toSquare(
      point:  IPosition,
      square: ISquare,
   ): boolean {

      const { x: pointX, y: pointY } = point;
      const { x: sqrX,   y: sqrY,  width: sqrW, height: sqrH } = square;

      const isOverLaping: boolean =
            pointX > sqrX
         && pointX < sqrX +sqrW
         && pointY > sqrY
         && pointY < sqrY +sqrH
      ;

      return isOverLaping;
   }

   point_toCircle(
      point:  IPosition,
      circle: ICircle,
   ): boolean {

      const { x: pointX, y: pointY } = point;
      const { x: circX,  y: circY, radius: circRad } = circle;

      const [ LoR_1, LoR_2 ] = this.flipSide(pointX, circX);
      const [ ToB_1, ToB_2 ] = this.flipSide(pointY, circY);

      const distX     = LoR_1 -LoR_2;
      const distY     = ToB_1 -ToB_2;
      const distance  = distX * distX + distY * distY;
      const radiusSqr = circRad *circRad;

      const isOverLaping: boolean =
         distance < radiusSqr
      ;
      
      return isOverLaping;
   }

   line_toLine(
      lineA: ILine,
      lineB: ILine,
   ): boolean {

      const vectorA: IPosition = {
         x: lineA.endX -lineA.startX,
         y: lineA.endY -lineA.startY,
      }
   
      const vectorB: IPosition = {
         x: lineB.endX -lineB.startX,
         y: lineB.endY -lineB.startY,
      }
   
      const vectorC: IPosition = {
         x: lineA.startX -lineB.startX,
         y: lineA.startY -lineB.startY,
      }  
   
      const vectorValueA = vectorA.x *vectorC.y - vectorA.y *vectorC.x;
      const vectorValueB = vectorB.x *vectorC.y - vectorB.y *vectorC.x;
      const denominator  = vectorB.y *vectorA.x - vectorB.x *vectorA.y;
      
      const rangeA = Math.floor(vectorValueA /denominator *1000) /1000;
      const rangeB = Math.floor(vectorValueB /denominator *1000) /1000;

      const isOverLaping: boolean =
            rangeA >= 0 && rangeA <= 1
         && rangeB >= 0 && rangeB <= 1
      ;

      return isOverLaping;
   }

   line_toSquare(
      line:   ILine,
      square: ISquare,
   ): boolean {  
      
      const rectSide = {

         top: {
            startX: square.x,
            startY: square.y,
            endX:   square.x +square.width,
            endY:   square.y,
         },         

         right: {
            startX: square.x +square.width,
            startY: square.y,
            endX:   square.x +square.width,
            endY:   square.y +square.height,
         },

         bottom: {
            startX: square.x +square.width,
            startY: square.y +square.height,
            endX:   square.x,
            endY:   square.y +square.height,
         },

         left: {
            startX: square.x,
            startY: square.y +square.height,
            endX:   square.x,
            endY:   square.y,
         },
      };

      const topSide    = this.line_toLine(line, rectSide.top   );
      const rightSide  = this.line_toLine(line, rectSide.right );
      const bottomSide = this.line_toLine(line, rectSide.bottom);
      const leftSide   = this.line_toLine(line, rectSide.left  );

      const isOverLaping: boolean =
            leftSide
         || rightSide
         || topSide
         || bottomSide
      ;

      return isOverLaping;
   }
   
}