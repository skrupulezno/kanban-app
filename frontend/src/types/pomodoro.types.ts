import { IBase } from './root.types';

export interface IPomodoroRoundResponse extends IBase {
  isCompleted?: boolean;
  totalSeconds: number;
}

export interface IPomodoroSessionResponse extends IBase {
  isCompleted?: boolean;
  rounds?: IPomodoroRoundResponse[];
}

export type TypePomodoroSessionFormState = Partial<
  Omit<IPomodoroSessionResponse, 'id' | 'createdAtd' | 'updatedAt'>
>;

export type TypePomodoroRoundFormState = Partial<
  Omit<IPomodoroRoundResponse, 'id' | 'createdAt' | 'updatedAt'>
>;
