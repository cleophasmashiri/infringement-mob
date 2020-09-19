import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-bpm',
  templateUrl: 'bpm.page.html',
  styleUrls: ['bpm.page.scss'],
})
export class BpmPage {
  bpm: Array<any> = [
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/bpm/' + page.route);
  }
}
