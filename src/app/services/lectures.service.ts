import { Injectable } from '@angular/core';
import moment from 'moment';
import { map, Observable } from 'rxjs';

import { type Lecture } from '../models/lecture';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  private readonly url = `https://e-services.bfu.bg/api/graphic.php`;

  constructor(private readonly apiService: ApiService) { }

  public getAll(): Observable<Lecture[]> {
    return this
      .fetch(this.url)
      .pipe(
        map(this.parse),
        map(dtos => dtos.map(this.dtoToLecture))
      );
  }

  private fetch(url: string): Observable<string> {
    return this.apiService
      .post(url)
      .pipe(map(resp => resp.data));
  }

  private parse(json: string): LectureDto[] {
    if (json === '[]') return [];
    const parsed: LecturesDto = JSON.parse(json);
    return parsed.GRAPHIC;
  }

  private dtoToLecture(dto: LectureDto): Lecture {
    const timePattern = /(?<gStart>\d{2})-(?<gEnd>\d{2})/;
    const datePattern = /(?<gDay>\d{2})\.(?<gMonth>\d{2})\.(?<gYear>\d{2})/;

    const { day, time, room, teacher, subject } = dto;

    const dayResult = datePattern.exec(day);
    const timeResult = timePattern.exec(time);

    const { gDay, gMonth, gYear } = dayResult!.groups!;
    const { gStart, gEnd } = timeResult!.groups!;

    const date = new Date(`${gMonth}/${gDay}/${gYear}`);
    const startDate = moment(date).hours(+gStart).toDate();
    const endDate = moment(date).hours(+gEnd).toDate();

    return {
      startDate,
      endDate,
      room,
      subject,
      teacher,
    };
  }
}

type LecturesDto = {
  GRAPHIC: LectureDto[]
}

type LectureDto = {
  day: string,
  time: string,
  room: string,
  type: string,
  subject: string,
  teacher: string,
  stat: string,
}
