
"use strict"

module.exports = {

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
      
      if(circ.right  > sqr.left
      && circ.left   < sqr.right
      && circ.bottom > sqr.top
      && circ.top    < sqr.bottom) {
         return true;
      }
   }
}