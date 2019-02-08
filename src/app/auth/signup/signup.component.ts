import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit , OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  errors: any[];

  constructor(private _auth: AuthService ) { }

  ngOnInit() {
    this.authStatusSub = this._auth.getAuthStatusListener().subscribe(
      authStatus => {
        console.log('inside SignUp->ngOnInit.');
        this.isLoading = false;
      }
    );
  }

  onSignUp(form: NgForm) {
    this.isLoading = true;
    this._auth.createUser( form.value.firstname, form.value.lastname, form.value.email, form.value.password );

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
