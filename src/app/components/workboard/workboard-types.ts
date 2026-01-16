export type TaskStatusType = 'Backlog' | 'Doing' | 'QA' | 'QA Approved' | 'Redo';

export type TaskType = {
  id: number;
  name: string;
  description: string;
  assigned_to: string;
  assigned_by: string;
  status: TaskStatusType;
};

export type WorkboardType = {
  id: number;
  name: string;
  tasks: Array<TaskType>;
};
