import { Position } from './position.model';

export interface Task{
    id?: number
    pid?: number;
    title: string
    userID: string
    isDone: boolean
    describe?: string
    position?: Position
  }