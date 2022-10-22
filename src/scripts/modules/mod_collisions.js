
"use strict"

// ================================================================================================
// Collisions
// ================================================================================================
module.exports = {
   
   reverseSide(first, second) {
      if(first > second) return [second, first];
      else return [first, second];
   },

   square_toSquare(first, second) {

      if(!(first.x > second.x + second.width
         ||first.x + first.width < second.x
         ||first.y > second.y + second.height
         ||first.y + first.height < second.y)) {
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

      let axisX =  this.reverseSide(sqr.left, sqr.right);
      let axisY =  this.reverseSide(sqr.top, sqr.bottom);

      if(circ.right  > axisX[0]
      && circ.left   < axisX[1]
      && circ.bottom > axisY[0]
      && circ.top    < axisY[1]) {
         return true;
      }
   },
}