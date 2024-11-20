import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(value: Duration, args: Units = 'hours'): number {
    const start = moment(value[0]);
    const end = moment(value[1]);
    return Math.abs(end.diff(start, args));
  }
}

type Duration = [Date, Date];

type Units =
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds';
