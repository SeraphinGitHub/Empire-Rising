
"use strict"

// ================================================================================================
// Collisions
// ================================================================================================
const reverseSide = (first, second) => {
   
   if(first > second) return [second, first];
   else return [first, second];
}

module.exports = {   

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

   point_toCircle(point, circle) {

      let axisX = reverseSide(point.x, circle.x);
      let axisY = reverseSide(point.y, circle.y);

      let distX = axisX[0] -axisX[1];
      let distY = axisY[0] -axisY[1];
      let distance = distX * distX + distY * distY;
      let radiusSqr = circle.radius *circle.radius;

      if(distance < radiusSqr) return true;
   },

}