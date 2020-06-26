import { AuthService } from './../../auth/auth.service';
import { PostsService } from './../posts.service';
import { Post } from './../post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  pageSizeOptions = [3, 5, 10, 20];
  currentPage = 1;
  isAuthenticated$: Observable<boolean>;
  constructor(
    private postService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsSub = this.postService
      .getPostsUpdated(this.postsPerPage, this.currentPage)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.posts = res.posts;
          this.totalPosts = res.totalCount;
        },
        (error) => {
          this.isLoading = false;
          alert('Database connection is not available!');
          console.error(error);
        }
      );
    this.isAuthenticated$ = this.authService.getAuthStatus();
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postService
      .deletePostById(id)
      .pipe(
        mergeMap(() =>
          this.postService.getPostsUpdated(this.postsPerPage, this.currentPage)
        )
      )
      .subscribe((data) => {
        this.isLoading = false;
        this.posts = data.posts;
        this.totalPosts = data.totalCount;
      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService
      .getPostsUpdated(this.postsPerPage, this.currentPage)
      .subscribe((data) => {
        this.isLoading = false;
        this.posts = data.posts;
        this.totalPosts = data.totalCount;
      });
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
