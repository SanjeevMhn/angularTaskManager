import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskStatusType } from '../workboard/workboard-types';
import { Task } from '../../services/task/task';

export type TaskFormDialogDataType = {
  task_board: TaskStatusType;
  edit_task?: number;
};

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  readonly dialogRef = inject(MatDialogRef<TaskForm>);
  readonly data = inject<TaskFormDialogDataType>(MAT_DIALOG_DATA);

  private fb = inject(FormBuilder);
  private taskService = inject(Task);

  public taskForm!: FormGroup;

  constructor() {
    this.createTaskForm();
    if (this.data.edit_task) {
      let task = this.taskService.getTaskById(this.data.edit_task);
      if (task !== null) {
        this.taskForm.patchValue(task);
      }
    }
  }

  createTaskForm() {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  createTask(event: any) {
    event.preventDefault();
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const { name, description } = this.taskForm.value;

    if (!this.data.edit_task) {
      this.taskService.createTask({
        id: Date.now(),
        name: name,
        description: description,
        assigned_by: '',
        assigned_to: '',
        status: this.data.task_board,
      });
      this.dialogRef.close();
      return;
    }

    let updatedTask = this.taskService.getTaskById(this.data.edit_task);
    if(!updatedTask){
      return
    }
    updatedTask = {
      ...updatedTask,
      name: name,
      description: description,
    };
    this.taskService.updateTask(this.data.edit_task, updatedTask);
    this.dialogRef.close()
  }
}
