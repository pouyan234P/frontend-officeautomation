import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Typeenum } from '../Model/enumletter/Typeenum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
private baseurl = 'http://localhost:5295/api/Indicator/'; // Replace with your actual server URL
  constructor(private httpclient:HttpClient) 
  {

   }

   getlastNumberbyType(Type: string,depid: number,year: number ):Observable<number>
   {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.get<number>(this.baseurl+"getlastNumberbyType/"+Type+'/'+depid+'/'+year,{headers});
   }

}
