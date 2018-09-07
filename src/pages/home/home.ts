import { Component } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
// import { SMS } as from '@ionic-native/sms';
import { AndroidPermissions } from '@ionic-native/android-permissions';
declare var SMS:any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	phoneNumber: String;
	smsList = [];
	alert: any;
	otp = [];
	otpAvailable: boolean = false;

	constructor(public navCtrl: NavController, public platform: Platform, private sim: Sim, private alertCtrl: AlertController, private loadCtrl: LoadingController, private permission: AndroidPermissions) {
		this.phoneNumber = "";

		document.addEventListener('onSMSArrive', (e:any)=>{
			let sms = e.data;
			console.log("GOT THE SMS", sms);

			if(sms.body !== undefined){
				let substr = sms.body.substring( (sms.body.length - 5) , (sms.body.length) );
				this.otpAvailable = true;
				var isnum = /^\d+$/.test(substr);

				if(isnum){
					this.otp = substr.split('');
					let loading = this.loadCtrl.create({
						content: 'Authenticating OTP Code...'
					});
					loading.present();

					setTimeout(()=> {
						loading.dismiss();
					}, 3000);

					// STOP WATCH
					SMS.stopWatch( ()=> {
						console.log("Stopped Watching");
					}, (err) => {
						console.log("ERR: ", err);
					});

				} else {
					console.log("Failed");
				}
			}
		});

		this.sim.requestReadPermission().then(
			() => {
				this.sim.hasReadPermission().then( (info) => {
					console.log('Has permission: ', info);
				});
			},
			() => console.log('Permission denied')
		);

		this.permission.requestPermissions([this.permission.PERMISSION.READ_SMS]).then(
			() => {
				if(SMS){

					SMS.startWatch( () => {
						console.log("Watching");
					}, (err)=> {
						console.log("ERR: ", err);
					});

					let filter = {
						indexFrom: 0,
						maxCount: 10
					}
					SMS.listSMS(filter, (list)=> {
						console.log("Got THE SMS: ", list);
						this.smsList = list;
					}, (err) => {
						console.log("Read SMS ERR: ", err);
					});
				}
			}, () => {
				this.permission.requestPermission(this.permission.PERMISSION.READ_SMS);
			}
		);

		this.sim.getSimInfo().then((info) => {
			console.log("INFO: ", info);
			this.phoneNumber = info.phoneNumber;
		}, (err) => {
			this.errorAlert();
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

		let number = Math.floor(Math.random()*90000) + 10000;

		return (this.phoneNumber !== undefined) ? (SMS.sendSMS(this.phoneNumber.toString(), "OTP - Your Phone Number is " + number, ()=> {
			console.log('sent');
		}, () => {
			console.error("Failed to Send");
		})) : (this.errorAlert());
	}

}
