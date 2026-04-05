// data.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root' // Makes this service available everywhere
})
export class authservice {
  private http = inject(HttpClient);
  private baseurl = 'http://localhost:5295/api/auth/'; // Replace with your actual server URL
  constructor(private httpclient:HttpClient,private cookieService:CookieService)
  {

  }
  Login(model:any)
  {
     const headers = new HttpHeaders();
  headers.append('Content-type', 'application/json');
  return this.httpclient.post(this.baseurl+ 'login',model,{headers}).pipe(
    map((response:any)=>{
        const user=response;
        if (user && user.token) {
          this.cookieService.set("auth",user.token);
          console.log('Token received:', user);
        }
    })
  )
  }
  register(user:any)
  {
    console.log(user);
  let headers = new HttpHeaders();
  headers.append('Content-type', 'application/json');
 return this.httpclient.post(this.baseurl + 'register' ,user, {headers:headers})
  }
}