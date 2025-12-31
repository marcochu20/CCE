
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum ColumnStatus {
  BACKLOG = 'Backlog',
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: ColumnStatus;
  priority: Priority;
  createdAt: number;
  tags: string[];
}

export interface KanbanState {
  tasks: Task[];
  projectName: string;
}
