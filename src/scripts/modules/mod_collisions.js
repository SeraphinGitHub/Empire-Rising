
"use strict"

// ================================================================================================
// Collisions
// ================================================================================================
const reverseSide = (first, second) => {
   
   if(first > second) return [second, first];
   else return [first, second];
}

module.exports = {

   extractSides(square) {
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
   },

   square_toSquare(first, second) {

      let axisX = reverseSide(first.x, second.x);
      let axisY = reverseSide(first.y, second.y);

      if(!(axisX[0] > axisX[1] + second.width
         ||axisY[0] > axisY[1] + second.height
         ||axisX[0] + first.width  < axisX[1]
         ||axisY[0] + first.height < axisY[1])) {
            return true;
      }
   },

   square_toCircle(square, circle) {

      const circ = {
         left:   circle.x -circle.radius,
         right:  circle.x +circle.radius,
         top:    circle.y -circle.radius,
         bottom: circle.y +circle.radius,
      }
   
      const sqr = {
         left:   square.x,
         right:  square.x +square.width,
         top:    square.y,
         bottom: square.y +square.height,
      }

      let axisX = reverseSide(sqr.left, sqr.right);
      let axisY = reverseSide(sqr.top, sqr.bottom);

      if(circ.right  > axisX[0]
      && circ.left   < axisX[1]
      && circ.bottom > axisY[0]
      && circ.top    < axisY[1]) {
         return true;
      }
   },

   point_toSquare(point, square) {

      if(point.x > square.x
      && point.x < square.x +square.width
      && point.y > square.y
      && point.y < square.y +square.height) {

         return true;
      }
   },

   point_toCircle(point, circle) {

      let axisX = reverseSide(point.x, circle.x);
      let axisY = reverseSide(point.y, circle.y);

      let distX = axisX[0] -axisX[1];
      let distY = axisY[0] -axisY[1];
      let distance = distX * distX + distY * distY;
      let radiusSqr = circle.radius *circle.radius;

      if(distance < radiusSqr) return true;
   },

   line_toLine(lineA, lineB) {

      const vectorA = {
         x: lineA.endX -lineA.startX,
         y: lineA.endY -lineA.startY,
      }
   
      const vectorB = {
         x: lineB.endX -lineB.startX,
         y: lineB.endY -lineB.startY,
      }
   
      const vectorC = {
         x: lineA.startX -lineB.startX,
         y: lineA.startY -lineB.startY,
      }  
   
      let vectorValueA = vectorA.x *vectorC.y - vectorA.y *vectorC.x;
      let vectorValueB = vectorB.x *vectorC.y - vectorB.y *vectorC.x;
      let denominator = vectorB.y *vectorA.x - vectorB.x *vectorA.y;
      
      let rangeA = Math.floor(vectorValueA /denominator *1000) /1000;
      let rangeB = Math.floor(vectorValueB /denominator *1000) /1000;
      
      if(rangeA >= 0 && rangeA <= 1
      && rangeB >= 0 && rangeB <= 1) return true;
      else return false;
   },

   line_toSquare(line, square) {  
      
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
         
      if(leftSide
      || rightSide
      || topSide
      || bottomSide) return true;
      else return false;
   },

}