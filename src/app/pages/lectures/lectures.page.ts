import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItemDivider, IonList, IonProgressBar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import moment from 'moment';
import { map, Observable, of, Subscription } from 'rxjs';

import { type Lecture } from '../../models/lecture';
import { DurationPipe } from '../../pipes/duration.pipe';
import { LectureService } from '../../services/lectures.service';
import { SettingService } from '../../services/settings.service';

@Component({
  selector: 'app-lectures',
  templateUrl: 'lectures.page.html',
  styleUrls: ['lectures.page.scss', '../../shared/shared.style.css'],
  standalone: true,
  imports: [IonProgressBar, IonItemDivider, IonCardTitle, IonCardContent, IonCardHeader, IonCard, IonList, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, DurationPipe],
})
export class LecturesPage implements OnInit, OnDestroy {

  public lectures$: Observable<LecturesGroup> = of(new Map());
  private settingsSubscription$?: Subscription;

  constructor(private readonly lecturesService: LectureService,
              private readonly settingsService: SettingService) { }

  public ngOnInit(): void {
    this.settingsSubscription$ = this.settingsService
      .getObservable()
      .subscribe(() => this.lectures$ = this.load());
  }

  public ngOnDestroy(): void {
    this.settingsSubscription$!.unsubscribe();
  }

  private load(): Observable<LecturesGroup> {
    return this.lecturesService
      .getAll()
      .pipe(
        map(lectures => lectures.map(this.lectureToViewModel)),
        map(lectures => this.groupByDate(lectures))
      );
  }

  private groupByDate(lectures: LectureViewModel[]): LecturesGroup {
    const dateToKey = (date: Date) => moment(date).format('YYMMDD');

    return lectures.reduce((acc, lecture) => {
      const key = dateToKey(lecture.startDate);
      const group = acc.get(key) ?? [];
      group.push(lecture);
      acc.set(key, group);
      return acc;
    }, new Map<string, LectureViewModel[]>());
  }

  private lectureToViewModel(model: Lecture, id: number): LectureViewModel {
    const { subject: oldSubject, ...rest } = model;

    const subject = oldSubject.slice(oldSubject.indexOf(' ') + 1);

    return {
      id,
      subject,
      ...rest,
    }
  }
}

export type LecturesGroup = Map<string, LectureViewModel[]>;

export type LectureViewModel = Lecture & {
  id: number;
}
