import { Post } from './posts/post.model';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  posts: Post[] = [];

  onPostAdded(post: Post) {
    console.log('Event Post', post);
    this.posts.push(post);
  }
}
