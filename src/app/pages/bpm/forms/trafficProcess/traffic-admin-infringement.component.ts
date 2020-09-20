import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CamundaRestService } from '../../camunda-rest.service';
import { InfringementTypeSchema } from '../../schemas/infringement-type.schema';
import { InfringementSchema } from '../../schemas/infringement.schema';
import { CompleteTaskComponent } from '../general/complete-task.component';

@Component({
  selector: 'app-traffic-admin-infringement',
  templateUrl: './traffic-admin-infringement.component.html',
  styleUrls: [],
})
export class TrafficAdminInfringementComponent extends CompleteTaskComponent {
  submitted = false;
  model = new InfringementSchema('', InfringementTypeSchema.Other, '', '', '', '', '', '');
  adminChoices = [
    { name: 'Cancel Infringement', value: 'Cancel' },
    { name: 'Assign Another Driver', value: 'Assign Another Driver' },
    { name: 'Go To Court', value: 'Go To Court' },
  ];

  constructor(route: ActivatedRoute, router: Router, camundaRestService: CamundaRestService) {
    super(route, router, camundaRestService);
    this.route.params.subscribe(params => {
      const taskId = params.id;
      const variableNames = Object.keys(this.model).join(',');
      this.loadExistingVariables(taskId, variableNames);
    });
  }
}
