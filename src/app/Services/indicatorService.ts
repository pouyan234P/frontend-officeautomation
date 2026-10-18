import { API_BASE } from '../api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Typeenum } from '../Model/enumletter/Typeenum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
private baseurl = API_BASE + 'Indicator/'; // Replace with your actual server URL
  constructor(private httpclient:HttpClient) 
  {

   }

   getlastNumberbyType(Type: string,depid: number,year: number ):Observable<number>
   {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.get<number>(this.baseurl+"getlastNumberbyType/"+Type+'/'+depid+'/'+year,{headers});
   }

}
