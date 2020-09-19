import { Component, OnInit, Input } from '@angular/core';
import { CamundaRestService } from '../camunda-rest.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  @Input()
  taskId?: string;
  formKey?: string;

  constructor(private camundaRestService: CamundaRestService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.taskId) {
      this.getFormKey();
    }
  }

  getFormKey(): void {
    this.camundaRestService.getTaskFormKey(this.taskId).subscribe(formKey => (this.formKey = formKey.key));
  }
}
