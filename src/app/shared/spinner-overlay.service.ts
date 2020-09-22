import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { defer, NEVER } from 'rxjs';
import { finalize, share } from 'rxjs/operators';

// import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';

@Injectable({
  providedIn: 'root',
})
export class SpinnerOverlayService {
  public readonly spinner$ = defer(() => {
    this.show();
    return NEVER.pipe(
      finalize(() => {
        this.hide();
      })
    );
  }).pipe(share());
  loading: any;

  constructor(private loadingController: LoadingController) {}

  async show() {
    // Hack avoiding `ExpressionChangedAfterItHasBeenCheckedError` error
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 3000
    });
    await this.loading.present();
  }

  public hide(): void {
    if (this.loading) {
      this.loading.dismiss();
    }
  }
}
