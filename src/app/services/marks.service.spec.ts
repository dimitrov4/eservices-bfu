import { TestBed } from '@angular/core/testing';
import moment from 'moment/moment';
import { Observable, of } from 'rxjs';

import { type Mark } from '../models/mark';
// @ts-ignore
import { MarkDto, MarkService } from './marks.service';

describe('MarksService', () => {
  let service: MarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#parse should parse the marks json data', () => {
    const json: string =
      `{
        "MARKS": [
          {
            "number": 1,
            "year": "2022-2023",
            "semestar": 1,
            "subject": "CS102  Web технологии и приложения",
            "mark": "6",
            "session": "Р",
            "day": "13.04.23",
            "credits": 6,
            "note": "-"
          },
          {
            "number": 2,
            "year": "2023-2024",
            "semestar": 1,
            "subject": "EN411  Кодиране и защита на информацията",
            "mark": "6",
            "session": "Р",
            "day": "14.05.24",
            "credits": 6,
            "note": "-"
          }
        ]
      }`;

    const expected: MarkDto[] =
      [
        {
          number: 1,
          year: '2022-2023',
          semestar: 1,
          subject: 'CS102  Web технологии и приложения',
          mark: '6',
          session: 'Р',
          day: '13.04.23',
          credits: 6,
          note: '-',
        },
        {
          number: 2,
          year: '2023-2024',
          semestar: 1,
          subject: 'EN411  Кодиране и защита на информацията',
          mark: '6',
          session: 'Р',
          day: '14.05.24',
          credits: 6,
          note: '-'
        }
      ];

    const parsed = service['parse'](json);

    expect(parsed).toEqual(expected);
  });

  it('#parse should parse empty response', () => {
    const json: string = '[]';
    const expected: MarkDto[] = [];

    const resp = service['parse'](json);

    expect(resp).toEqual(expected);
  });

  it('#dtoToMark should convert data transfer object to a model', () => {
    const dto: MarkDto =
    {
      number: 1,
      year: '2022-2023',
      semestar: 1,
      subject: 'CS102  Web технологии и приложения',
      mark: '6',
      session: 'Р',
      day: '13.04.23',
      credits: 6,
      note: '-',
    };

    const expected: Mark = {
      date: moment().year(2023).month(3).date(13).startOf('date').toDate(),
      subject: 'CS102  Web технологии и приложения',
      mark: '6',
      session: 'Р',
      credits: 6,
    };

    const result = service['dtoToMark'](dto);

    expect(result).toEqual(expected);
  });

  it('#getAll should retrieve marks', () => {
    const json: Observable<string> = of(
      `{
        "MARKS": [
          {
            "number": 1,
            "year": "2022-2023",
            "semestar": 1,
            "subject": "CS102  Web технологии и приложения",
            "mark": "6",
            "session": "Р",
            "day": "13.04.23",
            "credits": 6,
            "note": "-"
          }
        ]
      }`
    );

    const dto: MarkDto[] =
      [
        {
          number: 1,
          year: '2022-2023',
          semestar: 1,
          subject: 'CS102  Web технологии и приложения',
          mark: '6',
          session: 'Р',
          day: '13.04.23',
          credits: 6,
          note: '-',
        }
      ];

    const expected: Mark[] =
      [
        {
          date: moment().year(2023).month(3).date(13).startOf('date').toDate(),
          subject: 'CS102  Web технологии и приложения',
          mark: '6',
          session: 'Р',
          credits: 6,
        }
      ];

    spyOn<any>(service, 'fetch').and.returnValue(json);
    spyOn<any>(service, 'parse').and.returnValue(dto);

    service
      .getAll()
      .subscribe(resp => expect(resp[0]).toEqual(expected[0]));
  });
});
