import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false; // init flag as false

  private authListenerSubs: Subscription;
  /* show login and signup only if we are not authenticated, no token
    otherwise hide them */
  constructor(private authService: AuthService) {

  } // inject AuthService

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getAuthStatus(); // call this to update userIsAuthenticated
    // why login still shows on reloading page:
    // app component get token faster than header gets the lasted userIsAuthenticated
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logoutUser();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
