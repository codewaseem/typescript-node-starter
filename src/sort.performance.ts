import { sort, betterSort } from "./sort";

function getRandomArray(size: number): number[] {
  let array = [];
  for (let i = 0; i < size; i++) {
    array[i] = Number.parseInt(Math.random() * 10000 + "");
  }
  return array;
}

function measurePerformance(sortFunc: Function, size: number) {
  console.log(`${sortFunc.name} with ${size} elements`);
  const st = Date.now();
  sortFunc(getRandomArray(size));
  const et = Date.now();
  console.log(et - st, "ms");
}

// measurePerformance(sort, 10000);
// measurePerformance(sort, 25000);
// measurePerformance(sort, 50000);

measurePerformance(betterSort, 10000);
measurePerformance(betterSort, 25000);
measurePerformance(betterSort, 50000);
measurePerformance(betterSort, 100000);

// make sure to increase call stack to higher value
// node --stack-size=1500000 -r ts-node/register ./src/sort.performance.ts
measurePerformance(betterSort, 150000);
measurePerformance(betterSort, 200000);
measurePerformance(betterSort, 1000000);
