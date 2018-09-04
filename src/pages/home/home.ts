import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  phoneNumber: String;
  
  constructor(public navCtrl: NavController, private sim: Sim) {
      this.phoneNumber = "313244";
      this.sim.getSimInfo().then( (info) => {
        this.phoneNumber = info;
      }, (err) => {
        this.phoneNumber = "FAILED";
        console.log(this.phoneNumber);
      });
  }

}
