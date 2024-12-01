import { UserListComponent } from "./components/user-list/user-list.component";
import { Component, OnInit, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { UsersService } from "./services/users.service";
import { User } from "./models/user.model";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [UserListComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  usersService = inject(UsersService);

  users: User[] = [];
  usersError: HttpErrorResponse | undefined;

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (error) => {
        this.usersError = error;
      },
    });
  }
}
