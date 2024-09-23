
"use strict"

import { glo } from "./_GlobalVar";

// ================================================================================================
// Units Parameters
// ================================================================================================
export const unitParams = {

   infantry: {
      popCost: 1,

      collider: {
         offsetY: -15,
         radius:  glo.GridParams.cellSize *0.4,
      },

      unitType: {
         worker: {
            health: 200,
            armor:    0,
            damages: 15,
            moveSpeed:  4,
            buildSpeed: 10,
            attackSpeed: 7,
            animationDelay: 0.5,
            
            imgSrc: "Units/Download36395.png",
         },

         swordsman: {
            health: 500,
            armor:  200,
            damages: 40,
            moveSpeed:   3,
            attackSpeed: 12,
            animationDelay: 0.5,
            
            imgSrc: `Units/Swordsman_${glo.Faction}.png`,
         },
         
         bowman: {
            health: 300,
            armor:   80,
            damages: 60,
            moveSpeed:   4,
            attackSpeed: 14,
            animationDelay: 0.5,
            
            imgSrc: "",
         },
         
         spearman: {
            health: 400,
            armor:  120,
            damages: 50,
            moveSpeed:   3,
            attackSpeed: 10,
            animationDelay: 0.5,
            
            imgSrc: "",
         },
      },
   },

   cavalry: {
      popCost: 2,

      collider: {
         offsetY: 0,
         radius:  glo.GridParams.cellSize *0.2,
      },

      unitType: {
         swordsman: {
            health: 700,
            armor:  300,
            damages: 50,
            moveSpeed:   6,
            attackSpeed: 12,
            animationDelay: 0.5,
            
            imgSrc: "",
         },

         bowman: {
            health: 500,
            armor:  130,
            damages: 70,
            moveSpeed:   7,
            attackSpeed: 14,
            animationDelay: 0.5,
            
            imgSrc: "",
         },
      },
   },

   machinery: {
      popCost: 3,

      collider: {
         offsetY: 0,
         radius:  glo.GridParams.cellSize *0.3,
      },

      unitType: {
         ballista: {
            health: 1200,
            armor:   500,
            damages: 200,
            moveSpeed:   2,
            attackSpeed:  8,
            animationDelay: 0.5,
            
            imgSrc: "",
         },

         catapult: {
            health: 2000,
            armor:   700,
            damages: 160,
            moveSpeed:    1,
            attackSpeed: 10,
            animationDelay: 0.5,
            
            imgSrc: "",
         },
      },
   },

}