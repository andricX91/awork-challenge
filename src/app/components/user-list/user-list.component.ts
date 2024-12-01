import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  input,
  Input,
} from "@angular/core";
import { UserItemComponent } from "../user-item/user-item.component";
import { GroupingCriteria, User } from "../../models/user.model";
import { UsersService } from "../../services/users.service";
import { HttpErrorResponse } from "@angular/common/http";
import { TitleCasePipe } from "@angular/common";
import { take } from "rxjs";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrl: "./user-list.component.scss",
  imports: [UserItemComponent, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserListComponent {
  @Input()
  set users(value: User[]) {
    this.allUsers = value;
    this.visibleUsers = value.slice(0, this.batch);
  }

  usersError = input.required<HttpErrorResponse | undefined>();
  usersService = inject(UsersService);

  allUsers: User[] = [];
  visibleUsers: User[] = [];
  selectedUser: User | undefined;

  batch: number = 100;
  search: string | undefined;

  groups = Object.values(GroupingCriteria);
  groupingCriteria: GroupingCriteria | undefined;
  group: GroupingCriteria | undefined;

  @HostListener("window:scroll", [])
  onScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const scrollPercentage = (scrollTop + windowHeight) / documentHeight;

    if (scrollPercentage >= 0.9) {
      this.loadNextBatch();
    }
  }

  loadNextBatch(): void {
    const loadedBatches = this.visibleUsers.length / this.batch;
    this.visibleUsers = this.allUsers.slice(
      0,
      (loadedBatches + 1) * this.batch
    );
  }

  processUsers(type: "group" | "search", input: string): void {
    this.selectedUser = undefined;

    switch (type) {
      case "search":
        this.search = input;
        break;
      case "group":
        const criteria: GroupingCriteria = input as GroupingCriteria;
        this.group = criteria;
        break;
    }

    this.usersService
      .processUsers(this.allUsers, this.group, this.search)
      .pipe(take(1)) // Take only the first emission
      .subscribe({
        next: (groupedUsers) => {
          this.visibleUsers = groupedUsers.slice(0, this.batch); // Update the users with grouped data
        },
        error: (err) => {
          console.error("Error grouping users:", err); // Handle any errors
        },
      });
  }
}
