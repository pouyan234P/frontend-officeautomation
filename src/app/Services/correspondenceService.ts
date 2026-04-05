import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, model } from '@angular/core';
import { Observable } from 'rxjs';
import { LetterModel } from '../Model/LetterModel';

@Injectable({
  providedIn: 'root'
})
export class CorrespondenceService {
  private baseurl = 'http://localhost:5295/api/Letter/';
  constructor(private httpclient: HttpClient) { }
  addLetter(model:any):Observable<LetterModel>
{
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.httpclient.post<LetterModel>(this.baseurl+'addLetter',model,{headers});
}
}
