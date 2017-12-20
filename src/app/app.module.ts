import { GithubService } from "./services/github.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { InfiniteScrollModule } from "angular2-infinite-scroll";

import { AppComponent } from "./app.component";
import { GithubSearchComponent } from "./components/github-search/github-search.component";
import { CacheSearchService } from "./services/cache-search.service";

@NgModule({
  declarations: [AppComponent, GithubSearchComponent],
  imports: [BrowserModule, HttpModule, InfiniteScrollModule],
  providers: [GithubService, CacheSearchService],
  bootstrap: [AppComponent]
})
export class AppModule {}
