import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewInfringementComponent } from './new-infringement.component';
import { TrafficAdminInfringementComponent } from './traffic-admin-infringement.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ResultModalModule } from 'src/app/pages/result/result.module';

@NgModule({
  entryComponents: [NewInfringementComponent, TrafficAdminInfringementComponent],
  declarations: [NewInfringementComponent, TrafficAdminInfringementComponent],
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, ResultModalModule ],
  exports: [NewInfringementComponent
    , TrafficAdminInfringementComponent]
})
export class TrafficProcessModule {}

export { NewInfringementComponent } from './new-infringement.component';
export { TrafficAdminInfringementComponent } from './traffic-admin-infringement.component';
