export function sort(array: number[]) {
  if (array.length <= 1) return array;

  for (let sortedSize = 0; sortedSize < array.length; sortedSize++)
    for (let index = 0; index < array.length - sortedSize; index++)
      if (isOutOfOrder(array, index)) swapWithNext(array, index);

  return array;
}

export function betterSort(array: number[]): number[] {
  if (!array.length) return array;
  else {
    let sorted = [];
    let lowest = [];
    let middle = array[0];
    let highest = [];
    for (let i of array.slice(1)) {
      if (i > middle) highest.push(i);
      else lowest.push(i);
    }
    if (lowest.length) sorted.push(...betterSort(lowest));
    sorted.push(middle);
    if (highest.length) sorted.push(...betterSort(highest));

    return sorted;
  }
}

function isOutOfOrder(array: number[], index: number) {
  return array[index] > array[index + 1];
}

function swapWithNext(array: number[], index: number) {
  let temp = array[index];
  array[index] = array[index + 1];
  array[index + 1] = temp;
}
