import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetPosition } from '../Model/getPosition';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  baseurl="http://localhost:5295/api/position/"
  constructor(private httpclient:HttpClient) { }

  getAll(): Observable<GetPosition[]>
  {
     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.httpclient.get<GetPosition[]>(this.baseurl+ 'getAll', { headers });
  }
  addPosition(model: any)
  {
    const headers=new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpclient.post(this.baseurl+ 'insertPosition',model,{headers});
  }
  getposanddep():Observable<GetPosition>
  {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.get<GetPosition>(this.baseurl+ 'getposanddept', { headers });
  }
  getPositionbyDept(id: number): Observable<GetPosition>
  {
    return this.httpclient.get<GetPosition>(this.baseurl+ 'getPositionbyDept/'+ id);
  }
  getPositionbyuser(id: number): Observable<GetPosition>
  {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.get<GetPosition>(this.baseurl+ 'getPositionbyuser/'+id, { headers });
  }
}
