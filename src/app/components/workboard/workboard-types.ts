export type TaskStatusType = 'Backlog' | 'Doing' | 'QA' | 'QA Approved' | 'Redo';

export type TaskType = {
  id: number;
  name: string;
  description: string;
  workboardId: number
};

export type WorkboardType = {
  id: number;
  name: string;
  tasks: Array<TaskType>;
};
