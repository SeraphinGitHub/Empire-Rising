
import {
   AgentClass,
   CellClass,
} from "../classes/_Export";


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

export interface IPositionList {
   [key: string]: IPosition,
}

export interface INumberList {
   [key: string]: number[],
}

export interface ICanvas {
   [key: string]: HTMLCanvasElement,
}

export interface ICtx {
   [key: string]: CanvasRenderingContext2D,
}

export interface ICellClass {
   [key: string]: CellClass,
}

export interface IAgentClass {
   [key: number]: AgentClass,
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

export interface ICircle extends IPosition {
   radius: number,
}

export interface ILine {
   startX: number;
   startY: number;
   endX:   number;
   endY:   number;
}

export interface IAgentCost {
   [key: number]: {
      hCost:        number,
      gCost:        number,
      fCost:        number,
      cameFromCell: CellClass | undefined,
   }
}