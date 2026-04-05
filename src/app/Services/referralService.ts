import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Typeenum } from '../Model/enumletter/Typeenum';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private baseurl = 'http://localhost:5295/api/referral/'; // Replace with your actual server URL
  constructor(private httpclient:HttpClient) { }
  createreferral(model:any,Type: Typeenum,iddept: number)
  {
     const headers = new HttpHeaders();
     headers.append('Content-type', 'application/json');
     return this.httpclient.post(this.baseurl+"createreferral/"+Type+"/"+iddept,model,{headers})
  }

}
