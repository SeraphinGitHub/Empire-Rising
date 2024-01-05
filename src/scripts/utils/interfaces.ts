
import { CellClass } from "../classes/_Export";

export interface IString {
   [key: string]: string,
}

export interface IBoolean {
   [key: string]: boolean,
}

export interface INumber {
   [key: string]: number,
}

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

export interface ICellClass {
   [key: string]: CellClass,
}