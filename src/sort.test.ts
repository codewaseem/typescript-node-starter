import { sort, betterSort } from "./sort";

function assertArrayMatch(expected: any[], received: any[]) {
  expect(expected).toMatchObject(received);
}

describe("sort", () => {
  test("given empty array returns empty array", () => {
    assertArrayMatch(sort([]), []);
  });

  test("given array with one element should return the same array", () => {
    assertArrayMatch(sort([1]), [1]);
  });

  test("given two unsorted ints, should return sorted ints", () => {
    assertArrayMatch(sort([2, 1]), [1, 2]);
  });

  test("given 3 unsorted ints, returns sorted", () => {
    assertArrayMatch(sort([1, 3, 2]), [1, 2, 3]);
    assertArrayMatch(sort([3, 2, 1]), [1, 2, 3]);
    assertArrayMatch(sort([3, 1, 1]), [1, 1, 3]);
  });

  test("correctly sorts random ints of list", () => {
    assertArrayMatch(sort([4, 2, 1, 5]), [1, 2, 4, 5]);
    assertArrayMatch(sort([4, 2, 1, 5, 2, 2, 2, 3, 3, 3]), [
      1,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      4,
      5,
    ]);
  });

  test("correctly sorts fully reverse list", () => {
    let unsorted = [];
    let sorted = [];
    const size = 100;

    for (let i = 0; i < size; i++) {
      sorted[i] = i;
      unsorted[i] = size - i - 1;
    }

    assertArrayMatch(sort(unsorted), sorted);
  });
});

/*
Code Transformation Priority List

1. Nothing -> Null
2. Null -> Constant
3. Constant -> Variable
4. Add Computation
5. Split Flow (only two paths)
6. Variable -> Array
7. Array -> Container
8. If -> While
9. Recurse
10. Iterate
11. Assign
12. Add Case

*/

describe("bettorSort with Transform Priority Premise TDD", () => {
  test("given an empty array returns empty array", () => {
    assertArrayMatch(betterSort([]), []);
  });

  test("given an array with one item, returns the same array", () => {
    assertArrayMatch(betterSort([1]), [1]);
    assertArrayMatch(betterSort([756]), [756]);
  });

  test("given 2 element array, return sorted", () => {
    assertArrayMatch(betterSort([2, 1]), [1, 2]);
  });

  test("given 3 elements, return sorted", () => {
    assertArrayMatch(betterSort([2, 1, 3]), [1, 2, 3]);
    assertArrayMatch(betterSort([2, 3, 1]), [1, 2, 3]);
    assertArrayMatch(betterSort([3, 2, 1]), [1, 2, 3]);
    assertArrayMatch(betterSort([1, 3, 2]), [1, 2, 3]);
  });

  test("given 4 elements, i.e two mid elements", () => {
    assertArrayMatch(betterSort([3, 2, 2, 1]), [1, 2, 2, 3]);
  });
  test("correctly sorts random ints of list", () => {
    assertArrayMatch(betterSort([4, 2, 1, 5]), [1, 2, 4, 5]);
    assertArrayMatch(betterSort([4, 2, 1, 5, 2, 2, 2, 3, 3, 3]), [
      1,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      4,
      5,
    ]);
  });

  test("correctly sorts fully reverse list", () => {
    let unsorted = [];
    let sorted = [];
    const size = 100;

    for (let i = 0; i < size; i++) {
      sorted[i] = i;
      unsorted[i] = size - i - 1;
    }

    assertArrayMatch(betterSort(unsorted), sorted);
  });

  test("sorting already sorted array, should return sorted array", () => {
    let array = [1, 2, 2, 3];
    assertArrayMatch(betterSort(array), [1, 2, 2, 3]);
  });
});
