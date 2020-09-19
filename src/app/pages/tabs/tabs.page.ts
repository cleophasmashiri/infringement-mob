import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  tabs = [{ name: 'home', icon: 'flash', title: 'Home' },
  { name: 'tasks', icon: 'apps', title: 'Tasks' },
  { name: 'newInfringement', icon: 'apps', title: 'New Infringements' },
  { name: 'Infringements', icon: 'apps', title: 'Infringements' },
  { name: 'account', icon: 'apps', title: 'Account' }
]
}
