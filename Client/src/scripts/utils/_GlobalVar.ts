
"use strict"

import {
   ICanvas,
   ICtx,
   IAgentClass,
} from "./interfaces"

import { GridClass } from "../classes/GridClass"

import { reactive, readonly } from 'vue';

// ================================================================================================
// Global Variables
// ================================================================================================
export const glo = reactive({

   Faction: "Orange",

   Debug: {
      showWallCol: false,
      hoverColor: "blue",
   },
   
   GridParams: {
      cellSize:  40,
      gridSize:  1440,
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

   Viewport:       {
      x:      0,
      y:      0,
      height: 0,
      width:  0,
   },

   ViewportSqr:    {
      x:      0,
      y:      0,
      height: 0,
      width:  0,
   },

   GridAngle:       undefined as number    | undefined,
   Grid:            undefined as GridClass | undefined,
   ComputedCanvas:  undefined as DOMMatrix | undefined,
   
   // --- Positions ---
   ViewportOffset: {
      x: 0,
      y: 0,
   },

   ScrollOffset:   {
      x: 0,
      y: 0,
   },

   IsoGridPos:     {
      x: 0,
      y: 0,
   },

   HoverCell:      {
      id: "",

      gridPos: {
         x: 0,
         y: 0,
      },
   },

   // --- Lists ---
   AvailableIDArray:  [] as number[],
   AgentsList:        {} as IAgentClass,
   OldSelectList:     {} as IAgentClass,
   CurrentSelectList: {} as IAgentClass,

   // --- Ints ---
   MouseSpeed: 5,
   MaxPop:     2000,
   CurrentPop: 0,

   // --- TEST ---
   TestViewport: {
      x: 0,
      y: 0,
      width:  1000, // *0.5 => x
      height: 650,  // *0.5 => y
   },

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