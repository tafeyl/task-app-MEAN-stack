import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { Router } from '@angular/router';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {
  inputValue: string = '';
  hasClickedOut: boolean = false;
  isInputEmpty: boolean = true;

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit() {

  }

  createList(title: string) {
    this.taskService.createList(title).subscribe(next => {
      const list: List = next as List;

      this.router.navigate([ '/lists', list._id ]);
    })
  }

  onInputBlur(value: string) {
    this.hasClickedOut = true;
    this.inputValue = value;
    this.isInputEmpty = value.trim() === '';
  }  
}
