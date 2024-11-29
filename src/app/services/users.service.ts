import { User, GroupingCriteria } from "../models/user.model";
import { ApiResult } from "../models/api-result.model";
import { HttpClient } from "@angular/common/http";
import { Observable, concat, map } from "rxjs";
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
      .get<ApiResult>(`${this.apiUrl}?results=50&seed=awork&page=${page}`)
      .pipe(map((apiResult) => User.mapFromUserResult(apiResult.results)));

    const largeBatch = this.httpClient
      .get<ApiResult>(`${this.apiUrl}?results=450&seed=awork&page=${page}`)
      .pipe(map((apiResult) => User.mapFromUserResult(apiResult.results)));

    const remainingBatch = this.httpClient
      .get<ApiResult>(`${this.apiUrl}?results=4500&seed=awork&page=${page}`)
      .pipe(map((apiResult) => User.mapFromUserResult(apiResult.results)));

    return concat(smallBatch, largeBatch, remainingBatch);
  }

  /**
   * Groups users based on the given criteria using a Web Worker.
   * @param {string} criteria - The criteria for grouping users.
   * @returns {Observable<User[]>} - An observable that emits grouped users.
   */
  groupUsers(users: User[], criteria: GroupingCriteria): Observable<User[]> {
    return new Observable((observer) => {
      const worker = new Worker(
        new URL("../components/user-list/user-grouping.worker", import.meta.url)
      );

      worker.onmessage = ({ data }) => {
        if (data.error) {
          observer.error(data.error);
        } else {
          observer.next(data);
          observer.complete();
        }
      };

      worker.onerror = (err) => observer.error(err);

      const plainUsers = users.map((user) => ({ ...user }));
      worker.postMessage({ users: plainUsers, criteria });
    });
  }
}
