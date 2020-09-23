import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  OpenALPR,
  OpenALPROptions,
  OpenALPRResult
} from "@ionic-native/openalpr/ngx";
import { Platform, ModalController, ToastController } from "@ionic/angular";
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
  logs: any[]  = [];
  // image: any;
  // imageData: any;
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

  constructor(private http: HttpClient, protected camera: Camera,
    protected openalpr: OpenALPR,
    protected platform: Platform,
    public toastController: ToastController,
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

  upload(){
    // let url = 'https://example.com/upload.php';
    // const date = new Date().valueOf();
  
    // // Replace extension according to your media type
    // const imageName = date+ '.jpeg';
    // // call method that creates a blob from dataUri
    // const imageBlob = this.dataURItoBlob(this.imageData);
    // const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' })
  
    // let  postData = new FormData();
    // postData.append('file', imageFile);
  
    // let data:Observable<any> = this.http.post(url,postData);
    // data.subscribe((result) => {
    //   this.imageData = null;
    //   this.image = null;
    //   console.log(result);
    // });
  }

  // this function creates blob files from dataURLI:
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
     }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });    
   return blob;
  }
  

  /**
  * Scan an image for any licenseplates.
  *
  * @param input - determines whether to use the camera or the photolibrary.
  */
  scan(input: string) {
    // this.image = null;
    // this.imageData = null;

    this.logs.push('Camera scan started..' + input);

    this.cameraOptions.sourceType =
      input === "camera"
        ? this.camera.PictureSourceType.CAMERA
        : this.camera.PictureSourceType.PHOTOLIBRARY;
    this.camera
      .getPicture(this.cameraOptions)
      .then(imageData => {
        // this.image = (<any>window).Ionic.WebView.convertFileSrc(imageData);
        this.logs.push('Camera imageData..');
        this.logs.push(imageData);
        this.openalpr
          .scan(imageData, this.openAlprOptions)
          .then((result: [OpenALPRResult]) => {
            this.logs.push('Before call showResult..');
            this.logs.push(result);
            this.showResult(result);
            return;
          })
          .catch(error => {
            this.logs.push('Error on openalpr.scan..');
            this.logs.push(error);
            return;
            //console.error(error);
          });
      })
      .catch(error => {
        this.logs.push('Error on getPicture..');
        this.logs.push(error);
        //console.error(error);
        });

    if (this.platform.is("ios")) {
      this.camera.cleanup();
    }
  }

  async showMessage(msg:any): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
  /**
   * Show the result using a modal.
   *
   * @param result
   */
  async showResult(result: OpenALPRResult[]) {
    this.logs.push('showResult..');
    this.logs.push(result);
    // await this.showMessage(result  && result.length>0?result[0].number  : 'Empty');
    if (result && result.length > 0) {
      this.logs.push('showResult number');
      this.logs.push(result[0].number);
      this.model.plateNumber = result[0].number;
    } else {
      await this.showMessage('Can not identify car plate number, please try again');
    }
  }

  onSubmit(): void {
    const processDefinitionKey = environment.processKey;;
    const variables = this.generateVariablesFromFormFields();
    this.camundaRestService.postProcessInstance(processDefinitionKey, variables).subscribe(() => {
      // if (this.imageData) {
      //   this.upload();
      // }
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

}
