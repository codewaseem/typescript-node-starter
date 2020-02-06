require("dotenv").config();

import { observable, computed, action, runInAction } from "mobx";

import { google, youtube_v3 } from "googleapis";

export enum SearchStatus {
  "None",
  "Pending",
  "Success",
  "Failed",
}

export class YoutubeSearchStore {
  @observable
  private searchTerm: string = "";

  @observable
  private status: SearchStatus = SearchStatus.None;
  private API_KEY: string = "";
  youtubeApi: youtube_v3.Youtube;

  constructor() {
    this.youtubeApi = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_V3_API,
    });
  }

  getSearchTerm() {
    return this.searchTerm;
  }

  @action.bound
  setSearchTerm(term: string) {
    this.searchTerm = term;
  }

  @action.bound
  async search() {
    if (this.searchTerm == "") return null;
    try {
      this.status = SearchStatus.Pending;
      let result = await this.youtubeApi.search.list({
        part: "id,snippet",
        q: this.searchTerm,
      });
      runInAction(() => {
        this.status = SearchStatus.Success;
      });
    } catch (e) {
      runInAction(() => {
        this.status = SearchStatus.Pending;
      });
    }
  }

  getStatus() {
    return this.status;
  }
}
