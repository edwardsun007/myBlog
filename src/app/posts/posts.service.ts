import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // NEED inject it to send http request
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})  // this let angular find this service and use one instance across the entire app very important!
export class PostService {
  private posts: Post[] = []; // private prevent access to posts from outside
  private postUpdated = new Subject<{posts: Post[], maxPost: number}>();
  // Subject instance named postUpdated,  Subject is defined as javascript object
  // properties- posts[], maxPosts
  constructor(private _http: HttpClient, private router: Router ) {
  }

  // always centralize HTTP requests in your service file
  // with Pagination this function has to accept arguments now
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    console.log('start posts.service.ts-> getPosts()!!!');
    this._http
      .get<{ message: string, data: any, maxPosts: number }>( // Where this data from ? think
        // we are getting json response remember, {message: String, posts: Post[]} which is defined in our backend server.js
        'http://localhost:3000/api/posts' + queryParams // hardcoded URL point to path defined in server.js
      )
      .pipe(map((postData) => {
          console.log('getPosts->maxPosts=', postData.maxPosts);
          return {
            posts: postData.data.map( post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              }; // remember this is from MongoDB, and it is _id in MongoDB
            }),  // map here is javascript native map()
            maxPosts: postData.maxPosts
          };
      })) // pipe allow use to add multiple operator BEFORE Let Angular listen to new data
      .subscribe(transformedPostData => { // transformedPosts will be array already
        console.log('checking transformedPostData:');
        console.log(transformedPostData);
        // register with subscribe so that you can listen to the API path above
        // if ( postData.posts !== undefined ) {
          this.posts = transformedPostData.posts; // get posts property
          this.postUpdated.next({posts: [...this.posts], maxPost: transformedPostData.maxPosts });
        // }
      });

    // return [...this.posts];   is spread operator in javascript, it can pull properties out of object
    // if we do return this.posts,
    // it will simply return the address to the posts object
    // standard way: using spread in javascript to pull them out of original posts
    // then use [] to make a copy and return as new array
  }

  /* What is the difference between API call from server and a search in frontend? Think */
  /* frontend search directly return you the object, but http call return observerable not the object */
  getPost(id: string) {
    console.log('start posts.service->getPost()');
    return this._http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>
    (`http://localhost:3000/api/posts/${id}`);
    // return the observable, from backend, so its _id
  }

  // frontend search
  // getPostById(id: string) {
  //   return {...this.posts.find(p => p.id === id)};
  //   // instead of doing backend API call to retrieve by id, we do FrontEnd find here
  //   // here we use javascript find to match object id, and simply return the first matching one
  //   // common practice is return new object using spread, spread operator is used to pull properties out of old object and create new one
  // }

  getPostUpdateListener() {
    console.log('start posts.service->getPostUpdateListener()');
    return this.postUpdated.asObservable();
    // creates new observerable with Subject called postUpdated as the source
  }

  addPost(title: string, content: string, image: File) {
    console.log('start posts.service.ts->addPost()');
    console.log('image=', image);
    const postData = new FormData(); // javascript object allow us to combine form value and blob
    postData.append( 'title', title ); // we append form fields to formdata
    postData.append( 'content', content );
    postData.append( 'image', image, title );
    console.log('after appending,postData=', postData);
    // // tslint:disable-next-line:no-shadowed-variable
    // const post: Post = { id: null, title: title, content: content};
    /* still define the type you post, give URL, the return post body */
    /* dojo way is separate the subscribe part into component that calls service,
    service only has HTTP verb in it like put, get, delete, put */
    this._http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData).subscribe(
      (res) => {
        // if (res.message === 'Post added') {   // only update if its successful API call
        //      const post: Post = {
        //        id: res.post.id,
        //        title: title,     // either get it from the form via argument
        //        content: content,  // or get them
        //        imagePath: res.post.imagePath
        //     };
        //     //  const id = res.postId;           // saved post will feed back json with its id now, pull it
        //     //  post.id = id;
        //      this.posts.push(post);
        //      console.log('check post added from res:', post);
        //      this.postUpdated.next({posts: [...this.posts], maxPost: transformedPostData.maxPosts });
             // emit the COPY of updated posts thru Subject to all observers
             this.router.navigate(['']); // once we done with update posts, we navigate to home
             // now here is thing: after we add new post, we navigate back to home
             // therefore post-list component will start and call nginit anyway, which listens for subject
             // so we really don't need to update our subject here, commented out the above code before navigate
      }
    );
  }

  updatePost(id: string, title: string, content: string, image: File | string) { //
    console.log('start posts.service->updatePost()');
    let postData; // either Post Type or FormData Type
    // since we use create form for both add post and update post, the image we upload could be two type:
    // if use image picker to pick an image, image will be arrayBuffer -- object type
    // if we click edit, it calls getPost from backend, imagePath will be string, it is string type
    if (typeof(image) === 'object') {  // image is from filePicker, its File type / object
      postData = new FormData(); // javascript object allow us to combine form and blog
      postData.append('id', id); // error 'immutable field _id' happens because we are not passing the the same Id
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else { // existing image is string, we simply pass it via json
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image, // string
        creator: null  // when you update existing post, you dont want to update userId,
        // I don't want let user manipulate through input either, that is vulnerable to hack
      };
    }
    this._http.put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe(res => {
        // console.log(res);
        // const updatedPosts = [...this.posts]; // this is new post arrays after update
        // console.log('This is new posts array after update:', updatedPosts);
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === postData.id);  // frontend search with old post's id they are same
        // console.log('This is index of that oldPost', oldPostIndex);

        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: '' // res.imagePath // API call put request, we get this from json
        // };
        // updatedPosts[oldPostIndex] = postData; // replace that index pos with the new post
        // console.log('after replace, now updatedPosts[oldPostIndex]=', updatedPosts[oldPostIndex]);
        // this.posts = updatedPosts;
        // this.postUpdated.next([...this.posts]); // tell app things changed and fire the new posts via Subject
        this.router.navigate(['']); // once we done with edit posts, we navigate to home
      });
  }


  deletePost(id: string) {
    console.log('start posts.service->deletePost()');
    return this._http.delete(`http://localhost:3000/api/posts/${id}`); // delete from backend
  }
}
