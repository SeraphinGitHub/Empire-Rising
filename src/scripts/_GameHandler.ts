
"use strict"

document.body.oncontextmenu = (event) => {
   event.preventDefault();
   event.stopPropagation();
}

export const methods = {

   init() {
      console.log(123);
   },
}