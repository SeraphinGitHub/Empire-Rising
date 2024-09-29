
import {
   Agent,
   PlayerClass,
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

export interface IPlayerClass {
   [key: number]: PlayerClass,
}

export interface IAgent {
   [key: number]: Agent,
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