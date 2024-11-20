import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonInputPasswordToggle, IonProgressBar, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { SettingService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [IonText, IonProgressBar, IonButton, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, IonInputPasswordToggle, ReactiveFormsModule, FormsModule],
})
export class SettingsPage implements OnInit {

  public settingsForm!: FormGroup;
  public settingsSavedNotification: boolean = false;

  constructor(private readonly settingsService: SettingService,
              private readonly formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    const settings = this.settingsService.getValue();

    this.settingsForm = this.formBuilder.group({
      apiUser: [
        settings.apiUser ?? '',
        Validators.required
      ],
      apiPass: [
        '',
        this.nonEmptyOrExistingPassword()
      ],
      facultyNumber: [
        settings.facultyNumber ?? '',
        [Validators.required, Validators.pattern('\\d{8}')]]
    });
  }

  public onSubmit(): void {
    this.settingsService.setValue(this.settingsForm.value);

    this.settingsSavedNotification = true;
    setTimeout(() => this.settingsSavedNotification = false, 3500); 
  }

  private nonEmptyOrExistingPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value.length) {
        return null;
      }

      const settings = this.settingsService.getValue();
      if (settings.apiPass) {
        return null;
      }

      return { required: { value: control.value } };
    };
  }
}
