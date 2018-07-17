import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform, App } from 'ionic-angular';
// import {SesionProvider} from '../sesion/sesion';
/*
  Generated class for the PushnNotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class PushNotificationProvider {
  public data: any = { tipo: '', sesionId: '' }


  constructor(
    private oneSignal: OneSignal,
    public platform: Platform,
    public app: App,
    // private _sesionPrvdr: SesionProvider,
  ) {
    console.log('Hello PushnNotificationProvider Provider');
  }


  init_notifications() {
  
    if (this.platform.is('cordova')) {

      this.oneSignal.startInit('96150a2e-39ac-477d-a116-16cc8c5e2e88', '807999059175');

      this.oneSignal.sendTag("tipo", "prestador");

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

      this.oneSignal.handleNotificationReceived().subscribe((data: any) => {
        // do something when notification is received

      });

      this.oneSignal.handleNotificationOpened().subscribe((data: any) => {
        // do something when a notification is opened
        this.data = data.notification.payload.additionalData
        // let nav = this.app.getActiveNav();

      });

      this.oneSignal.endInit();

    } else {
      console.log('OneSignal no configurado');
    }
  }


  addtagsNotificacion(tgas) {
    this.oneSignal.sendTags(tgas);
  }

  deletetagsNotificacion(Key) {
    this.oneSignal.deleteTag(Key)
  }

}
