export interface ITodoItem {
  id: string;
  title: string;
  remark?: string;
  date: number;
  complete: boolean;
  deadline?: number;
}

export type TTodoList = ITodoItem[];
