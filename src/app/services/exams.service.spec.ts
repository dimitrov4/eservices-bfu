import { TestBed } from '@angular/core/testing';
import moment from 'moment/moment';
import { Observable, of } from 'rxjs';

import { type Exam } from '../models/exam';
// @ts-ignore
import { ExamDto, ExamService } from './exams.service';

describe('ExamsService', () => {
  let service: ExamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#parse should parse the exams json data', () => {
    const json: string =
      `{
        "EXAMS": [
          {
            "day": "13.04.23 (чт.)",
            "time": "09-11",
            "room": "214",
            "subject": "Web технологии и приложения",
            "teacher": "доц. д-р Иван Иванов",
            "spec": "СИ",
            "type": "Писмен",
            "session": "Редовна сесия"
          },
          {
            "day": "14.05.24 (вт.)",
            "time": "12-15",
            "room": "431",
            "subject": "Кодиране и защита на информацията",
            "teacher": "доц. д-р Никола Николов",
            "spec": "СИ",
            "type": "Писмен",
            "session": "Редовна сесия"
          }
        ]
      }`;

    const expected: ExamDto[] =
      [
        {
          day: '13.04.23 (чт.)',
          time: '09-11',
          room: '214',
          subject: 'Web технологии и приложения',
          teacher: 'доц. д-р Иван Иванов',
          spec: 'СИ',
          type: 'Писмен',
          session: 'Редовна сесия'
        },
        {
          day: '14.05.24 (вт.)',
          time: '12-15',
          room: '431',
          subject: 'Кодиране и защита на информацията',
          teacher: 'доц. д-р Никола Николов',
          spec: 'СИ',
          type: 'Писмен',
          session: 'Редовна сесия'
        }
      ];

    const parsed = service['parse'](json);

    expect(parsed).toEqual(expected);
  });

  it('#parse should parse empty response', () => {
    const json: string = '[]';
    const expected: ExamDto[] = [];

    const resp = service['parse'](json);

    expect(resp).toEqual(expected);
  });

  it('#dtoToExam should convert data transfer object to a model', () => {
    const dto: ExamDto =
    {
      day: '13.04.23 (чт.)',
      time: '09-11',
      room: '214',
      subject: 'Web технологии и приложения',
      teacher: 'доц. д-р Иван Иванов',
      spec: 'СИ',
      type: 'Писмен',
      session: 'Редовна сесия',
    };

    const expected: Exam = {
      startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
      endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
      room: '214',
      subject: 'Web технологии и приложения',
      teacher: 'доц. д-р Иван Иванов',
      type: 'Писмен',
      session: 'Редовна сесия',
    };

    const result = service['dtoToExam'](dto);

    expect(result).toEqual(expected);
  });

  it('#getAll should retrieve exams', () => {
    const json: Observable<string> = of(
      `{
        "EXAMS": [
          {
            "day": "13.04.23 (чт.)",
            "time": "09-11",
            "room": "214",
            "subject": "Web технологии и приложения",
            "teacher": "доц. д-р Иван Иванов",
            "spec": "СИ",
            "type": "Писмен",
            "session": "Редовна сесия"
          }
        ]
      }`
    );

    const dto: ExamDto[] =
      [
        {
          day: '13.04.23 (чт.)',
          time: '09-11',
          room: '214',
          subject: 'Web технологии и приложения',
          teacher: 'доц. д-р Иван Иванов',
          spec: 'СИ',
          type: 'Писмен',
          session: 'Редовна сесия',
        }
      ];

    const expected: Exam[] =
      [
        {
          startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
          endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
          room: '214',
          subject: 'Web технологии и приложения',
          teacher: 'доц. д-р Иван Иванов',
          type: 'Писмен',
          session: 'Редовна сесия',
        }
      ];

    spyOn<any>(service, 'fetch').and.returnValue(json);
    spyOn<any>(service, 'parse').and.returnValue(dto);

    service
      .getAll()
      .subscribe(resp => expect(resp[0]).toEqual(expected[0]));
  });
});
