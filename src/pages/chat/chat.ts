import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public _chatPrvdr:ChatProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ionViewDidEnter(){
    this._chatPrvdr.obtenerChat()
  }

  verMensaje(compraDetalleId){
     this.app.getRootNavs()[0].push('MensajePage', { compraDetalleId: compraDetalleId });
  }

}
