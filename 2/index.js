const { fetchInputByDay } = require("../utils");

const parseInputFromText = (text) => {
  const arr = text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.split(" ").map(Number));
  return arr;
};

const isReportSafe = (arr) => {
  const diffs = [];
  for (let i = 0; i < arr.length - 1; i++) {
    diffs.push(arr[i + 1] - arr[i]);
  }

  const areDiffsValid = diffs.every(
    (diff) => Math.abs(diff) >= 1 && Math.abs(diff) <= 3 && diff !== 0
  );
  const areDiffsIncreasing = diffs.every((diff) => diff > 0);
  const areDiffsDecreasing = diffs.every((diff) => diff < 0);

  return areDiffsValid && (areDiffsIncreasing || areDiffsDecreasing);
};

const tryToMakeReportSafe = (arr) => {
  let foundSafe = false;
  for (let i = 0; i < arr.length; i++) {
    const updatedArr = arr.slice(0, i).concat(arr.slice(i + 1));

    if (isReportSafe(updatedArr)) {
      foundSafe = true;
      break;
    }
  }
  return foundSafe;
};

const task1 = async () => {
  const input = await fetchInputByDay(2);
  const parsedInput = parseInputFromText(input);
  const safeReports = parsedInput.filter(isReportSafe);
  const unSafeReports = parsedInput.filter((report) => !isReportSafe(report));

  console.log("2.1", safeReports.length);
  return { safeReports, unSafeReports };
};

const task2 = async () => {
  const { safeReports, unSafeReports } = await task1();
  const newSafeReports = unSafeReports.filter(tryToMakeReportSafe);
  console.log("2.2", safeReports.length + newSafeReports.length);
};

task2();
