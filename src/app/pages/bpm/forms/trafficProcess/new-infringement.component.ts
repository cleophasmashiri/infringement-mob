import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CamundaRestService } from '../../camunda-rest.service';
import { InfringementTypeSchema } from '../../schemas/infringement-type.schema';
import { InfringementSchema } from '../../schemas/infringement.schema';
import { StartProcessInstanceComponent } from '../general/start-process-instance.component';

@Component({
  selector: 'app-new-infringement',
  templateUrl: './new-infringement.component.html',
  styleUrls: ['./new-infringement.component.scss'],
})
export class NewInfringementComponent extends StartProcessInstanceComponent {
  submitted = false;
  plateNumber = '';
  model = new InfringementSchema('', InfringementTypeSchema.Other, '', '', '', '', '', '');
  // private fileToUpload?: File;
  // private SUCCESS = false;
  infringmentTypes = [
    { value: 'Other', name: 'Other' },
    { value: 'OverSpeeding', name: 'Over-Speeding' },
    { value: 'ParkingInfringement', name: 'Parking Infringement' },
  ];
  links = [
    { name: 'Create another infringement', url: '/process/startprocess/trafficProcess' },
    { name: 'View Tasks', url: '/process/tasklist' },
  ];
  route: ActivatedRoute;
  camundaRestService: CamundaRestService;

  constructor(route: ActivatedRoute, camundaRestService: CamundaRestService, private routerNav: Router) {
    super(route, camundaRestService);
    this.route = route;
    this.camundaRestService = camundaRestService;
  }

  // onFileComplete(data: any): void {}

  onSubmit(): void {
    const processDefinitionKey = environment.processKey;;
      const variables = this.generateVariablesFromFormFields();
      this.camundaRestService.postProcessInstance(processDefinitionKey, variables).subscribe(() => {
        this.routerNav.navigate(['tabs/tasks']);
      });
      this.submitted = false;
  }

  generateVariablesFromFormFields(): any {
    const variables = {
      variables: {},
    };
    Object.keys(this.model).forEach(field => {
      variables.variables[field] = {
        value: this.model[field],
      };
    });

    return variables;
  }
  showTasks(): void {
    this.submitted = false;
  }
  toBase64 = (file: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  handleFileInput(files: any): void {
    // this.fileToUpload = files.item(0);
    // this.uploadFileToActivity();
  }
  // TODO must resolve file upload
  uploadFileToActivity(): void {
    // this.toBase64(this.fileToUpload)
    // .then((res: string) => this.model.image1 = res);
  }
}
