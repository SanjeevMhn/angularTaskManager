import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { WorkboardType } from '../../components/workboard/workboard-types';



@Injectable({
  providedIn: 'root',
})
export class WorkboardService {
  private http = inject(HttpClient);
  private apiUrL = environment.apiUrl;

  getBoards(): Observable<Array<WorkboardType>> {
    return this.http.get<Array<WorkboardType>>(`${this.apiUrL}/workboards`);
  }
}
