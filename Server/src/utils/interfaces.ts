
import {
   Cell,
   Player,
   Agent,
} from "../classes/_Export";


// ==================================================================
// Classes Interfaces
// ==================================================================
export interface IPlayer {
   [key: number]: Player,
}

export interface IAgent {
   [key: number]: Agent,
}

export interface ICell {
   [key: string]: Cell,
}


// ==================================================================
// Lists Interfaces
// ==================================================================
export interface IString {
   [key: string]: string,
}

export interface IBoolean {
   [key: string]: boolean,
}

export interface INumber {
   [key: string]: number,
}

export interface INumberList {
   [key: string]: INumber,
}

export interface IPosList {
   [key: string]: IPosition,
}

export interface IPosList_List {
   [key: string]: IPosList,
}

export interface ISquareList {
   [key: string]: ISquare,
}

export interface ILineList {
   [key: string]: ILine,
}

export interface ICoordArray {
   [key: string]: [number, number, boolean],
}

export interface INebList {
   [key: string]: {
      id:         string,
      isDiagonal: boolean,
   },
}

export interface ICanvas {
   [key: string]: HTMLCanvasElement,
}

export interface ICtx {
   [key: string]: CanvasRenderingContext2D,
}


// ==================================================================
// Normal Interfaces
// ==================================================================
export interface IPosition {
   x: number,
   y: number,
}

export interface ISize {
   width:  number,
   height: number,
}

export interface ISquare extends IPosition, ISize {
   
}

export interface ICircle extends IPosition {
   radius: number,
}

export interface ILine {
   startX: number;
   startY: number;
   endX:   number;
   endY:   number;
}

export interface ICost {
   hCost:        number,
   gCost:        number,
   fCost:        number,
   cameFromCell: Cell | undefined,
}

export interface IScroll {
   speed:    number,
   oldDelta: IPosition,
   curDelta: IPosition,
}