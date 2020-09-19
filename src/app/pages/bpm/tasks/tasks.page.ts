import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AccountService } from 'src/app/services/auth/account.service';
import { CamundaRestService } from '../camunda-rest.service';
import { Task } from '../schemas/task.model';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss'],
})
export class TasksPage implements OnInit {
  tasks: Task[] = [];
  taskId?: string;
  formKey?: string;
  isShowTaskView = false;
  account$?: Promise<any>;
  displayedColumns: string[] = ['name', 'assignee', 'created'];

  constructor(public toastController: ToastController, private accountService: AccountService, private camundaRestService: CamundaRestService, private route: ActivatedRoute, public navController: NavController) {}

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
    this.account$.then(() => {
      this.route.params.subscribe(params => {
        if (params.id != null) {
          this.taskId = params.id;
          this.getFormKey();
        } else {
          this.getTasks();
        }
      });
    }).catch(async () => {
      const toast = await this.toastController.create({
        message: 'Service Error',
        duration: 3000,
        position: 'middle',
      });
      toast.present();
    });
  }

  openPage(page) {
    this.navController.navigateForward('/tabs/tasks/' + page.route);
  }

  showTaskView(): void {
    this.isShowTaskView = !this.isShowTaskView;
  }

  getFormKey(): void {
    this.camundaRestService.getTaskFormKey(this.taskId).subscribe(formKey => (this.formKey = formKey.key));
  }

  getTasks(): void {
    this.camundaRestService.getTasksByGroup('trafficAdmin').subscribe(tasks => {
      this.tasks = tasks;
    });
  }
  getTasksByUser(assignee?: string): void {
    if (assignee) {
      this.camundaRestService.getTasksByAssignee(assignee).subscribe(tasks => {
        this.tasks = tasks;
      });
    }
  }
}
