import { CacheSearchService } from "./../../services/cache-search.service";
import { environment } from "./../../../environments/environment";
import { GithubService } from "./../../services/github.service";
import { Component } from "@angular/core";
import { GithubResultItem } from "../../types/github";
import * as _ from "lodash";

@Component({
  selector: "app-github-search",
  templateUrl: "./github-search.component.html",
  styleUrls: ["./github-search.component.css"]
})
export class GithubSearchComponent {
  appOnline: boolean;
  constructor(
    private _githubService: GithubService,
    private _chacheSearch: CacheSearchService
  ) {}
  pageIndex = 1;
  searchBy: string = null;
  totalCount = 0;
  viewCount = 0;
  isEndOfTheSearch = false;
  isSearchForFavOnly = false;
  searchResult: GithubResultItem[] = [];

  onSearch(val: string) {
    this.pageIndex = 1;
    this.viewCount = 0;
    this.totalCount = 0;
    this.searchBy = val.trim();
    this.searchResult = [];
    this.isEndOfTheSearch = false;
    this.doSearch();
  }

  doSearch() {
    if (this.isEndOfTheSearch || !this.searchBy) {
      return;
    }
    this._githubService
      .getRepositories(this.searchBy, this.pageIndex, this.isSearchForFavOnly)
      .subscribe(
        results => {
          this.searchResult = _.concat(this.searchResult, results.items);
          this.totalCount = results.total_count;
          this.viewCount = this.pageIndex * environment.resultPerPage;
          if (this.totalCount < this.viewCount) {
            this.viewCount = this.totalCount;
            this.isEndOfTheSearch = true;
          }
        },
        err => {
          console.log(err);
        }
      );
  }
  changeSearchCriteria(criteria) {
    this.isSearchForFavOnly = criteria;
    this.onSearch(this.searchBy);
  }
  onScroll() {
    this.pageIndex += 1;
    this.doSearch();
  }
  toggleFlagRepoAsFav(repo: GithubResultItem) {
    const newRepo = this._chacheSearch.toggleFlagRepoAsFav(repo);
    const index = _.findIndex(this.searchResult, { id: repo.id });
    this.searchResult.splice(index, 1, newRepo);
  }
}
