import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { TaskStatusType, TaskType, WorkboardType } from './workboard-types';
import { MatDialog } from '@angular/material/dialog';
import { TaskForm } from '../task-form/task-form';
import { Task } from '../../services/task/task';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-workboard',
  imports: [],
  templateUrl: './workboard.html',
  styleUrl: './workboard.css',
})
export class Workboard {
  private dialog = inject(MatDialog);

  @ViewChild('taskDialog', { static: false }) taskDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('menuList', { static: false }) menuList!: ElementRef<HTMLElement>;

  public tasksService = inject(Task);
  public workboards: WritableSignal<Array<WorkboardType>> = signal([
    {
      id: 1,
      name: 'Backlogs',
      tasks: [],
    },
    {
      id: 2,
      name: 'Doing',
      tasks: [],
    },
    {
      id: 3,
      name: 'QA',
      tasks: [],
    },
    {
      id: 4,
      name: 'QA Approved',
      tasks: [],
    },
    {
      id: 5,
      name: 'Redo',
      tasks: [],
    },
  ]);

  workboardsTasks = computed(() => {
    return this.tasksService.getAllTasks().length > 0
      ? Object.values(
          this.workboards().reduce((acc: any, curr) => {
            this.tasksService.getAllTasks().forEach((task) => {
              if (curr.name == task.status) {
                if (!acc[curr.name]) {
                  acc[curr.name] = {};
                  acc[curr.name] = {
                    ...curr,
                    tasks: [task],
                  };
                } else {
                  acc[curr.name] = {
                    ...acc[curr.name],
                    tasks: [...acc[curr.name].tasks, task],
                  };
                }
              } else {
                if (!acc[curr.name]) {
                  acc[curr.name] = {};
                  acc[curr.name] = {
                    ...curr,
                    tasks: [],
                  };
                }
              }
            });

            return acc;
          }, {}) as WorkboardType[]
        )
      : this.workboards();
  });

  addTask(board: string) {
    const taskFormDialog = this.dialog
      .open(TaskForm, {
        data: {
          task_board: board,
        },
      })
      .addPanelClass('w-[min(90%,62rem)]');

    taskFormDialog.afterClosed().subscribe((_) => {
      this.menuList.nativeElement.hidePopover();
    });
  }

  editTask(board: string, task: number) {
    this.dialog
      .open(TaskForm, {
        data: {
          task_board: board,
          edit_task: task,
        },
      })
      .addPanelClass('w-[min(90%,62rem)]');
  }

  draggedTask: TaskType | null = null;
  dragging = false;

  onTaskDragStart(event: DragEvent, task: TaskType) {
    this.draggedTask = task;
    this.dragging = true
  }

  onTaskDrop(event: any, board: WorkboardType) {
    if (this.draggedTask == null) {
      event.preventDefault();
      return;
    }

    this.tasksService.updateTask(this.draggedTask.id, {
      ...this.draggedTask,
      status: board.name as TaskStatusType,
    });

    this.draggedTask = null
    this.dragging = false
  }
}
