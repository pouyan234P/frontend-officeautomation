import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../Model/userModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseurl="http://localhost:5295/api/user/";
  constructor(private httpclient:HttpClient) { }

  getAll(): Observable<UserModel[]> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.httpclient.get<UserModel[]>(this.baseurl+ 'getAll', { headers });
}

  // Edit an existing user. Backend must expose: PUT api/user/updateUser/{id}
  updateUser(id: number, model: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpclient.put(this.baseurl + 'updateUser/' + id, model, { headers });
  }

}
