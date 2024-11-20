import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import { Observable, of } from 'rxjs';

import { type Mark } from '../../models/mark';
import { MarkService } from '../../services/marks.service';
import { MarksGroup, MarksPage, MarkViewModel } from './marks.page';

describe('MarksPage', () => {
  let component: MarksPage;
  let fixture: ComponentFixture<MarksPage>;
  let marksService: MarkService;

  beforeEach(async () => {
    fixture = TestBed.createComponent(MarksPage);
    marksService = TestBed.inject(MarkService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#load should load marks', () => {
    const marks: Observable<Mark[]> = of(
      [
        {
          date: moment().year(2023).month(3).date(13).startOf('date').toDate(),
          subject: 'MA103  Дискретна математика',
          mark: '6',
          session: 'Р',
          credits: 6,
        }
      ]
    );

    const expected: MarksGroup = new Map([
      [
        '230413',
        [
          {
            id: 0,
            date: moment().year(2023).month(3).date(13).startOf('date').toDate(),
            subject: 'Дискретна математика',
            mark: '6',
            session: 'Редовна',
            credits: 6,
          }
        ]
      ]]) satisfies MarksGroup;

    spyOn(marksService, 'getAll').and.returnValue(marks);

    const res$ = component['load']();

    res$.subscribe(res => expect(res).toEqual(expected));
  });

  it('#groupByDate should group marks by date', () => {
    const marks: MarkViewModel[] =
      [
        {
          id: 0,
          date: moment().year(2023).month(3).date(13).startOf('date').toDate(),
          subject: 'Дискретна математика',
          mark: '4',
          session: 'Редовна',
          credits: 6,
        },
        {
          id: 1,
          date: moment().year(2023).month(3).date(13).startOf('date').toDate(),
          subject: 'Основи на конструирането и AutoCAD',
          mark: '5',
          session: 'Редовна',
          credits: 6,
        },
        {
          id: 2,
          date: moment().year(2024).month(4).date(14).startOf('date').toDate(),
          subject: 'Обработка на векторни и растерни изображения в роботиката',
          mark: '6',
          session: 'Допълнителна',
          credits: 6,
        }
      ];

    const expected: MarksGroup = new Map([
      [
        '230413',
        [
          {
            id: 0,
            date: moment().year(2023).month(3).date(13).startOf('date').toDate(),
            subject: 'Дискретна математика',
            mark: '4',
            session: 'Редовна',
            credits: 6,
          },
          {
            id: 1,
            date: moment().year(2023).month(3).date(13).startOf('date').toDate(),
            subject: 'Основи на конструирането и AutoCAD',
            mark: '5',
            session: 'Редовна',
            credits: 6,
          }
        ]
      ],
      [
        '240514',
        [
          {
            id: 2,
            date: moment().year(2024).month(4).date(14).startOf('date').toDate(),
            subject: 'Обработка на векторни и растерни изображения в роботиката',
            mark: '6',
            session: 'Допълнителна',
            credits: 6,
          }
        ]
      ]]);

    const grouped = component['groupByDate'](marks);

    expect(grouped.get('230413')).toBeDefined();
    expect(grouped.get('230413')).toEqual(expected.get('230413'));

    expect(grouped.get('240514')).toBeDefined();
    expect(grouped.get('240514')).toEqual(expected.get('240514'));
  });

  it('#markToViewModel should convert mark models to view models', () => {
    const mark: Mark = {
      date: moment().year(2023).month(3).date(13).startOf('date').toDate(),
      subject: 'MA103  Дискретна математика',
      mark: '6',
      session: 'Д',
      credits: 6,
    }

    const expected: MarkViewModel = {
      id: 0,
      date: moment().year(2023).month(3).date(13).startOf('date').toDate(),
      subject: 'Дискретна математика',
      mark: '6',
      session: 'Допълнителна',
      credits: 6,
    }

    const res = component['markToViewModel'](mark, 0);

    expect(res).toEqual(expected);
  });
});
