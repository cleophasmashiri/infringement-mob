import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CamundaRestService } from '../camunda-rest.service';

@Component({
  selector: 'app-start-process',
  templateUrl: './start-process.component.html',
  styleUrls: ['./start-process.component.scss'],
})
export class StartProcessComponent implements OnInit {
 
  processDefinitionKey?: string = environment.processKey;
  formKey?: string;
  rootViewContainer = null;

  constructor(private camundaRestService: CamundaRestService) {}

  ngOnInit(): void {
    if (this.processDefinitionKey) {
      this.loadTaskKey();
    }
  }

  loadTaskKey(): void {
    this.camundaRestService.getProcessDefinitionTaskKey(this.processDefinitionKey).subscribe(formKey => {
      this.formKey = formKey.key;
    });
  }
}
