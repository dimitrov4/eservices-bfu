import { TestBed } from '@angular/core/testing';
import moment from 'moment';
import { Observable, of } from 'rxjs';

import { type Lecture } from '../models/lecture';
// @ts-ignore
import { LectureDto, LectureService } from './lectures.service';

describe('LecturesService', () => {
  let service: LectureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LectureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#parse should parse the lectures json data', () => {
    const json: string =
      `{
        "GRAPHIC": [
          {
            "day": "13.04.23 (чт.)",
            "time": "09-11 (2)",
            "room": "214",
            "type": "група 1",
            "subject": "CS102 Компютърни системи",
            "teacher": "доц. д-р Иван Иванов",
            "stat": "-"
          },
          {
            "day": "14.05.24 (вт.)",
            "time": "12-15 (3)",
            "room": "431",
            "type": "група 1",
            "subject": "EN411 Кодиране и защита на информацията",
            "teacher": "доц. д-р Никола Николов",
            "stat": "-"
          }
        ]
      }`;

    const expected: LectureDto[] =
      [
        {
          day: '13.04.23 (чт.)',
          time: '09-11 (2)',
          room: '214',
          type: 'група 1',
          subject: 'CS102 Компютърни системи',
          teacher: 'доц. д-р Иван Иванов',
          stat: '-',
        },
        {
          day: '14.05.24 (вт.)',
          time: '12-15 (3)',
          room: '431',
          type: 'група 1',
          subject: 'EN411 Кодиране и защита на информацията',
          teacher: 'доц. д-р Никола Николов',
          stat: '-',
        }
      ];

    const parsed = service['parse'](json);

    expect(parsed).toEqual(expected);
  });

  it('#parse should parse empty response', () => {
    const json: string = '[]';
    const expected: LectureDto[] = [];

    const resp = service['parse'](json);

    expect(resp).toEqual(expected);
  });

  it('#dtoToLecture should convert data transfer object to a model', () => {
    const dto: LectureDto =
    {
      day: '13.04.23 (чт.)',
      time: '09-11 (2)',
      room: '214',
      type: 'група 1',
      subject: 'CS102 Компютърни системи',
      teacher: 'доц. д-р Иван Иванов',
      stat: '-',
    };

    const expected: Lecture = {
      startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
      endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
      room: '214',
      subject: 'CS102 Компютърни системи',
      teacher: 'доц. д-р Иван Иванов',
    };

    const result = service['dtoToLecture'](dto);

    expect(result).toEqual(expected);
  });

  it('#getAll should retrieve lectures', () => {
    const json: Observable<string> = of(
      `{
        "GRAPHIC": [
          {
            "day": "13.04.23 (чт.)",
            "time": "09-11 (2)",
            "room": "214",
            "type": "група 1",
            "subject": "CS102 Компютърни системи",
            "teacher": "доц. д-р Иван Иванов",
            "stat": "-",
          }
        ]
      }`
    );

    const dto: LectureDto[] =
      [
        {
          day: '13.04.23 (чт.)',
          time: '09-11 (2)',
          room: '214',
          type: 'група 1',
          subject: 'CS102 Компютърни системи',
          teacher: 'доц. д-р Иван Иванов',
          stat: '-',
        }
      ];

    const expected: Lecture[] =
      [
        {
          startDate: moment().year(2023).month(3).date(13).hour(9).startOf('hour').toDate(),
          endDate: moment().year(2023).month(3).date(13).hour(11).startOf('hour').toDate(),
          room: '214',
          subject: 'CS102 Компютърни системи',
          teacher: 'доц. д-р Иван Иванов',
        }
      ];

    spyOn<any>(service, 'fetch').and.returnValue(json);
    spyOn<any>(service, 'parse').and.returnValue(dto);

    service
      .getAll()
      .subscribe(resp => expect(resp[0]).toEqual(expected[0]));
  });
});
