require("dotenv").config();

import { observable, computed, action, runInAction } from "mobx";

import { google, youtube_v3 } from "googleapis";

export enum SearchStatus {
  "None",
  "Pending",
  "Success",
  "Failed",
}

class YoutubeDataStore {
  @observable
  private _searchTerm: string = "";

  @observable
  private _status: SearchStatus = SearchStatus.None;

  @observable.shallow
  private _results: youtube_v3.Schema$SearchResult[] | null = null;

  private youtubeApi: youtube_v3.Youtube;

  @computed
  get searchTerm() {
    return this._searchTerm;
  }

  @computed
  get status() {
    return this._status;
  }

  @computed
  get results() {
    return this._results;
  }
  constructor() {
    this.youtubeApi = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_V3_API,
    });
  }

  @action.bound
  setSearchTerm(term: string) {
    this._searchTerm = term;
    this._status = SearchStatus.None;
  }

  @action.bound
  async search() {
    if (this.searchTerm == "") return;
    try {
      this._status = SearchStatus.Pending;
      const result = await this.youtubeApi.search
        .list({
          part: "id,snippet",
          q: this.searchTerm,
        })
        .then((r) => r.data.items);
      runInAction(() => {
        this._status = SearchStatus.Success;
        if (result) this._results = result;
        else this._results = [];
      });
    } catch (e) {
      runInAction(() => {
        this._status = SearchStatus.Failed;
        this._results = null;
      });
    }
  }
}

export const youtubeDataStore = new YoutubeDataStore();
