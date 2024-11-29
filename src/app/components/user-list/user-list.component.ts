import { UserItemComponent } from "../user-item/user-item.component";
import { UsersService } from "../../services/users.service";
import { GroupingCriteria } from "../../models/user.model";
import { Component, inject, Input } from "@angular/core";
import { TitleCasePipe } from "@angular/common";
import { take } from "rxjs";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrl: "./user-list.component.scss",
  imports: [UserItemComponent, TitleCasePipe],
  standalone: true,
})
export class UserListComponent {
  @Input() users: any[] = [];
  usersService = inject(UsersService);

  groups = Object.values(GroupingCriteria);
  groupingCriteria: GroupingCriteria = GroupingCriteria.Alphabetically;

  groupUsers(criteria: GroupingCriteria): void {
    this.usersService
      .groupUsers(this.users, criteria)
      .pipe(take(1)) // Take only the first emission
      .subscribe({
        next: (groupedUsers) => {
          this.users = groupedUsers; // Update the users with grouped data
        },
        error: (err) => {
          console.error("Error grouping users:", err); // Handle any errors
        },
      });
  }
}
