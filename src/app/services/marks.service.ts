import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { type Mark } from '../models/mark';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MarkService {

  private readonly url = `https://e-services.bfu.bg/api/marks.php`;

  constructor(private readonly apiService: ApiService) { }

  public getAll(): Observable<Mark[]> {
    return this
      .fetch(this.url)
      .pipe(
        map(this.parse),
        map(dtos => dtos.map(this.dtoToMark))
      );
  }

  private fetch(url: string): Observable<string> {
    return this.apiService
      .post(url)
      .pipe(map(resp => resp.data));
  }

  private parse(json: string): MarkDto[] {
    if (json === '[]') return [];
    const parsed: MarksDto = JSON.parse(json);
    return parsed.MARKS;
  }

  private dtoToMark(dto: MarkDto): Mark {
    const datePattern = /(?<gDay>\d{2})\.(?<gMonth>\d{2})\.(?<gYear>\d{2})/;

    let { day, mark, credits, session, subject } = dto;

    const res = datePattern.exec(day);

    const { gDay, gMonth, gYear } = res!.groups!;
    const date = new Date(`${gMonth}/${gDay}/${gYear}`);

    return {
      date,
      subject,
      mark,
      session,
      credits,
    }
  }
}

type MarksDto = {
  MARKS: MarkDto[]
}

type MarkDto = {
  day: string,
  number: number,
  year: string,
  semestar: number,
  subject: string,
  mark: string,
  session: string,
  credits: number,
  note: string,
}
