
"use strict"

import {
   ICanvas,
   ICtx,
} from "./interfaces"

import {
   Grid,
   Agent,
} from "../classes/_Export"

import { reactive, readonly } from 'vue';

// ================================================================================================
// Global Variables
// ================================================================================================
export const glo = reactive({

   Faction: "Orange",

   Params: {} as any,
   
   GridParams: {                    // =========>  grid class
      cellSize:  40,
      gridSize:  1600,
      // cellSize:  80,
      // gridSize:  800,
   },


   // --- Constants ---
   Cos_45:  0.707,                  // =========>  viewport class
   Cos_30:  0.866,
   
   // --- DOM ---
   Canvas:         {} as ICanvas,   // =========>  viewport class
   Ctx:            {} as ICtx,

   Viewport: {                      // =========>  viewport class
      x: 0,
      y: 0,
      width:  1400, // Has to match CSS canvas Isometircs.vue & Cartesian.vue
      height: 800,  // Has to match CSS canvas Isometircs.vue & Cartesian.vue
   },

   Grid:              undefined as Grid | undefined, // =========>  grid class

   GridAngle:         undefined as number    | undefined, // =========>  viewport class
   IsoSelectComputed: undefined as DOMMatrix | undefined,
   TerrainComputed:   undefined as DOMMatrix | undefined,
   
   // --- Positions ---
   ViewportOffset: {                // =========>  viewport class
      x: 0,
      y: 0,
   },

   TerrainOffset: {                 // =========>  viewport class
      x: 0,
      y: 0,
   },

   Scroll: {                        // rename Offset =========>  viewport class
      x: 0,
      y: 0,
   },

   IsoGridPos: {                    // =========>  viewport class
      x: 0,
      y: 0,
   },

   HoverCell: {                     // =========>  cursor class
      id: "",

      gridPos: {
         x: 0,
         y: 0,
      },
   },

   // --- Lists ---
   AvailableIDArray:  [] as number[],                          // =========>  gameManager class
   AgentsList:        new Map() as Map<number, Agent>,
   OldSelectList:     new Set() as Set<Agent>,
   CurrentSelectList: new Set() as Set<Agent>,

   // --- Ints ---
   MouseSpeed: 7,          // rename ScrollSpeed =========>  viewport class
   
   DetectSize: 60,         // =========>  viewport class
   
   MaxPop:     2000,       // =========>  gameManager class
   CurrentPop: 0,

   max_X:      0.7,        // =========>  viewport class
   max_Y:      0.7 *0.5,

   flatG_Img: new Image(),
   highG_Img: new Image(),
   walls_Img: new Image(),

   flatG_Src: "Terrain/Flat_Grass.png",
   highG_Src: "Terrain/High_Grass.png",
   walls_Src: "Buildings/wall.png",

})

export const readGlo = readonly(glo);


// const files = {};

// const filesSources = [
//    "Terrain/Herb_01.png",
//    "Terrain/Herb_02.png",
//    "Terrain/Herb_03.png",

//    "Character/Player_01.png",
//    "Character/Player_02.png",
//    "Character/Enemy_01.png",
//    "Character/Enemy_02.png",
//    "Character/Enemy_03.png",

//    "UI/Panel_01.png",
//    "UI/Panel_02.png",
//    "UI/Panel_03.png",
// ];

// const generateImg = () => {

//    filesSources.forEach(src => {

   
//       const splitSrc_1 = src.split("/").pop();
//       const splitSrc_2 = splitSrc_1.split(".").pop();

//       files[splitSrc_2] = {
//          img: new Image(),
//          isLoaded: false,
//       };
//       files[splitSrc_2].img.src = src;
//       files[splitSrc_2].img.onload = () => files[splitSrc_2].img.isLoaded = true;
//    })

//    // Output :
//    // const files = {

//    //    Herb_01: {
//    //       img:      new Image(),
//    //       isLoaded: true,
//    //    },

//    //    Player_01: {
//    //       img:      new Image(),
//    //       isLoaded: true,
//    //    },

//    //    Panel_03: {
//    //       img:      new Image(),
//    //       isLoaded: true,
//    //    },
//    // };
// }