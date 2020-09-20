import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  OpenALPR,
  OpenALPROptions,
  OpenALPRResult
} from "@ionic-native/openalpr/ngx";
import { Platform, ModalController } from "@ionic/angular";
import { ResultModal } from 'src/app/pages/result/result.page';

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
   //Camera options.
   protected cameraOptions: CameraOptions;
   //OpenALPR options.
   protected openAlprOptions: OpenALPROptions


  constructor(protected camera: Camera,
    protected openalpr: OpenALPR,
    protected platform: Platform,
    protected modalController: ModalController, route: ActivatedRoute, camundaRestService: CamundaRestService, private routerNav: Router) {

    super(route, camundaRestService);
    this.route = route;
    this.camundaRestService = camundaRestService;

    //Set default camera options.
    this.cameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };

    this.openAlprOptions = {
      amount: 3,
      country: this.openalpr.Country.EU
    };
  }

   /**
   * Scan an image for any licenseplates.
   *
   * @param input - determines whether to use the camera or the photolibrary.
   */
  scan(input: string) {
    this.cameraOptions.sourceType =
      input === "camera"
        ? this.camera.PictureSourceType.CAMERA
        : this.camera.PictureSourceType.PHOTOLIBRARY;

    this.camera
      .getPicture(this.cameraOptions)
      .then(imageData => {
        this.openalpr
          .scan(imageData, this.openAlprOptions)
          .then((result: [OpenALPRResult]) => {
            this.showResult(result);
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));

    if (this.platform.is("ios")) {
      this.camera.cleanup();
    }
  }

    /**
   * Get currently selected country.
   */
  getCountry(): string {
    return this.openAlprOptions.country;
  }

  /**
   * Function to get all countries options from the openalpr Country property.
   */
  getAllCountries(): string[] {
    const countries = [];

    for (let country in this.openalpr.Country) {
      if (this.openalpr.Country.hasOwnProperty(country)) {
        const countryValue = this.openalpr.Country[country];
        countries.push({
          value: countryValue,
          label: countryValue.toUpperCase()
        });
      }
    }

    return countries;
  }

  /**
   * Show the result using a modal.
   *
   * @param result
   */
  async showResult(result: OpenALPRResult[]) {
    const modal = await this.modalController.create({
      component: ResultModal,
      componentProps: { result: result, country: this.getCountry() }
    });

    await modal.present();
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
