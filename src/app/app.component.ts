import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { AuthService } from './auth/auth.service';
// import { Post } from './posts/post.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {

  }

  /* Because this is the first play when app load for 1st time or page reload, it is ideal to retrieve user auth status here */
  ngOnInit() {
    this.authService.autoAuthUser();
  }

  // example we can use our won defined interface type
  // existingPosts: Post[] = []; // renamed to avoid confusion

  /* event handler demo to catch postCreated event */
  // onPostAdded(post) {
  //   console.log('start app.component.ts->onPostAdded($event)...');
  //   console.log(`post.title=${post.title}`);
  //   console.log(`post.content=${post.content}`);
  //   this.existingPosts.push(post);
  // }
}
