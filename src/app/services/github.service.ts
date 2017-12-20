import { CacheSearchService } from "./cache-search.service";
import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { GITHUB_URL } from "../constants/urls";
import { GithubResult } from "../types/github";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mapTo";
import "rxjs/Rx";

@Injectable()
export class GithubService {
  appOnline: boolean;
  constructor(private _http: Http, private _chachedSearch: CacheSearchService) {
    Observable.merge(
      Observable.of(navigator.onLine),
      Observable.fromEvent(window, "online").mapTo(true),
      Observable.fromEvent(window, "offline").mapTo(false)
    ).subscribe(res => {
      this.appOnline = res;
    });
  }

  getRepositories(query: string, index: number, favOnly: boolean) {
    if (!this.appOnline || favOnly) {
      return this._chachedSearch.search(query, index, favOnly);
    }
    return this._http.get(GITHUB_URL(query, index)).map(res => {
      const result = res.json() as GithubResult;
      result.items = this._chachedSearch.getReposWithFavStatus(result.items);
      this._chachedSearch.append(result.items);
      return result;
    });
  }
}
