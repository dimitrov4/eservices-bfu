import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItemDivider, IonList, IonProgressBar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import moment from 'moment';
import { map, Observable, of, Subscription } from 'rxjs';

import { type Mark } from '../../models/mark';
import { MarkService } from '../../services/marks.service';
import { SettingService } from '../../services/settings.service';

@Component({
  selector: 'app-marks',
  templateUrl: 'marks.page.html',
  styleUrls: ['marks.page.scss', '../../shared/shared.style.css'],
  standalone: true,
  imports: [IonProgressBar, IonItemDivider, IonCardTitle, IonCardContent, IonCardHeader, IonCard, IonList, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule]
})
export class MarksPage implements OnInit, OnDestroy {

  public marks$: Observable<MarksGroup> = of(new Map());
  private settingsSubscription$?: Subscription;

  constructor(private readonly marksService: MarkService,
              private readonly settingsService: SettingService) { }

  public ngOnInit(): void {
    this.settingsSubscription$ = this.settingsService
      .getObservable()
      .subscribe(() => this.marks$ = this.load());
  }

  public ngOnDestroy(): void {
    this.settingsSubscription$?.unsubscribe();
  }

  private load(): Observable<MarksGroup> {
    return this.marksService
      .getAll()
      .pipe(
        map(marks => marks.map(this.markToViewModel)),
        map(marks => this.groupByDate(marks))
      );
  }

  private groupByDate(marks: MarkViewModel[]): MarksGroup {
    const dateToKey = (date: Date) => moment(date).format('YYMMDD');

    return marks.reduce((acc, mark) => {
      const key = dateToKey(mark.date);
      const group = acc.get(key) ?? [];
      group.push(mark);
      acc.set(key, group);
      return acc;
    }, new Map<string, MarkViewModel[]>());
  }

  private markToViewModel(model: Mark, id: number): MarkViewModel {
    const { subject: oldSubject, session: oldSession, ...rest } = model;

    const subject = oldSubject.slice(oldSubject.indexOf('  ') + 2);

    let session = oldSession;
    if (session === 'Р') {
      session = 'Редовна';
    } else if (session === 'Д') {
      session = 'Допълнителна';
    }

    return {
      id,
      subject,
      session,
      ...rest,
    };
  }
}

export type MarksGroup = Map<string, MarkViewModel[]>;

export type MarkViewModel = Mark & {
  id: number,
}
