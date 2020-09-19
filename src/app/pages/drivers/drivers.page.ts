import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-drivers',
  templateUrl: 'drivers.page.html',
  styleUrls: ['drivers.page.scss'],
})
export class DriversPage {
  drivers: Array<any> = [
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/drivers/' + page.route);
  }
}
