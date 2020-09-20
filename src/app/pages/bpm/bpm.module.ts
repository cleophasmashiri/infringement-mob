import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { BpmPage } from './bpm.page';
import { NewInfringementComponent } from './forms/trafficProcess/traffic-process.module';
import { GenericFormComponent } from './generic-form/generic-form.component';
import { StartProcessComponent } from './start-process/start-process.component';

const routes: Routes = [
  {
    path: '',
    component: BpmPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
    
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [BpmPage, StartProcessComponent, GenericFormComponent,NewInfringementComponent],
})
export class BpmPageModule {}
