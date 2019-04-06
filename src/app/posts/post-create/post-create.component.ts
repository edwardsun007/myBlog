import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { PostService } from "../posts.service";
import { Post } from "../post.model";
import { formArrayNameProvider } from "@angular/forms/src/directives/reactive_directives/form_group_name";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredContent = "";
  enteredTitle = "";
  newPost = "No Content";

  //@Output() postCreated = new EventEmitter<Post>();
  // here we create EventEmitter that is of type Post
  // decorator Output() make this instance of event
  // can be listenable from
  // outside of post-create component

  constructor(public postsService: PostService) {}
  // constructor() {}

  // onAddPost(form: NgForm) {
  //   // this.newPost = this.enteredContent;
  //   if (form.invalid) {
  //     return;
  //   }

  //   this.postsService.addPost(form.value.title, form.value.content);
  // }

  ngOnInit() {}

  // onAddPost() {
  //   console.log('running onAddPost()...');

  //   const post =  {
  //     title: this.enteredTitle,
  //     content: this.enteredContent
  //   };

  //   this.postCreated.emit(post);
  //   // emit with the value / things you want to fire to eventHandler
  // }

  // onChange() {
  //   console.log('new enteredValue=' + this.enteredValue);
  // }

  /* postInput is HTMLElement */
  // onClick(postInput: HTMLTextAreaElement): void {
  //   // console.log(postInput.value);
  //   // use console.dir to see what inside nested object

  //   this.newPost = postInput.value;
  // }
}
