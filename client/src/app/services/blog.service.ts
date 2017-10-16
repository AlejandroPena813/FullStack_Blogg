import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {Http, Headers, RequestOptions} from '@angular/http';

@Injectable()
export class BlogService {

  options;//to authenticate user
  domain = this.authService.domain;//bringing in domain

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  createAuthenticationHeaders(){
    this.authService.loadToken();//included authService
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  newBlog(blog){
    this.createAuthenticationHeaders();
    return this.http.post(this.domain +'blogs/newBlog', blog, this.options).map(res => res.json());
  }

  getAllBlogs(){
    this.createAuthenticationHeaders();//create headers
    return this.http.get(this.domain + 'blogs/allBlogs', this.options).map(res => res.json()); //options is for headers, look up
    //now in blog.component, can subscribe to the map()
  }

  getSingleBlog(id){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs/singleBlog/' + id, this.options).map(res => res.json());
  }

  editBlog(blog){
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + 'blogs/updateBlog/', blog, this.options).map(res => res.json());
  }

  deleteBlog(id){
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + 'blogs/deleteBlog/' + id, this.options).map(res => res.json());
  }

  likeBlog(id){
    const blogData = {id: id}; //passing in through body param
    return this.http.put(this.domain + 'blogs/likeBlog/', blogData, this.options).map(res => res.json());
  }

  dislikeBlog(id){
    const blogData = {id: id};//13'
    return this.http.put(this.domain + 'blogs/dislikeBlog/', blogData, this.options).map(res => res.json());
  }

  postComment(id, comment){
    this.createAuthenticationHeaders();
    const blogData = {//created an object
      id: id,
      comment: comment
    }
    return this.http.post(this.domain + 'blogs/comment', blogData, this.options).map(res => res.json() );
  }
}
