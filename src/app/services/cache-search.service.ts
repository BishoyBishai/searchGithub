import { GithubResultItem } from "./../types/github";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { GithubResultItem } from "../types/github";
import * as _ from "lodash";
import { environment } from "../../environments/environment";

@Injectable()
export class CacheSearchService {
  cachedSearchResult;
  cachedFavRepos;

  constructor() {
    const localDataResult = localStorage.getItem("local-search-result");
    const localFavRepos = localStorage.getItem("local-fav-repos");
    this.cachedSearchResult =
      (localDataResult && JSON.parse(localDataResult)) || [];
    this.cachedFavRepos = (localDataResult && JSON.parse(localFavRepos)) || [];
  }
  append(newList: GithubResultItem[]) {
    this.cachedSearchResult = _.unionBy(newList, this.cachedSearchResult, "id");
    localStorage.setItem(
      "local-search-result",
      JSON.stringify(this.cachedSearchResult)
    );
  }
  search(query: string, index: number, searchForFav?: boolean) {
    const result: GithubResultItem[] = _.filter(
      this.cachedSearchResult,
      function(i: GithubResultItem) {
        if (searchForFav && !i.isFav) {
          return false;
        }
        return (
          (i.name as string).toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
      }
    );

    const items = result.slice(
      (index - 1) * environment.resultPerPage,
      index * environment.resultPerPage
    );
    return Observable.of({
      total_count: result.length,
      incomplete_results: false,
      items
    });
  }

  toggleFlagRepoAsFav(repo: GithubResultItem) {
    const newRepo = { ...repo, isFav: !repo.isFav };
    const indexFav = this.cachedFavRepos.indexOf(repo.id);
    if (indexFav === -1) {
      this.cachedFavRepos = [].concat(this.cachedFavRepos, repo.id);
    } else {
      this.cachedFavRepos = [].concat(
        this.cachedFavRepos.slice(0, indexFav),
        this.cachedFavRepos.slice(indexFav + 1)
      );
    }
    localStorage.setItem(
      "local-fav-repos",
      JSON.stringify(this.cachedFavRepos)
    );
    this.append([newRepo]);
    return newRepo;
  }

  getReposWithFavStatus(items: GithubResultItem[]) {
    return items.map(item => {
      if (this.cachedFavRepos.indexOf(item.id) !== -1) {
        return { ...item, isFav: true };
      }
      return item;
    });
  }
}
