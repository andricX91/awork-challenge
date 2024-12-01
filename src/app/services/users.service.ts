import { User, GroupingCriteria } from "../models/user.model";
import { ApiResult } from "../models/api-result.model";
import { HttpClient } from "@angular/common/http";
import { Observable, map, of, tap } from "rxjs";
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
    const sessionKey = `users_page_${page}`;
    const cachedUsers = sessionStorage.getItem(sessionKey);

    if (cachedUsers) {
      const users = JSON.parse(cachedUsers) as User[];
      return of(users);
    }

    return this.httpClient
      .get<ApiResult>(`${this.apiUrl}?results=5000&seed=awork&page=${page}`)
      .pipe(
        map((apiResult) => User.mapFromUserResult(apiResult.results)),
        tap((users) =>
          sessionStorage.setItem(sessionKey, JSON.stringify(users))
        )
      );
  }

  /**
   * Groups & Search users based on the given criteria using a Web Worker.
   * @param {GroupingCriteria} group - The criteria for grouping users.
   * * @param {string} search - The criteria for searching users.
   * @returns {Observable<User[]>} - An observable that emits grouped users.
   */
  processUsers(
    users: User[],
    group?: GroupingCriteria,
    search?: string
  ): Observable<User[]> {
    return new Observable((observer) => {
      const worker = new Worker(
        new URL("../components/user-list/user.worker", import.meta.url)
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
      worker.postMessage({ users: plainUsers, group, search });
    });
  }
}
