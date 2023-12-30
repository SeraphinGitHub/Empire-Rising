
"use strict"

const glo = require("./modules/globalVar.js");
const ext = require("./modules/extendedMethods.js");


let randPathIntervals = [];

// ================================================================================================
// Keyboard Inputs
// ================================================================================================
const keyboardInput = (event) => {

   switch(event.key) {

      case "Enter": {
         ext.cycleList(glo.AgentsList, (agent) => {
            
            ext.Test_PathRandomize(agent);
            const intervalID = setInterval(() => ext.Test_PathRandomize(agent), 3000);
            randPathIntervals.push(intervalID);
         });
      } break;

      case "Backspace": {
         randPathIntervals.forEach((intervalID) => clearInterval(intervalID));
      } break;
   }
}


// ================================================================================================
// Init Keyboard Event
// ================================================================================================
module.exports = {
   
   init() {
      window.addEventListener("keydown", (event) => keyboardInput(event));
   }
}