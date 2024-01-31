
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
const reverseSide = (
   first:  number,
   second: number,
) => {
   
   if(first > second) return [second, first];
   return [first, second];
}

const extractSides = (
  square: ISquare
) => {         
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

const checkIf = (
   isOverLaping: boolean,
): boolean => {

   if(isOverLaping) return true;
   return false;
}

const calcDist = (
   first:  IPosition | ISquare,
   second: IPosition | ISquare,
): number => {

   const distX = second.x -first.x;
   const distY = second.y -first.y;

   return Math.floor( Math.hypot(distX, distY) );
}

export const Collision = {
   
   square_toSquare(
      first:  ISquare,
      second: ISquare,
   ): boolean {

      let axisX = reverseSide(first.x, second.x);
      let axisY = reverseSide(first.y, second.y);

      const isOverLaping: boolean =
         !(axisX[0] > axisX[1] + second.width
         ||axisY[0] > axisY[1] + second.height
         ||axisX[0] + first.width  < axisX[1]
         ||axisY[0] + first.height < axisY[1])
      ;

      return checkIf(isOverLaping);
   },

   square_toCircle(
      square: ISquare,
      circle: ICircle,
   ): boolean {

      const circ: INumber = {
         top:    circle.y -circle.radius,
         right:  circle.x +circle.radius,
         bottom: circle.y +circle.radius,
         left:   circle.x -circle.radius,
      }   

      const sqr: INumber = {
         top:    square.y,
         right:  square.x +square.width,
         bottom: square.y +square.height,
         left:   square.x,
      }

      let axisX = reverseSide(sqr.left, sqr.right);
      let axisY = reverseSide(sqr.top, sqr.bottom);

      const isOverLaping: boolean =
            circ.right  > axisX[0]
         && circ.left   < axisX[1]
         && circ.bottom > axisY[0]
         && circ.top    < axisY[1]
      ;

      return checkIf(isOverLaping);
   },

   circle_toCircle(
      firstPos:  IPosition,
      firstRad:  number,
      secondPos: IPosition,
      secondRad: number,
   ): boolean {

      const distance    = calcDist(firstPos, secondPos);
      const minDistance = firstRad +secondRad;

      const isOverLaping: boolean =
         distance <= minDistance
      ;

      return checkIf(isOverLaping);
   },

   point_toSquare(
      point:  IPosition,
      square: ISquare,
   ): boolean {

      const isOverLaping: boolean =
         point.x > square.x
         && point.x < square.x +square.width
         && point.y > square.y
         && point.y < square.y +square.height
      ;

      return checkIf(isOverLaping);
   },

   point_toCircle(
      point:  IPosition,
      circle: ICircle,
   ): boolean {

      let axisX = reverseSide(point.x, circle.x);
      let axisY = reverseSide(point.y, circle.y);

      let distX = axisX[0] -axisX[1];
      let distY = axisY[0] -axisY[1];
      let distance = distX * distX + distY * distY;
      let radiusSqr = circle.radius *circle.radius;

      const isOverLaping: boolean =
         distance < radiusSqr
      ;
      
      return checkIf(isOverLaping);
   },

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
   
      let vectorValueA = vectorA.x *vectorC.y - vectorA.y *vectorC.x;
      let vectorValueB = vectorB.x *vectorC.y - vectorB.y *vectorC.x;
      let denominator  = vectorB.y *vectorA.x - vectorB.x *vectorA.y;
      
      let rangeA = Math.floor(vectorValueA /denominator *1000) /1000;
      let rangeB = Math.floor(vectorValueB /denominator *1000) /1000;

      const isOverLaping: boolean =
            rangeA >= 0 && rangeA <= 1
         && rangeB >= 0 && rangeB <= 1
      ;

      return checkIf(isOverLaping);
   },

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

      let topSide    = this.line_toLine(line, rectSide.top   );
      let rightSide  = this.line_toLine(line, rectSide.right );
      let bottomSide = this.line_toLine(line, rectSide.bottom);
      let leftSide   = this.line_toLine(line, rectSide.left  );

      const isOverLaping: boolean =
            leftSide
         || rightSide
         || topSide
         || bottomSide
      ;

      return checkIf(isOverLaping);
   },
   
}