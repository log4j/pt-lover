import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, MenuController, ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { Device } from '@ionic-native/device';
import { StatusBar } from '@ionic-native/status-bar';


import { Push, PushObject, RegistrationEventResponse, NotificationEventResponse } from '@ionic-native/push';
import { SplashScreen } from '@ionic-native/splash-screen';


import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';

import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { FaqPage } from '../pages/faq/faq';
import { AboutPage } from '../pages/about/about';
import { ProfilePage } from '../pages/profile/profile';
import { RemotePage } from '../pages/remote/remote';
import { TorrentAlertPage } from '../pages/torrent-alert/torrent-alert';
import { TorrentFilterPage } from '../pages/torrent-filter/torrent-filter';
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
		{ title: '资源订阅', component: TorrentAlertPage, icon: 'film', isModal: false }
	];

	loggedInPages: PageInterface[] = [
		// { title: 'Account', component: AccountPage, icon: 'person' },
		{ title: '个人信息和设置', component: ProfilePage, icon: 'information-circle', isModal: true },
		{ title: '资源显示设置', component: TorrentFilterPage, icon: 'map', isModal: true },
		{ title: '退出', component: TabsPage, icon: 'log-out', index: 0, logsOut: true }
	];
	loggedOutPages: PageInterface[] = [
		{ title: '登录', component: LoginPage, icon: 'log-in' },
		{ title: '常见问题', component: FaqPage, icon: 'bulb', isModal: true },
		{ title: '关于', component: AboutPage, icon: 'information-circle', isModal: true }
	];


	constructor(
		public events: Events,
		public userData: UserData,
		public pushData: PushData,
		public menu: MenuController,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		public toastCtrl: ToastController,
		public platform: Platform,
		public device: Device,
		// public confData: ConferenceData,
		public storage: Storage,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		private push: Push
	) {

		// Check if the user has already seen the tutorial
		this.userData.checkHasSeenTutorial().then(hasSeenTutorial => {
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

			if (this.userData.greenMode) {
				this.betaPages = [
					{ title: '资源订阅', component: TorrentAlertPage, icon: 'film', isModal: false },
					{ title: 'PTSideLoader', component: RemotePage, icon: 'clock', isModal: false }
				];
			} else {
				this.betaPages = [
					{ title: '资源订阅', component: TorrentAlertPage, icon: 'film', isModal: false },
					{ title: 'PTSideLoader', component: RemotePage, icon: 'clock', isModal: false }
				];
			}

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



			// this.statusBar.overlaysWebView(true);
			this.statusBar.styleDefault();
			// this.statusBar.backgroundColorByName('black');

			this.splashScreen.hide();


			// if (cordova && cordova.InAppBrowser) {
			// window.open = (url, target?, opts?) => {
			// this.inAppBrowser.create(url, target, opts).show();
			// };
			// }


			// document.getElementById('splashAd').style.display = 'none';

			switch (localStorage.getItem('theme')) {
				case ('theme-default'):
					// if(this.device.platform === 'ios'){

					// }
					this.statusBar.styleDefault();
					if (this.device.platform == 'android') {
						this.statusBar.backgroundColorByHexString("#DDDEDE");
					}
					break;

				case ('theme-dark'):

					this.statusBar.styleBlackTranslucent();

					if (this.device.platform == 'android') {
						this.statusBar.backgroundColorByHexString("#353A3D");
					}
					break;
			}

			var self = this;


			const push: PushObject = this.push.init({
				android: {
					// senderID: '707320332782',
					// forceShow: true,
					// icon: "setting",
					// icon: 'logo',
					// iconColor: "blue",
					clearBadge: true
				},
				ios: {
					alert: 'true',
					badge: true,
					sound: 'false',
					clearBadge: true
				},
				windows: {}
			});

			// alert(push);

			if (push && typeof push.on === 'function') {
				push.on('registration').subscribe(notification => {
					// alert('registration:' + notification);
					//update pushId
					this.pushData.updatePushId((<RegistrationEventResponse>notification).registrationId);


				});

				push.on('error').subscribe(function (e) {
					alert(JSON.stringify(e));
				});

				push.on('notification').subscribe(function (data) {
					// alert(JSON.stringify(data));
					// console.log(data);
					if (data) {
						// console.log((<NotificationEventResponse>data).message);
						self.showNotifyToast((<NotificationEventResponse>data).message);
					}
				});

				// alert('finished push on');
				// push.on
			} else {
				//fake push id
				this.pushData.updatePushId('fakedpushid');
			}

			// Push.hasPermission().then(res => {
			// 	// alert('permission:' + JSON.stringify(res));
			// })
			if (document.getElementById('splashAd')) {
				if (this.device.platform == 'android') {
					document.getElementById('splashAd').style.display = 'none';
				} else {
					setTimeout(() => {
						document.getElementById('splashAd').style.display = 'none';
					}, 2000);
				}
			}


		});

	}

	showNotifyToast(msg) {
		let toast = this.toastCtrl.create({
			message: msg,
			duration: 4000,
			position: 'top'
		});
		toast.present();
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

				});
			})
		}
		else if (page.index != undefined) {
			this.nav.setRoot(page.component, { tabIndex: page.index });

		} else {
			// this.nav.setRoot(page.component).catch(() => {
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

	pushPage = (page: PageInterface) => {
		this.nav.push(page.component);
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
