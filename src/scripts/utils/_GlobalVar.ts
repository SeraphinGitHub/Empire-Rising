
"use strict"

import {
   IPosition,
   ISquare,
   ICanvas,
   ICtx,
   IAgentClass,
} from "./interfaces"

import { GridClass } from "../classes/GridClass"

const emptyPosition: IPosition = {
   x: 0,
   y: 0,
}

const emptySquare: ISquare = {
   x:      0,
   y:      0,
   height: 0,
   width:  0,
}

// ================================================================================================
// Global Variables
// ================================================================================================
export const glo = {

   Faction: "Orange",

   Debug: {
      showWallCol: false,
      hoverColor: "blue",
   },
   
   GridParams: {
      cellSize:  40,
      gridSize:  1440,
      cellRange: 0,
   },

   SelectArea: {
      oldPos: {
         cartesian: emptyPosition,
         isometric: emptyPosition,
      },

      currentPos: {
         cartesian: emptyPosition,
         isometric: emptyPosition,
      },

      height: undefined,
      width:  undefined,

      borderColor:  "dodgerblue",
      filledColor:  "rgba(30, 144, 255, 0.3)",
      lineWidth:    2,
      isSelecting : false,
   },

   // --- Constants ---
   Cos_45deg:  0.707,
   Cos_30deg:  0.866,
   
   // --- DOM ---
   Canvas:          {} as ICanvas,
   Ctx:             {} as ICtx,
   Viewport:        emptySquare,
   ViewportSqr:     emptySquare,
   GridAngle:       0,
   Grid:            undefined as GridClass | undefined,
   ComputedCanvas:  undefined as DOMMatrix | undefined,
   
   // --- Positions ---
   ViewportOffset: emptyPosition,
   ScrollOffset:   emptyPosition,
   IsoGridPos:     emptyPosition,

   HoverCell:  {
      id: "",
      gridPos: emptyPosition,
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

}


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