import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Typeenum } from '../Model/enumletter/Typeenum';
import { Observable } from 'rxjs';
import {ReferralModel} from '../Model/referralModel';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private baseurl = 'http://localhost:5295/api/referral/'; // Replace with your actual server URL
  constructor(private httpclient:HttpClient) { }
  createreferral(model:any,iddept: number)
  {
     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.httpclient.post(this.baseurl+"createreferral/"+iddept,model,{headers})
  }
  getAllByReciver(id: number): Observable<ReferralModel[]>
  {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.get<ReferralModel[]>(this.baseurl+"getAllByReciver/"+id,{headers});
  }
  updatereferral(model: any)
  {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.post(this.baseurl+"updatereferral",model,{headers});
  }

  getbytyperecvierid(reciverid: number,type: Typeenum): Observable<ReferralModel[]>
  {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.post<ReferralModel[]>(this.baseurl+'getbytyperecvierid/'+ reciverid,JSON.stringify(type),{headers});
  }

  getAllbySenderposition(id: number): Observable<ReferralModel[]>
  {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.get<ReferralModel[]>(this.baseurl+'getAllbySenderposition/'+id,{headers});
  }
  getReferralbyTypeSenderid(senderid: number,type: Typeenum): Observable<ReferralModel[]>
  {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.post<ReferralModel[]>(this.baseurl+'getReferralbyTypeSenderid/'+senderid,JSON.stringify(type),{headers});
  }
}
