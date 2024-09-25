
"use strict"

import {
   ICanvas,
   ICtx,
} from "./interfaces"

import {
   GridClass,
   AgentClass,
} from "../classes/_Export"

import { reactive, readonly } from 'vue';

// ================================================================================================
// Global Variables
// ================================================================================================
export const glo = reactive({

   Faction: "Orange",

   Params: {} as any,
   
   GridParams: {
      cellSize:  40,
      gridSize:  1600,
      // cellSize:  80,
      // gridSize:  800,
   },

   SelectArea: {
      oldPos: {

         cartesian: {
            x: 0,
            y: 0,
         },

         isometric: {
            x: 0,
            y: 0,
         },
      },

      currentPos: {

         cartesian: {
            x: 0,
            y: 0,
         },

         isometric: {
            x: 0,
            y: 0,
         },
      },

      height: undefined as number | undefined,
      width:  undefined as number | undefined,

      borderColor:  "dodgerblue",
      filledColor:  "rgba(30, 144, 255, 0.3)",
      lineWidth:    2,
      isSelecting : false,
   },

   // --- Constants ---
   Cos_45deg:  0.707,
   Cos_30deg:  0.866,
   
   // --- DOM ---
   Canvas:         {} as ICanvas,
   Ctx:            {} as ICtx,

   Viewport: {
      x: 0,
      y: 0,
      width:  1400, // Has to match CSS canvas Isometircs.vue & Cartesian.vue
      height: 800,  // Has to match CSS canvas Isometircs.vue & Cartesian.vue
   },

   GridAngle:         undefined as number    | undefined,
   Grid:              undefined as GridClass | undefined,
   IsoSelectComputed: undefined as DOMMatrix | undefined,
   TerrainComputed:   undefined as DOMMatrix | undefined,
   
   // --- Positions ---
   ViewportOffset: {
      x: 0,
      y: 0,
   },

   TerrainOffset: {
      x: 0,
      y: 0,
   },

   Scroll: {
      x: 0,
      y: 0,
   },

   IsoGridPos: {
      x: 0,
      y: 0,
   },

   HoverCell: {
      id: "",

      gridPos: {
         x: 0,
         y: 0,
      },
   },

   // --- Lists ---
   AvailableIDArray:  [] as number[],
   AgentsList:        new Map() as Map<number, AgentClass>,
   OldSelectList:     new Set() as Set<AgentClass>,
   CurrentSelectList: new Set() as Set<AgentClass>,

   // --- Ints ---
   MouseSpeed: 7,
   DetectSize: 60,
   MaxPop:     2000,
   CurrentPop: 0,
   max_X:      0.7,
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