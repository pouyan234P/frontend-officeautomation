import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetDepartmentModel } from '../Model/getDepartmentModel';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
private http = inject(HttpClient);
private baseurl = 'http://localhost:5295/api/department/';
  constructor(private httpclient:HttpClient) { }

  getDepartment(): Observable<GetDepartmentModel[]>
  {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.get<GetDepartmentModel[]>(this.baseurl+ 'getDepartment',{headers});
  }
  addDepartment(model:any)
  {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.post(this.baseurl+'addDepartment',model,{headers});
  }
}
