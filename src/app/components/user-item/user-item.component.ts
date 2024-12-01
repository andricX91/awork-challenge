import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
} from "@angular/core";
import { SafeURLPipe } from "../../pipes/safe-url.pipe";
import { User } from "../../models/user.model";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-user-item",
  templateUrl: "./user-item.component.html",
  styleUrl: "./user-item.component.scss",
  imports: [DatePipe, SafeURLPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserItemComponent {
  user = input.required<User>();
  allUsers = input.required<User[]>();
  expandUser: boolean = false;

  @Input()
  set selectedUser(value: User | undefined) {
    this.expandUser = this.user().login?.uuid === value?.login?.uuid;
  }

  /**
   * Get the count of users with same nationality
   */
  get nationalitiesCount(): number {
    if (!this.allUsers().length) {
      return 0;
    }

    return this.allUsers().reduce((acc, user) => {
      return user.nat === this.user().nat ? acc + 1 : acc;
    }, 0);
  }
}
