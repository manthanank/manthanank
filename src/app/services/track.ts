import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Visit } from '../models/visit.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Track {
  apiURL = environment.trackingApiUrl;

  http = inject(HttpClient);

  constructor() {}

  trackProjectVisit(projectName: string): Observable<Visit> {
    return this.http.post<Visit>(this.apiURL, { projectName });
  }
}
