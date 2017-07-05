import { Component, ViewChild }   from '@angular/core';
import { Platform, Nav, Config }  from 'ionic-angular';

import { StatusBar }    from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ContentPage }    from '../pages/content/content';
import { ListMasterPage } from '../pages/list-master/list-master';
import { SearchPage }     from '../pages/search/search';
import { SettingsPage }   from '../pages/settings/settings';
import { TutorialPage }   from '../pages/tutorial/tutorial';
import { WelcomePage }    from '../pages/welcome/welcome';

import { TranslateService } from '@ngx-translate/core'

@Component({
  templateUrl: `app.component.html`
})
export class AppComponent {
  rootPage = WelcomePage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Almacenes', component: ListMasterPage },
    { title: 'Buscar trastos', component: SearchPage },
    { title: 'Actividades', component: ContentPage },
    { title: 'Recomendaciones', component: ContentPage },
    { title: 'Settings', component: SettingsPage },
    { title: 'Tutorial', component: TutorialPage }
  ];

  constructor(
    private translate: TranslateService,
    private platform: Platform,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) {
    this.initTranslate();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
