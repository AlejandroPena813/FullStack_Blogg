import { Component, OnInit } from '@angular/core';
import {Location } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';//grab id from URL, for update single blog
import {BlogService} from '../../../services/blog.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message;
  messageClass;
  blog; /* = {   //not required since we set this equal to blog object onInit()
    title: String,
    body: String
  };*/

  processing = false;
  currentUrl;
  loading = true;//for when id is incorrect

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute, //grab id from url
    private blogService: BlogService,
    private router: Router
  ) { }

  updateBlogSubmit(){
    this.processing = true;
    this.blogService.editBlog(this.blog).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else{
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/blog']);//go back after updatings
        }, 2000);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;//grabbing URL
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => { //grabbing id from url
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else{
        this.blog = data.blog; //data.blog defined in service, this.blog defined here
        this.loading = false;
      }
    });
  }

}
