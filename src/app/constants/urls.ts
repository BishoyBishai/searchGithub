import { environment } from "./../../environments/environment";

export const GITHUB_URL = (query: string, index: number) =>
  `https://api.github.com/search/repositories?q=${query}&page=${index}&&per_page=${
    environment.resultPerPage
  }`;
