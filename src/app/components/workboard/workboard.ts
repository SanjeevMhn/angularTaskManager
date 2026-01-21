import {
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { TaskStatusType, TaskType, WorkboardType } from './workboard-types';
import { MatDialog } from '@angular/material/dialog';
import { TaskForm } from '../task-form/task-form';
import { Task } from '../../services/task/task';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { WorkboardService } from '../../services/workboard/workboard-service';
import { AsyncPipe } from '@angular/common';
import { startWith, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-workboard',
  imports: [AsyncPipe],
  templateUrl: './workboard.html',
  styleUrl: './workboard.css',
})
export class Workboard {
  private dialog = inject(MatDialog);

  @ViewChild('taskDialog', { static: false }) taskDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('menuList', { static: false }) menuList!: ElementRef<HTMLElement>;

  public tasksService = inject(Task);
  private workboardService = inject(WorkboardService);

  getWorkboardSubject = new Subject<void>();
  getWorkboards$ = this.getWorkboardSubject.pipe(
    startWith(undefined),
    switchMap((_) => {
      return this.workboardService.getBoards();
    }),
  );

  addTask(board_id: number) {
    const taskFormDialog = this.dialog
      .open(TaskForm, {
        data: {
          task_board: board_id,
        },
      })
      .addPanelClass('w-[min(90%,62rem)]');

    taskFormDialog.afterClosed().subscribe((_) => {
      this.menuList.nativeElement.hidePopover();
      this.workboardService.getBoards();
      this.getWorkboardSubject.next();
    });
  }

  editTask(board: number, task: number) {
    const dialog = this.dialog
      .open(TaskForm, {
        data: {
          task_board: board,
          edit_task: task,
        },
      })
      .addPanelClass('w-[min(90%,62rem)]');

    dialog.afterClosed().subscribe(_ => {
      this.getWorkboardSubject.next();
    })
  }

  draggedTask: TaskType | null = null;
  dragging = false;

  onTaskDragStart(event: DragEvent, task: TaskType) {
    this.draggedTask = task;
    this.dragging = true;
  }

  onTaskDrop(event: any, board_id: number) {
    if (this.draggedTask == null) {
      event.preventDefault();
      return;
    }

    this.tasksService
      .updateTask(this.draggedTask.id, {
        ...this.draggedTask,
        workboardId: board_id,
      })
      .subscribe({
        next: (_) => {
          this.getWorkboardSubject.next();
        },
        error: (err) => {
          console.error(err);
        },
      });

    this.draggedTask = null;
    this.dragging = false;
  }
}
