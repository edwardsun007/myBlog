import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';

  @Output() postCreated = new EventEmitter<Post>();
  // here we create EventEmitter that is of type Post
  // decorator Output() make this instance of event
  // can be listenable from
  // outside of post-create component
  constructor() {
  }

  ngOnInit() {
  }

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
