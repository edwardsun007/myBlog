import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { PostCreateFormComponent } from './posts/post-create-form/post-create-form.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'create', component: PostCreateFormComponent, canActivate: [AuthGuard] },  // localhost:3000/create
  { path: 'edit/:postId', component: PostCreateFormComponent, canActivate: [AuthGuard]},
  // use same component to handle create and update here
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // add configuration with routes above
  exports: [RouterModule], // export so that other Angular Compo can use
  providers: [ AuthGuard ]  // since AuthGuard is for protecting routes, best place for it is here as provider
})
export class AppRoutingModule {}
