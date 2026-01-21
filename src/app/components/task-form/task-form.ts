import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskStatusType, TaskType } from '../workboard/workboard-types';
import { Task } from '../../services/task/task';
import { WorkboardService } from '../../services/workboard/workboard-service';

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
  private workboardService = inject(WorkboardService);

  public taskForm!: FormGroup;

  constructor() {
    this.createTaskForm();
    if (this.data.edit_task) {
      this.taskService.getTaskById(this.data.edit_task).subscribe({
        next: (res: any | null) => {
          if (!res || res.length == 0) {
            return;
          }
          this.taskForm.patchValue({
            name: res[0].name,
            description: res[0].description,
            workboard_id: this.data.task_board
          });
        },
      });
    }
    this.taskForm.get('workboard_id')?.setValue(Number(this.data.task_board));
  }

  createTaskForm() {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      workboard_id: ['', [Validators.required]],
    });
  }

  createTask(event: any) {
    event.preventDefault();
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const { name, description, workboard_id } = this.taskForm.value;

    if (!this.data.edit_task) {
      this.taskService
        .createTask({
          name: name,
          description: description,
          workboardId: workboard_id,
        })
        .subscribe({
          next: (res: any) => {
            this.dialogRef.close();
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      return;
    }

    const updatedTask: TaskType = {
      id: this.data.edit_task,
      name: name,
      description: description,
      workboardId: workboard_id,
    };

    this.taskService.updateTask(this.data.edit_task, updatedTask).subscribe({
      next: (_ => {
        this.dialogRef.close();
      }),
      error: (err => {
        console.error(err);
      })
    });
  }
}
