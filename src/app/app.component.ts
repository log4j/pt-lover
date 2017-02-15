import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, MenuController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen, Device, Push } from 'ionic-native';

import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { FaqPage } from '../pages/faq/faq';
import { AboutPage } from '../pages/about/about';
import { ProfilePage } from '../pages/profile/profile';
import { RemotePage } from '../pages/remote/remote';
import { TorrentAlertPage } from '../pages/torrent-alert/torrent-alert';
import { User } from '../models/user';

import { UserData } from '../providers/user-data';
import { PushData } from '../providers/push-data';



export interface PageInterface {
	title: string;
	component: any;
	icon: string;
	logsOut?: boolean;
	index?: number;
	isModal?: boolean;
}

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage: any;
	user: User;

	// the root nav is a child of the root app component
	// @ViewChild(Nav) gets a reference to the app's root nav
	@ViewChild(Nav) nav: Nav;

	// List of pages that can be navigated to from the left menu
	// the left menu only works after login
	// the login page disables the left menu
	appPages: PageInterface[] = [
		{ title: '葡萄', component: TabsPage, index: 0, icon: 'calendar' },
		{ title: '资源', component: TabsPage, index: 1, icon: 'keypad' },
		{ title: '论坛', component: TabsPage, index: 2, icon: 'contacts' }
	];

	betaPages: PageInterface[] = [
		{ title: '资源订阅', component: TorrentAlertPage, icon: 'film' },
		{ title: '远程客户端', component: RemotePage, icon: 'desktop' },
	];

	loggedInPages: PageInterface[] = [
		// { title: 'Account', component: AccountPage, icon: 'person' },
		{ title: '我', component: ProfilePage, icon: 'information-circle', isModal: true },
		{ title: '退出', component: TabsPage, icon: 'log-out', index: 0, logsOut: true }
	];
	loggedOutPages: PageInterface[] = [
		{ title: 'Login', component: LoginPage, icon: 'log-in' },
		// { title: 'Support', component: SupportPage, icon: 'help' },
		// { title: 'Signup', component: SignupPage, icon: 'person-add' }
	];

	constructor(
		public events: Events,
		public userData: UserData,
		public pushData: PushData,
		public menu: MenuController,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		public platform: Platform,
		// public confData: ConferenceData,
		public storage: Storage
	) {

		// Check if the user has already seen the tutorial
		this.userData.checkHasSeenTutorial().then(hasSeenTutorial => {
			console.log(hasSeenTutorial);
			if (hasSeenTutorial) {
				this.rootPage = TabsPage;
			} else {
				this.rootPage = WelcomePage;
			}
			this.platformReady()
		});



		this.enableMenu(false);


		this.events.subscribe('user:login', (user, time) => {
			this.user = user;
			this.enableMenu(true);
		});

	}

	enableMenu(loggedIn) {
		this.menu.enable(loggedIn, 'loggedInMenu');
		this.menu.enable(!loggedIn, 'loggedOutMenu');
	}
	platformReady() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			// StatusBar.styleBlackTranslucent();
			// StatusBar.styleBlackTranslucent();

			// StatusBar.styleDefault();

			StatusBar.overlaysWebView(true);
			StatusBar.styleDefault();
			StatusBar.backgroundColorByName('black');

			Splashscreen.hide();

			// if (Device.platform == 'android') {
			StatusBar.backgroundColorByHexString("#353A3D");
			// }
			console.log(Device.platform);

			var push = Push.init({
				android: {
					senderID: '707320332782'
				},
				ios: {
					alert: 'true',
					badge: true,
					sound: 'false'
				},
				windows: {}
			});

			// alert(push);

			if (push) {
				push.on('registration', data => {
					// alert('registration:' + data);
					//update pushId
					this.pushData.updatePushId(data.registrationId);

				});

				push.on('error', function (e) {
					alert(e.message);
				});


				// alert('finished push on');
				// push.on
			} else {
				//fake push id
				this.pushData.updatePushId('fakedpushid');
			}

			Push.hasPermission().then(res=>{
				console.log('permissionL:'+JSON.stringify(res));
			})

		});
	}

	openPage(page: PageInterface) {
		// the nav component was found using @ViewChild(Nav)
		// reset the nav to remove previous pages and only have this page
		// we wouldn't want the back button to show in this scenario
		if (page.logsOut === true) {

			let loader = this.loadingCtrl.create({
				content: "正在退出, 请稍等..."
			});
			loader.present();

			this.userData.logout().then(data => {
				loader.dismiss();
				this.nav.setRoot(page.component, { tabIndex: page.index }).catch(() => {
					// console.log("Didn't set nav root");

				});
			})
		}
		else if (page.index != undefined) {
			this.nav.setRoot(page.component, { tabIndex: page.index });

		} else {
			// this.nav.setRoot(page.component).catch(() => {
			// 	console.log("Didn't set nav root");
			// });
			if (page.isModal) {
				this.openModal(page.component);
			} else {
				this.nav.setRoot(page.component);
			}

		}

		// if (page.logsOut === true) {
		//   // Give the menu time to close before changing to logged out
		//   setTimeout(() => {
		//     this.userData.logout();
		//   }, 1000);
		// }


	}

	openTutorial() {
		// this.nav.setRoot(TutorialPage);
	}

	openModal(page: any) {

		// console.log('open modal!!!');
		let modal = this.modalCtrl.create(page);
		modal.present();
	}

	openAbout() {
		let modal = this.modalCtrl.create(AboutPage);
		modal.present();
	}

	openFaq() {

		let modal = this.modalCtrl.create(FaqPage);
		modal.present();
	}

}
