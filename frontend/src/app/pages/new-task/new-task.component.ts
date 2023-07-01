import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  inputValue: string = '';
  hasClickedOut: boolean = false;
  isInputEmpty: boolean = true;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) {}

  listId: string = '';

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.listId = params['listId'];
      }
    )
  }

  createTask(title: string) {
    this.taskService.createTask(title, this.listId).subscribe((newTask: Object) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    })
  }

  onInputBlur(value: string) {
    this.hasClickedOut = true;
    this.inputValue = value;
    this.isInputEmpty = value.trim() === '';
  }

}
