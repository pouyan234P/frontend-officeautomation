import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE } from '../api.config';
import { RoleModel } from '../Model/roleModel';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);

  /** GET api/role/getAll — every role with its user count. */
  getAll(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(API_BASE + 'role/getAll');
  }

  /** POST api/role/create */
  create(name: string) {
    return this.http.post(API_BASE + 'role/create', { name });
  }

  /** PUT api/user/{id}/roles — replaces the user's roles with this list. */
  setUserRoles(userId: number, roles: string[]) {
    return this.http.put(API_BASE + 'user/' + userId + '/roles', { roles });
  }
}
