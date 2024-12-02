const { fetchInputByDay } = require('../utils');

const parseInputFromText = (text) => {
  const arr = text.split('\n').filter((line) => line.trim() !== '').map(line => line.split(' ').map(Number));
  return arr;
};

const isArrIncreasing = (arr) => {
  let increasing = true;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > arr[i + 1]) {
      increasing = false;
      break;
    }
  }
  return increasing;
};

const isReportSafe = (arr) => {
  const diffs = [];
  for (let i = 0; i < arr.length - 1; i++) {
    diffs.push(arr[i + 1] - arr[i]);
  }

  const areDiffsValid = diffs.every(diff => Math.abs(diff) >= 1 && Math.abs(diff) <= 3 && diff !== 0)
  const areDiffsIncreasing = diffs.every((diff) => diff > 0);
  const areDiffsDecreasing = diffs.every((diff) => diff < 0);

  return areDiffsValid && (areDiffsIncreasing || areDiffsDecreasing);
}


const task1 = async() => {
  const input = await fetchInputByDay(2);
  const parsedInput = parseInputFromText(input);
  const safeReports = parsedInput.filter(isReportSafe);

  console.log('2.1', safeReports.length);
};

task1();