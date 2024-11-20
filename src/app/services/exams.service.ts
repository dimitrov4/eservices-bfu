import { Injectable } from '@angular/core';
import moment from 'moment';
import { map, Observable } from 'rxjs';

import { type Exam } from '../models/exam';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private readonly url = `https://e-services.bfu.bg/api/exams.php`;

  constructor(private readonly apiService: ApiService) { }

  public getAll(): Observable<Exam[]> {
    return this
      .fetch(this.url)
      .pipe(
        map(this.parse),
        map(dtos => dtos.map(this.dtoToExam))
      );
  }

  private fetch(url: string): Observable<string> {
    return this.apiService
      .post(url)
      .pipe(map(resp => resp.data));
  }

  private parse(json: string): ExamDto[] {
    if (json === '[]') return [];
    const parsed: ExamsDto = JSON.parse(json);
    return parsed.EXAMS;
  }

  private dtoToExam(dto: ExamDto): Exam {
    const timePattern = /(?<gStart>\d{2})-(?<gEnd>\d{2})/;
    const datePattern = /(?<gDay>\d{2})\.(?<gMonth>\d{2})\.(?<gYear>\d{2})/;

    const { day, time, room, subject, teacher, type, session } = dto;

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
      type,
      session,
    };
  }
}

type ExamsDto = {
  EXAMS: ExamDto[]
}

type ExamDto = {
  day: string,
  time: string,
  room: string,
  subject: string,
  teacher: string,
  spec: string,
  type: string,
  session: string,
}
