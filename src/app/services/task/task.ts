import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TaskType, WorkboardType } from '../../components/workboard/workboard-types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Task {
  private tasksList: WritableSignal<Array<TaskType>> = signal<Array<TaskType>>([]);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllTasks(): Array<TaskType> {
    return this.tasksList();
  }

  createTask(task: Omit<TaskType, 'id'>) {
    return this.http.post(`${this.apiUrl}/add-task`, task);
  }

  getTaskById(id: number): Observable<TaskType | null> {
    return this.http.get<TaskType | null>(`${this.apiUrl}/task/${id}`);
  }

  updateTask(id: number, updatedTask: TaskType){
    return this.http.put(`${this.apiUrl}/task/${id}`, updatedTask);
  }
}
