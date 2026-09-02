import { Component, inject } from '@angular/core';
import { LabelModule } from 'primeng/label';
import { CardModule } from 'primeng/card';
import { UserWidgetComponent } from "./widgets/user.widget";
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  imports: [LabelModule, CardModule, UserWidgetComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  constructor(){
    this.userService.getUser(this.authService.userId ?? "").subscribe((user) => {
      this.userService.currentUser.set(user);
      console.log(this.userService.currentUser());
    });
  }
}
