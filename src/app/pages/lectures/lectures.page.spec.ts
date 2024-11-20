import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import { Observable, of } from 'rxjs';

import { type Lecture } from '../../models/lecture';
import { LectureService } from '../../services/lectures.service';
import { LecturesGroup, LecturesPage, LectureViewModel } from './lectures.page';

describe('LecturesPage', () => {
  let component: LecturesPage;
  let fixture: ComponentFixture<LecturesPage>;
  let lecturesService: LectureService;

  beforeEach(async () => {
    fixture = TestBed.createComponent(LecturesPage);
    lecturesService = TestBed.inject(LectureService)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#load should load lectures', () => {
    const lectures: Observable<Lecture[]> = of(
      [
        {
          startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
          endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
          room: '214',
          subject: 'CS102 Web технологии и приложения',
          teacher: 'доц. д-р Иван Иванов',
        }
      ]
    );

    const expected: LecturesGroup = new Map([
      [
        '230413',
        [
          {
            id: 0,
            startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
            endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
            room: '214',
            subject: 'Web технологии и приложения',
            teacher: 'доц. д-р Иван Иванов',
          }
        ]
      ]]);

    spyOn(lecturesService, 'getAll').and.returnValue(lectures);

    const res$ = component['load']();

    res$.subscribe(res => expect(res).toEqual(expected));
  });

  it('#groupByDate should group lectures by date', () => {
    const lectures: LectureViewModel[] =
      [
        {
          id: 0,
          startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
          endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
          room: '31',
          subject: 'Компютърни системи',
          teacher: 'проф. д-р Тодор Тодоров',
        },
        {
          id: 1,
          startDate: moment().year(2023).month(3).date(13).hour(12).startOf('hour').toDate(),
          endDate: moment().year(2023).month(3).date(13).hour(15).startOf('hour').toDate(),
          room: '431',
          subject: 'Кодиране и защита на информацията',
          teacher: 'доц. д-р Никола Николов',
        },
        {
          id: 2,
          startDate: moment().year(2024).month(4).date(14).hour(9).startOf('hour').toDate(),
          endDate: moment().year(2024).month(4).date(14).hour(13).startOf('hour').toDate(),
          room: '214',
          subject: 'Web технологии и приложения',
          teacher: 'доц. д-р Иван Иванов',
        }
      ];

    const expected: LecturesGroup = new Map([
      [
        '230413',
        [
          {
            id: 0,
            startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
            endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
            room: '31',
            subject: 'Компютърни системи',
            teacher: 'проф. д-р Тодор Тодоров',
          },
          {
            id: 1,
            startDate: moment().year(2023).month(3).date(13).hour(12).startOf('hour').toDate(),
            endDate: moment().year(2023).month(3).date(13).hour(15).startOf('hour').toDate(),
            room: '431',
            subject: 'Кодиране и защита на информацията',
            teacher: 'доц. д-р Никола Николов',
          }
        ]
      ],
      [
        '240514',
        [
          {
            id: 2,
            startDate: moment().year(2024).month(4).date(14).hour(9).startOf('hour').toDate(),
            endDate: moment().year(2024).month(4).date(14).hour(13).startOf('hour').toDate(),
            room: '214',
            subject: 'Web технологии и приложения',
            teacher: 'доц. д-р Иван Иванов',
          }
        ]
      ]]);

    const grouped = component['groupByDate'](lectures);

    expect(grouped.get('230413')).toBeDefined();
    expect(grouped.get('230413')).toEqual(expected.get('230413'));

    expect(grouped.get('240514')).toBeDefined();
    expect(grouped.get('240514')).toEqual(expected.get('240514'));
  });

  it('#lectureToViewModel should convert lecture models to view models', () => {
    const lecture: Lecture = {
      startDate: moment().year(2023).month(9).date(30).hour(14).startOf('hour').toDate(),
      endDate: moment().year(2023).month(9).date(30).hour(18).startOf('hour').toDate(),
      room: '31',
      subject: 'EN419 Компютърни системи',
      teacher: 'проф. д-р Тодор Тодоров',
    }

    const expected: LectureViewModel = {
      id: 0,
      startDate: moment().year(2023).month(9).date(30).hour(14).startOf('hour').toDate(),
      endDate: moment().year(2023).month(9).date(30).hour(18).startOf('hour').toDate(),
      room: '31',
      subject: 'Компютърни системи',
      teacher: 'проф. д-р Тодор Тодоров',
    }

    const res = component['lectureToViewModel'](lecture, 0);

    expect(res).toEqual(expected);
  });
});
