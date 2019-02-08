import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator'; // our own validator

@Component({
  selector: 'app-post-create-form',
  templateUrl: './post-create-form.component.html',
  styleUrls: ['./post-create-form.component.css']
})

export class PostCreateFormComponent implements OnInit {

    enteredContent = '';
    enteredTitle = '';
    post: Post; // create post broke because it starts with undefined
    isLoading = false;
    form: FormGroup; // for reactive approach, we declare FormGroup instance at the top
    // and we access to the very same instance to get and update data
    imagePreview: string;
    private mode = 'Create'; // set our switch to tell if its create or edit mode
    private postId: string;
    // = { id: '', title: '', content: ''}
    // for store retrieve post found by id, need to be public so that form can access it
    // @Output() postCreated = new EventEmitter<Post>();
    // the above line-- we create EventEmitter that is of type Post
    // decorator Output() make this instance of event
    // can be listenable from
    // outside of post-create component
    // injected ActivatedRoute, which contain info about which route we are on
    constructor(
      public postSrv: PostService,
      public route: ActivatedRoute,
      public router: Router) {
      console.log('start post-create-form.component.ts->constructor()...');
      // this.post = {
      //   id: null,
      //   title: '',
      //   content: '',
      //   imagePath: null
      // };
    }

    ngOnInit() {
      this.form = new FormGroup({
        title: new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]
        }),
        content: new FormControl(null, {validators: [Validators.required]}),
        image: new FormControl(null,
          {
            validators: [Validators.required],
            asyncValidators: [mimeType]
          }) // ourValidator is async
      });
      // formgroup is top level object, by calling the constructuor above, we can pass key:value pair
      // and define our controls

      // paramMap is observable, we can listen to it. Now if route changed ( we switch to edit instead of create route)
      // paraMap will contain our postId if its edit route
      this.route.paramMap.subscribe(
        (paramMap: ParamMap) => {
           if (paramMap.has('postId')) {
             console.log('create-form got postId:', paramMap.get('postId'));
             this.mode = 'Edit';
             this.postId = paramMap.get('postId'); // update our local member
             const obs = this.postSrv.getPost(this.postId); // backend return observable now
             obs.subscribe( postData => {
                 this.isLoading = false;  // once we get data from Mongo, set to false stop the spinner
                 this.post = {
                   id: postData._id,
                   title: postData.title,
                   content: postData.content,
                   imagePath: postData.imagePath,
                   creator: postData.creator
                  };
                  // console.log('this.post.imagePath=', this.post.imagePath);
                  // after we fetched data from database, set it to our form
                  this.form.setValue({
                    title: this.post.title, // title is same as key used to create FormControl above
                    content: this.post.content, // content same as key used to create FormControl above
                    image: this.post.imagePath
                  });
               });
             // console.log('front end found post.title=', this.post.title);
           } else {
             this.mode = 'Create';
             this.postId = null;
           }
        }
      );
    }

    onImagePicked(event: Event) {
     // extract the file user uploaded
     const file = (event.target as HTMLInputElement).files[0]; // convert event.target to HTMLInputElement type
     // files is array, 0 index is the one user selected
     this.form.patchValue({image: file}); // allow you to target a single value vs setValue() will apply to multiple formControl
     this.form.get('image').updateValueAndValidity(); // gain access to control with name 'image'
     // tell angular the value changed and it should
     // check and store the new value and validate it
     const reader = new FileReader();
     reader.onload = () => {  // async code , we use callback function onload
       console.log('start reader.onload');
       this.imagePreview = reader.result as string;
     };
     reader.readAsDataURL(file);
     console.log('reader = ', reader);
    }

    // reactive approach function, we use the same formGroup instance now
    onSavePost() {
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      if (this.mode === 'Create') {
        this.postSrv.addPost(
          this.form.value.title,
          this.form.value.content,
          this.form.value.image);
      } else {
        this.postSrv.updatePost(
          this.postId,
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        );
      }
      this.form.reset();
    }

    /* note that we are passing ngForm type on the HTML to this method! */
    // onSavePost(formObject: NgForm) {
    //   console.log('start post-create-form.component.ts->onSavePost()...');
    //   if (formObject.invalid) {
    //     return;
    //   }
    //   this.isLoading = true; // when user click save, spinner will be true
    //   if (this.mode === 'Create') {
    //     this.postSrv.addPost(formObject.value.title, formObject.value.content);
    //   } else {
    //     this.postSrv.updatePost(
    //       this.postId,
    //       formObject.value.title,
    //       formObject.value.content);
    //   }
    //   // this.postCreated.emit(post);
    //   // emit with the value / things you want to fire to eventHandler
    //   formObject.resetForm(); // clear form input fields after submit
    // }
}
