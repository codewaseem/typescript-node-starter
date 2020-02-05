require("dotenv").config();

import { observable, computed, action, runInAction } from "mobx";

import { google } from "googleapis";

console.log("API", process.env.YOUTUBE_V3_API);

let youtubeApi = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_V3_API,
});

async function searchVideos(searchTerm: string) {
  let result = await youtubeApi.search
    .list({
      part: "id,snippet",
      q: searchTerm,
    })
    .then((r) => r.data);
  console.log(result);
}

enum SearchState {
  "Empty",
  "Pending",
  "Completed",
  "Failed",
}

class BookSearchStore {
  @observable
  private term: string = "";

  @observable
  private status: SearchState = SearchState.Empty;

  @observable.shallow
  private results: any;

  @action.bound
  setTerm(term: string) {
    this.term = term;
  }

  @computed
  get totalCount() {
    return this.results.length;
  }

  @action.bound
  async search() {
    try {
      this.status = SearchState.Pending;
      const result = await searchVideos(this.term);
      runInAction(() => {
        this.results = result;
        this.status = SearchState.Completed;
      });
    } catch (e) {
      console.log("Error", e);
      runInAction(() => (this.status = SearchState.Failed));
    }
  }
}

export const bookSearchStore = new BookSearchStore();

bookSearchStore.setTerm("javascript");
bookSearchStore.search();
