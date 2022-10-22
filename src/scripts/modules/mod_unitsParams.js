
"use strict"

const glo = require("./mod_globalVar.js");

// ================================================================================================
// Units Parameters
// ================================================================================================
module.exports = {

   infantry: {
      popCost: 1,

      collider: {
         offsetY: 0,
         radius:  glo.GridParams.cellSize *0.1,
      },

      type: {
         worker: {
            health: 200,
            armor:    0,
            damages: 15,
            walkSpeed:  15,
            buildSpeed: 10,
            attackSpeed: 7,
            animationDelay: 0.5,
            
            imageSrc: "",
         },

         swordsman: {
            health: 500,
            armor:  200,
            damages: 40,
            walkSpeed:   12,
            attackSpeed: 12,
            animationDelay: 0.5,
            
            imageSrc: "",
         },
         
         bowman: {
            health: 300,
            armor:   80,
            damages: 60,
            walkSpeed:   15,
            attackSpeed: 14,
            animationDelay: 0.5,
            
            imageSrc: "",
         },
         
         spearman: {
            health: 400,
            armor:  120,
            damages: 50,
            walkSpeed:   12,
            attackSpeed: 10,
            animationDelay: 0.5,
            
            imageSrc: "",
         },
      },
   },

   cavalry: {
      popCost: 2,

      collider: {
         offsetY: 0,
         radius:  glo.GridParams.cellSize *0.2,
      },

      type: {
         swordsman: {
            health: 700,
            armor:  300,
            damages: 50,
            walkSpeed:   20,
            attackSpeed: 12,
            animationDelay: 0.5,
            
            imageSrc: "",
         },

         bowman: {
            health: 500,
            armor:  130,
            damages: 70,
            walkSpeed:   22,
            attackSpeed: 14,
            animationDelay: 0.5,
            
            imageSrc: "",
         },
      },
   },

   machinery: {
      popCost: 3,

      collider: {
         offsetY: 0,
         radius:  glo.GridParams.cellSize *0.3,
      },

      type: {
         ballista: {
            health: 1200,
            armor:   500,
            damages: 200,
            walkSpeed:   10,
            attackSpeed:  8,
            animationDelay: 0.5,
            
            imageSrc: "",
         },

         catapult: {
            health: 2000,
            armor:   700,
            damages: 160,
            walkSpeed:    8,
            attackSpeed: 10,
            animationDelay: 0.5,
            
            imageSrc: "",
         },
      },
   },

}