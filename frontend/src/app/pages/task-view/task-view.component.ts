import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
  lists: any;
  tasks: any;

  selectedListId: string = '';

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    this.route.params.subscribe(
      (params: Params) => {
        if (params.listId) {
          this.selectedListId = params.listId;
          this.taskService.getTasks(params.listId).subscribe((tasks: any) => {
            this.tasks = tasks;
          })
        } else {
          this.tasks = undefined;
        }
        
      }
    )

    this.taskService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    })
  }

  onTaskClick(task: Task) {
    // set the task to completed
    this.taskService.complete(task).subscribe(() => {
      // the task has been completed
      console.log("Completed successfully!");
      task.completed = !task.completed;
    })
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      this.router.navigate(['/lists']);
    })
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter((val: Task) => val._id != id);
    })
  }

  onSignOut(): void {
    this.authService.signOut().subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error signing out:', error);
      }
    );
  }
}
