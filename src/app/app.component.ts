import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { SettingService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(private readonly settingsService: SettingService,
              private readonly router: Router) { }

  public ngOnInit(): void {
    this.redirectToSettings();
  }

  private redirectToSettings(): void {
    const settings = this.settingsService.getValue();
    if (!settings.apiUser || !settings.apiPass || !settings.facultyNumber) {
      this.router.navigate(['tabs/settings']);
    }
  }
}
