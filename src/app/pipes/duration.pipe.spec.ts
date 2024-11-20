import moment from 'moment';

import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  const pipe = new DurationPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a duration of 3 hours', () => {
    const date1 = moment().year(2021).month(0).date(30).hours(11).startOf('hour').toDate();
    const date2 = moment().year(2021).month(0).date(30).hours(14).startOf('hour').toDate();
    const expected = moment.duration(3, 'hours').asHours();

    expect(pipe.transform([date1, date2])).toEqual(expected);
  });

  it('should return a duration of 3 hours with date2 preceding date1', () => {
    const date1 = moment().year(2021).month(0).date(30).hours(14).startOf('hour').toDate();
    const date2 = moment().year(2021).month(0).date(30).hours(11).startOf('hour').toDate();
    const expected = moment.duration(3, 'hours').asHours();

    expect(pipe.transform([date1, date2])).toEqual(expected);
  });

  it('should return a duration of 45 minutes', () => {
    const date1 = moment().year(2021).month(0).date(30).hours(11).minutes(30).startOf('minutes').toDate();
    const date2 = moment().year(2021).month(0).date(30).hours(12).minutes(15).startOf('minute').toDate();
    const expected = moment.duration(45, 'minutes').asMinutes();

    expect(pipe.transform([date1, date2], 'minutes')).toEqual(expected);
  });

  it('should return a duration of 0 hours', () => {
    const date1 = moment().year(2021).month(0).date(30).hours(11).minutes(30).startOf('minutes').toDate();
    const date2 = moment().year(2021).month(0).date(30).hours(12).minutes(15).startOf('minute').toDate();
    const expected = moment.duration(0, 'hours').asMinutes();

    expect(pipe.transform([date1, date2], 'hours')).toEqual(expected);
  });
});
