import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItemDivider, IonList, IonProgressBar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import moment from 'moment';
import { map, Observable, of, Subscription } from 'rxjs';

import { type Exam } from '../../models/exam';
import { DurationPipe } from '../../pipes/duration.pipe';
import { ExamService } from '../../services/exams.service';
import { SettingService } from '../../services/settings.service';

@Component({
  selector: 'app-exams',
  templateUrl: 'exams.page.html',
  styleUrls: ['exams.page.scss', '../../shared/shared.style.css'],
  standalone: true,
  imports: [IonProgressBar, IonItemDivider, IonCardTitle, IonCardContent, IonCardHeader, IonCard, IonList, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, DurationPipe],
})
export class ExamsPage implements OnInit, OnDestroy {

  public exams$: Observable<ExamsGroup> = of(new Map());
  private settingsSubscription$?: Subscription;

  constructor(private readonly examsService: ExamService,
              private readonly settingsService: SettingService) { }

  public ngOnInit(): void {
    this.settingsSubscription$ = this.settingsService
      .getObservable()
      .subscribe(() => this.exams$ = this.load());
  }

  public ngOnDestroy(): void {
    this.settingsSubscription$!.unsubscribe();
  }

  private load(): Observable<ExamsGroup> {
    return this.examsService
      .getAll()
      .pipe(
        map(exams => exams.map(this.examToViewModel)),
        map(exams => this.groupByDate(exams))
      );
  }

  private groupByDate(exams: ExamViewModel[]): ExamsGroup {
    const dateToKey = (date: Date) => moment(date).format('YYMMDD');

    return exams.reduce((acc, exam) => {
      const key = dateToKey(exam.startDate);
      const group = acc.get(key) ?? [];
      group.push(exam);
      acc.set(key, group);
      return acc;
    }, new Map<string, ExamViewModel[]>())
  };

  private examToViewModel(model: Exam, id: number): ExamViewModel {
    const { session: oldSession, ...rest } = model;

    const session = oldSession.slice(0, oldSession.lastIndexOf(' '));

    return {
      id,
      session,
      ...rest,
    }
  }
}

export type ExamsGroup = Map<string, ExamViewModel[]>;

export type ExamViewModel = Exam & {
  id: number,
}
