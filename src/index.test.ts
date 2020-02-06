import { youtubeDataStore, SearchStatus } from "./index";
import { observe } from "mobx";

describe("youtubeDataStore", () => {
  test("should exists", () => {
    expect(youtubeDataStore).toBeTruthy();
  });

  test("has correct default values", () => {
    expect(youtubeDataStore.searchTerm).toBe("");
    expect(youtubeDataStore.status).toBe(SearchStatus.None);
    expect(youtubeDataStore.results).toBeNull();
  });

  test("should be able to set the search term", () => {
    let term = "javascript";
    youtubeDataStore.setSearchTerm(term);
    expect(youtubeDataStore.searchTerm).toBe(term);

    term = "tawheed";
    youtubeDataStore.setSearchTerm(term);
    expect(youtubeDataStore.searchTerm).toBe(term);
  });

  test("can observe changes to searchTerm", () => {
    let termChanged = false;
    observe(youtubeDataStore, () => {
      termChanged = true;
    });
    youtubeDataStore.setSearchTerm("term");

    expect(termChanged).toBeTruthy();
    expect(youtubeDataStore.searchTerm).toBe("term");
  });

  test("has correct status in search flow", () => {
    expect(youtubeDataStore.status).toBe(SearchStatus.None);
    youtubeDataStore.search().then(() => {
      let afterSearchState =
        youtubeDataStore.status == SearchStatus.Success ||
        youtubeDataStore.status == SearchStatus.Failed;
      expect(afterSearchState).toBeTruthy();
    });
    expect(youtubeDataStore.status).toBe(SearchStatus.Pending);
  });

  test("when search is success, the result should have atleast one item else none", async () => {
    youtubeDataStore.setSearchTerm("javascript");
    await youtubeDataStore.search();

    if (youtubeDataStore.status == SearchStatus.Success) {
      console.log(youtubeDataStore.results);
      expect(
        youtubeDataStore.results && youtubeDataStore.results.length
      ).toBeGreaterThan(0);
    } else {
      expect(youtubeDataStore.results).toBeNull();
    }
  });
});
