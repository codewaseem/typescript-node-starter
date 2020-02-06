import { YoutubeSearchStore, SearchStatus } from "./index";

describe("YoutubeSearchStore", () => {
  let youtubeSearchStore: YoutubeSearchStore;

  beforeEach(() => {
    youtubeSearchStore = new YoutubeSearchStore();
  });

  test("YoutubeSearchStore should exists", () => {
    expect(youtubeSearchStore).toBeTruthy();
  });

  test("should able to get the empty search term by default", () => {
    expect(youtubeSearchStore.getSearchTerm()).toBe("");
  });

  test("should be able to set the search term", () => {
    let term = "javascript";
    youtubeSearchStore.setSearchTerm(term);
    expect(youtubeSearchStore.getSearchTerm()).toBe(term);

    term = "tawheed";
    youtubeSearchStore.setSearchTerm(term);
    expect(youtubeSearchStore.getSearchTerm()).toBe(term);
  });

  test("returns null when called search() without calling setSearchTerm", async () => {
    expect(await youtubeSearchStore.search()).toBeNull();
  });
});

describe("YoutubeSearchStore:search()", () => {
  let youtubeSearchStore: YoutubeSearchStore;
  let searchTerm = "javascript";

  beforeEach(() => {
    youtubeSearchStore = new YoutubeSearchStore();
    youtubeSearchStore.setSearchTerm(searchTerm);
  });

  test("before searching the status should be None", () => {
    expect(youtubeSearchStore.getStatus()).toBe(SearchStatus.None);
  });

  test("after calling search, the status should be pending", () => {
    youtubeSearchStore.search();
    expect(youtubeSearchStore.getStatus()).toBe(SearchStatus.Pending);
  });

  test("once the search is complete the status should be Success or Failed", async () => {
    await youtubeSearchStore.search();

    expect(
      youtubeSearchStore.getStatus() == SearchStatus.Success ||
        youtubeSearchStore.getStatus() == SearchStatus.Failed
    );
  });
});
