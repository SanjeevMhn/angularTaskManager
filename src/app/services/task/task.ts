import { Injectable, signal, WritableSignal } from '@angular/core';
import { TaskType, WorkboardType } from '../../components/workboard/workboard-types';

@Injectable({
  providedIn: 'root',
})
export class Task {
  private tasksList: WritableSignal<Array<TaskType>> = signal<Array<TaskType>>([]);

  getAllTasks(): Array<TaskType> {
    return this.tasksList();
  }

  createTask(task: TaskType) {
    this.tasksList.update((tasks) => [...tasks, task]);
  }

  getTaskById(id: number): TaskType | null {
    return this.tasksList().find((task) => task.id == id)!;
  }

  updateTask(id: number, updatedTask: TaskType): void {
    this.tasksList.update((tasks) => {
      return tasks.map((task) => {
        if (task.id == id) {
          return {
            ...task,
            ...updatedTask,
          };
        }
        return task;
      });
    });
  }
}
