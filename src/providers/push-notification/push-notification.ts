import { Injectable, NgZone } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform, App } from 'ionic-angular';
import { SesionProvider } from '../sesion/sesion';
import { ChatProvider } from '../chat/chat';

/*
  Generated class for the PushnNotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class PushNotificationProvider {
  public data: any = { tipo: '', sesionId: '' }
  public esActivo: boolean

  constructor(
    private oneSignal: OneSignal,
    public platform: Platform,
    public app: App,
    private _sesionPrvdr: SesionProvider,
    private _chatPrvdr:ChatProvider,
    public zone: NgZone
  ) {
    console.log('Hello PushnNotificationProvider Provider');
  }


  init_notifications() {

    if (this.platform.is('cordova')) {

      this.oneSignal.startInit('96150a2e-39ac-477d-a116-16cc8c5e2e88', '119391834875');

      this.oneSignal.sendTag("app", "prestador");

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

      this.oneSignal.handleNotificationReceived().subscribe((data: any) => {
        this.zone.run(() => {
          // let pageId = this.app.getRootNavs()[0].getActive()["id"]

          if (data.payload.additionalData.tipo == "detalleSesion" ||data.payload.additionalData.tipo == "detalleSesionAutomatica") {
            this._sesionPrvdr.getSesionPorIniciar()
            this._sesionPrvdr.getSesionProxima()
            this._sesionPrvdr.getSesionFinalizada()
          }

          // actulizar chat
          else if (data.payload.additionalData.tipo == "chat") {
          let chat = this._chatPrvdr.chat.find((chat)=>{
                return (chat.chatId == data.payload.additionalData.mensaje.chatId)
            });

            if(chat != undefined){
              this._chatPrvdr.chat = this._chatPrvdr.chat.filter((chat)=>{
                return (chat.chatId != data.payload.additionalData.mensaje.chatId)
              })
            }

            this._chatPrvdr.chat.unshift(data.payload.additionalData.chat)
            //fin actulizar chat

            // actualizar mensajes
            this._chatPrvdr.nuevoMensaje(data.payload.additionalData)

            console.log(JSON.stringify(chat))
          }

        })
        // do something when notification is received

      });

      this.oneSignal.handleNotificationOpened().subscribe((data: any) => {
        // do something when a notification is opened
        if (data.notification.payload.additionalData.tipo == "detalleSesion" || data.notification.payload.additionalData.tipo == "detalleSesionAutomatica") {

          this._sesionPrvdr.getSesion(data.notification.payload.additionalData.sesionId)
            .subscribe((data) => {
              this.app.getRootNavs()[0].push('DetalleSesionPage', { sesion: data });
            })
        }

        else if (data.notification.payload.additionalData.tipo == "chat") {
          this.app.getRootNavs()[0].push('MensajePage', { compraDetalleId: data.notification.payload.additionalData.chat.compraDetalleId });
        }
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
