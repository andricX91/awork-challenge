import { ApiResult } from "../models/api-result.model";
import { HttpClient } from "@angular/common/http";
import { Observable, concat, map } from "rxjs";
import { User } from "../models/user.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private apiUrl = "https://randomuser.me/api";
  constructor(private httpClient: HttpClient) {}

  /**
   * Fetches 5000 mock users from the api
   * @param {number} page
   * @returns {Observable<User[]>}
   */
  getUsers(page = 1): Observable<User[]> {
    const smallBatch = this.httpClient
      .get<ApiResult>(`${this.apiUrl}?results=100&seed=awork&page=${page}`)
      .pipe(map((apiResult) => User.mapFromUserResult(apiResult.results)));

    const largeBatch = this.httpClient
      .get<ApiResult>(`${this.apiUrl}?results=400&seed=awork&page=${page}`)
      .pipe(map((apiResult) => User.mapFromUserResult(apiResult.results)));

    // const remainingBatch = this.httpClient
    //   .get<ApiResult>(`${this.apiUrl}?results=4500&seed=awork&page=${page}`)
    //   .pipe(map((apiResult) => User.mapFromUserResult(apiResult.results)));

    return concat(smallBatch, largeBatch);
  }
}
