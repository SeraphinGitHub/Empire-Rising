
"use strict"

const glo = require("./modules/mod_globalVar.js");

// ================================================================================================
// Keyboard Inputs
// ================================================================================================
const Keyboard_Enter = () => {

}


// ================================================================================================
// Init Keyboard Handler
// ================================================================================================
module.exports = {
   
   init() {

      // Keyboard press key
      window.addEventListener("keydown", (event) => {
         
         if(event.key === "Enter") Keyboard_Enter();
      });
   }
}