import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
import { SMS } from '@ionic-native/sms';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	phoneNumber: String;
	alert: any;

	constructor(public navCtrl: NavController, private sim: Sim, private sms: SMS, private alertCtrl: AlertController) {
		this.phoneNumber = "";
		this.sim.getSimInfo().then((info) => {
			this.phoneNumber = info;
		}, (err) => {
			this.errorAlert();
		});
	}


	errorAlert(){
		this.alert = this.alertCtrl.create({
			title: "Failed!",
			subTitle: "Unable to get phone number from your device.",
			buttons: ["OK"]
		});

		this.alert.present();
		console.log("Phone Number Not available");
	}


	sendSMS(){
		if(this.phoneNumber.toString() !== ""){
			this.sms.send(this.phoneNumber.toString(), "OTP - Your Phone Number is " + this.phoneNumber.toString());
		} else{
			this.errorAlert();
		}
	}

}
