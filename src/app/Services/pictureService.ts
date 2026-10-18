import { API_BASE } from '../api.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  baseurl=API_BASE + 'picture/';
  constructor(private httpclient:HttpClient) { }

  addPicture(file: File)
  {
    const formData = new FormData();
    
    // 'signatureImage' is the key your backend will look for. 
    // Make sure this matches what your server expects!
    formData.append('File', file, file.name);
    return this.httpclient.post<any>(this.baseurl+ 'addPicture',formData);
  }
}
