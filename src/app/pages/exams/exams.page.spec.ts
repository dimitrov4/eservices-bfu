import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import { Observable, of } from 'rxjs';

import { type Exam } from '../../models/exam';
import { ExamService } from '../../services/exams.service';
import { ExamsGroup, ExamsPage, ExamViewModel } from '././exams.page';

describe('ExamsPage', () => {
  let component: ExamsPage;
  let fixture: ComponentFixture<ExamsPage>;
  let examsService: ExamService;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ExamsPage);
    examsService = TestBed.inject(ExamService)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#load should load exams', () => {
    const exams: Observable<Exam[]> = of(
      [
        {
          startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
          endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
          room: '107',
          subject: 'Теория на алгоритмите',
          teacher: 'доц. д-р Мария Маринова',
          type: 'Писмен',
          session: 'Редовна сесия',
        }
      ]
    );

    const expected: ExamsGroup = new Map([
      [
        '230413',
        [
          {
            id: 0,
            startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
            endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
            room: '107',
            subject: 'Теория на алгоритмите',
            teacher: 'доц. д-р Мария Маринова',
            type: 'Писмен',
            session: 'Редовна',
          }
        ]
      ]]);

    spyOn(examsService, 'getAll').and.returnValue(exams);

    const res = component['load']();

    res.subscribe(value => expect(value).toEqual(expected));
  });

  it('#groupByDate should group exams by date', () => {
    const exams: ExamViewModel[] =
      [
        {
          id: 0,
          startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
          endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
          room: '107',
          subject: 'Теория на алгоритмите',
          teacher: 'доц. д-р Мария Маринова',
          type: 'Писмен',
          session: 'Редовна',
        },
        {
          id: 1,
          startDate: moment().year(2023).month(3).date(13).hour(12).startOf('hour').toDate(),
          endDate: moment().year(2023).month(3).date(13).hour(15).startOf('hour').toDate(),
          room: '431',
          subject: 'Кодиране и защита на информацията',
          teacher: 'доц. д-р Никола Николов',
          type: 'Писмен',
          session: 'Редовна',
        },
        {
          id: 2,
          startDate: moment().year(2024).month(4).date(14).hour(9).startOf('hour').toDate(),
          endDate: moment().year(2024).month(4).date(14).hour(13).startOf('hour').toDate(),
          room: '214',
          subject: 'Web технологии и приложения',
          teacher: 'доц. д-р Иван Иванов',
          type: 'Писмен',
          session: 'Редовна',
        }
      ];

    const expected: ExamsGroup = new Map([
      [
        '230413',
        [
          {
            id: 0,
            startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
            endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
            room: '107',
            subject: 'Теория на алгоритмите',
            teacher: 'доц. д-р Мария Маринова',
            type: 'Писмен',
            session: 'Редовна',
          },
          {
            id: 1,
            startDate: moment().year(2023).month(3).date(13).hour(12).startOf('hour').toDate(),
            endDate: moment().year(2023).month(3).date(13).hour(15).startOf('hour').toDate(),
            room: '431',
            subject: 'Кодиране и защита на информацията',
            teacher: 'доц. д-р Никола Николов',
            type: 'Писмен',
            session: 'Редовна'
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
            type: 'Писмен',
            session: 'Редовна'
          }
        ]
      ]]);

    const grouped = component['groupByDate'](exams);

    expect(grouped.get('230413')).toBeDefined();
    expect(grouped.get('230413')).toEqual(expected.get('230413'));

    expect(grouped.get('240514')).toBeDefined();
    expect(grouped.get('240514')).toEqual(expected.get('240514'));
  });

  it('#examToViewModel should convert exam models to view models', () => {
    const exam: Exam = {
      startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
      endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
      room: '107',
      subject: 'Теория на алгоритмите',
      teacher: 'доц. д-р Мария Маринова',
      type: 'Писмен',
      session: 'Редовна сесия',
    }

    const expected: ExamViewModel = {
      id: 0,
      startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
      endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
      room: '107',
      subject: 'Теория на алгоритмите',
      teacher: 'доц. д-р Мария Маринова',
      type: 'Писмен',
      session: 'Редовна',
    }

    const res = component['examToViewModel'](exam, 0);

    expect(res).toEqual(expected);
  });
});
