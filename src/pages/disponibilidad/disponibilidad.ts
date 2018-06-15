import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DisponibilidadProvider } from '../../providers/disponibilidad/disponibilidad';

/**
 * Generated class for the DisponibilidadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disponibilidad',
  templateUrl: 'disponibilidad.html',
})
export class DisponibilidadPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _disponibilidadPrvdr:DisponibilidadProvider) {
      this._disponibilidadPrvdr.obtenerDisponibiliad()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisponibilidadPage');
  }

  guardar(event) {
    // console.log(event,'guardar')
    this._disponibilidadPrvdr.enviarDisponibiliad(event)
  }

}
