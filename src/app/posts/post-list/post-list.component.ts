import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../posts.service';
import { AuthService } from '../../auth/auth.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = []; // local variable not the one in service.ts
  isLoading = false;
  userIsAuthenticated = false; // init as not authenticated
  userId: string;
  totalPosts: Number = 0;
  postsPerPage = 2;
  currentPage = 1; // default start page 1
  pageSizeOptions = [1, 2, 3, 5, 7, 10];
  private postsSub: Subscription; // for unsubscribe feature
  private authStatusSub: Subscription; // listen for authenticate status
  // @Input() posts: Post[] = []; // our root app has posts[] there,
  // we want to pass it DOWN into post-list component to iterate
  // so here we use input() decorator to take it in
  // App is parent component for both post-create and post-list

  // [public _service] is exactly same as two lines below :
  // postSrv: PostsService
  // inside constructor: this.postSrv = postSrv
  constructor(public _service: PostService, public _router: Router, private authService: AuthService) {
  } // dependency injection

  ngOnInit() {
    console.log('start post-list.component.ts->ngOnInit()');
    this.isLoading = true; // let it spin
    this._service.getPosts(this.postsPerPage, this.currentPage); // show 2 post per page and start on page 1 on init
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      this._router.navigate(['/login']); // if no userId, then redirect to login
    }
    this.postsSub = this._service.getPostUpdateListener()
      .subscribe( (postData: { posts: Post[], maxPost: Number}) => {
        // subscribe to the observerable created in service.ts, forgot what property it has? check posts.service.ts
        console.log('inside _service.getPostUpdateListener.subscribe()');
        this.isLoading = false; // stop spin
        this.posts = postData.posts;
        this.totalPosts = postData.maxPost;
        console.log('this.totalPosts=', this.totalPosts);
      });
    /* vid 27 why click save post doesn't show new post?
    because when post-list first created, you call getPost() which get empty array
    later when you click save post to add new post object into posts array, list doesn't update itself
    */

  /* the following couple of lines take care of re-loading lost logged in status
  whenever this component reload, retrieve authentication status by calling AuthStatus()
  get authStatus from the Subject in authService
  */
   this.userIsAuthenticated = this.authService.getAuthStatus();
   console.log('this.userIsAuthenticated=', this.userIsAuthenticated);
   this.authStatusSub = this.authService.getAuthStatusListener() // get authStatus
    .subscribe(isAuthenticated => {
      console.log('in post-list ngOninit->this.authStatusSub isAuthenticated...');
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  /* user click pagination logic */
  onChangePage(pageData: PageEvent) {
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1; // pageEvent is 0 indexed, add 1 start from 1
    this.postsPerPage = pageData.pageSize; // user setting of item per page
    this._service.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(id: string) {
    this.isLoading = true;
    // tslint:disable-next-line:prefer-const
    let obs = this._service.deletePost(id);
    obs.subscribe(() => {
      this._service.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  goHome() {
    this._router.navigate(['']);
  }

  /* unsubscribe observable when component is destroyed
  otherwise, it will be always listening for changes cause memory leak
  */
  ngOnDestroy() {
    console.log('calling unsubscribe()...');
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
