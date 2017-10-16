import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';//for createdBy
import {BlogService} from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;//css style class
  message;// error/validation messages
  newPost = false;//for post button
  loadingBlogs=false;//for load button
  form;
  processing = false;//disable back button if form is being processed
  username;//gets createdBy
  blogPosts; //to get all blogs

  newComment = [];
  commentForm;
  enabledComments = [];


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService//bringing in blog service
  ) { 
    this.createNewBlogForm();
    this.createCommentForm();
  }

  createNewBlogForm(){
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([ //for title
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([//for body
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    })
  }

  enableFormNewBlogForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableFormNewBlogForm(){
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return {'alphaNumericValidation': true}
    }    
  }

  createCommentForm(){//called in constructor
    this.commentForm = this.formBuilder.group({
      comment:['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    })
  }

  enableCommentForm(){
    this.commentForm.get('comment').enable();
  }

  disableCommentForm(){
    this.commentForm.get('comment').disable();
  }

  newBlogForm(){
    this.newPost = true;
  }

  reloadBlogs(){
    this.loadingBlogs = true;
    this.getAllBlogs();
    //Get All Blogs
    setTimeout(() => {
      this.loadingBlogs = false;//this happens after the 4 seconds
    }, 4000);
  }

  draftComment(id){
    this.commentForm.reset();
    this.newComment = [];//before adding comment, clear previous comment
    this.newComment.push(id);//clear id once pushed in postComm
  }

  cancelSubmission(id){
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
  }

  onBlogSubmit(){
    this.processing = true;
    this.disableFormNewBlogForm();

    const blog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username//48:59
    }

    this.blogService.newBlog(blog).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;//message from api
        this.processing = false;
        this.enableFormNewBlogForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllBlogs();//get all blogs defined below
        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableFormNewBlogForm();
        }, 2000);//timeout
      }
    });

  }

  goBack() {//this is a typescript function
    window.location.reload();//goes to previous page since its technically one page, with the views changing with button
  }

  getAllBlogs(){
    this.blogService.getAllBlogs().subscribe(data => {
      //blogPosts var, created above, gets assigned blogs to give to HTML
      this.blogPosts = data.blogs;//blogs var must match name of obj in express api
    });                 //blogsArr okay
  }

  likeBlog(id){
    this.blogService.likeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }

  dislikeBlog(id){ //14'
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs();
    });
  }

  expand(id){//show comments of blog
    this.enabledComments.push(id);
  }

  collapse(id){
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

  postComment(id){
    this.disableCommentForm();
    this.processing = true;
    //take comment and save into value
    const comment = this.commentForm.get('comment').value;
    this.blogService.postComment(id, comment).subscribe(data => {
      this.getAllBlogs();//get all blogs and inject new comments
      const index = this.newComment.indexOf(id);//get index to remove from array
      this.newComment.splice(index, 1);
      this.enableCommentForm();
      this.commentForm.reset();
      this.processing = false;
      //display comments, if user hasnt already expanded to display them
      if(this.enabledComments.indexOf(id) < 0){
        this.expand(id);//25'
      }
    })
  }

  ngOnInit() {
    //getting user name for createdBy
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;//onInit allows to get usr before the f(x) is used
    });

    this.getAllBlogs();
  }

}
