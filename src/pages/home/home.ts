import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
import { SMS } from '@ionic-native/sms';
import { AndroidPermissions } from '@ionic-native/android-permissions';
declare var smslist:any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	phoneNumber: String;
	alert: any;

	constructor(public navCtrl: NavController, public platform: Platform, private sim: Sim, private sms: SMS, private alertCtrl: AlertController, private permission: AndroidPermissions) {
		this.phoneNumber = "";

		this.sim.requestReadPermission().then(
			() => {
				this.sim.hasReadPermission().then( (info) => {
					console.log('Has permission: ', info);
				});
			},
			() => console.log('Permission denied')
		);

		this.sim.getSimInfo().then((info) => {
			console.log("INFO: ", info);
			this.phoneNumber = info.phoneNumber;
		}, (err) => {
			this.errorAlert();
		});
	}

	ionViewWillEnter() {
		
		this.platform.ready().then( () => {
			this.permission.checkPermission(this.permission.PERMISSION.READ_SMS).then(
				(success)=> {
					console.log("Permission Granted", smslist);
					if(smslist){
						let filter = {
							box: 'inbox',
							indexFrom: 0,
							maxCount: 10
						}
						smslist.listSMS(filter, (list)=> {
							console.log("Got THE SMS: ", list);
						}, (err) => {
							console.log("Read SMS ERR: ", err);
						});
					}
				}, (err) => {
					this.permission.requestPermission(this.permission.PERMISSION.READ_SMS);
				}
			);
		});
	}

	errorAlert(){
		this.alert = this.alertCtrl.create({
			title: "Failed!",
			subTitle: "Unable to get phone number from your device.",
			buttons: [{
				text: "OK",
				handler: function(){
					console.log("GOT IT");
				}
			}]
		});

		this.alert.present();
		console.log("Phone Number Not available");
	}


	sendSMS(){
		return (this.phoneNumber !== undefined) ? (this.sms.send(this.phoneNumber.toString(), "OTP - Your Phone Number is " + this.phoneNumber.toString())) : (this.errorAlert());
	}

}
