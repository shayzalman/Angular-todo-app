import {Component} from '@angular/core';
import {AuthenticationService, User} from '@app/auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nest-ng-demo';
  user: User;
  constructor(private authenticationService: AuthenticationService) {
    authenticationService.currentUser.subscribe(obs => {
      this.user = obs;
    });
  }
}
