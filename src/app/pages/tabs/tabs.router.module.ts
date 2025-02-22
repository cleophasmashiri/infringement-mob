import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: '../home/home.module#HomePageModule',
          },
        ],
      },
      {
        path: 'infringements',
        children: [
          {
            path: '',
            loadChildren: '../bpm/bpm.module#BpmPageModule',
          },
        ],
      },
      {
        path: 'tasks',
        children: [
          {
            path: '',
            loadChildren: '../bpm/tasks/tasks.module#TasksPageModule',
          },
        ],
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: '../account/account.module#AccountPageModule',
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
