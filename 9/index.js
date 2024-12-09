const { fetchInputByDay } = require("../utils");
const {
  arrayToLinkedList,
  linkedListToArray,
} = require("./linked-list.helper");

const findFirstDot = (head) => {
  let current = head;
  while (current) {
    if (current.data === ".") return current;
    current = current.next;
  }
  return null;
}

const findLastNumber = (head) => {
  if (!head) return { lastNode: null, beforeLast: null };

  let lastNode = null;
  let beforeLast = null;
  let current = head;
  let prev = null;

  while (current) {
    if (typeof current.data === "number") {
      lastNode = current;
      beforeLast = prev;
    }
    prev = current;
    current = current.next;
  }
  return { lastNode, beforeLast };
};

const removeKnownNode = (head, lastNode, beforeLast) => {
  if (!lastNode) return head;
  if (!beforeLast) {
    return head.next;
  } else {
    beforeLast.next = lastNode.next;
    return head;
  }
};

const replaceDotsWithNumbersTask1 = (head) => {
  while (true) {
    const dotNode = findFirstDot(head);
    if (!dotNode) break;

    const { lastNode, beforeLast } = findLastNumber(head);
    if (!lastNode) break;

    dotNode.data = lastNode.data;

    head = removeKnownNode(head, lastNode, beforeLast);
  }
  return head;
};

const getFinalResult = (arr) =>
  arr.reduce((acc, curr, currI) => isNumber(curr) ? acc + curr * currI : acc, 0);

const task1 = async () => {
  const input = await fetchInputByDay(9);
  const parsedInput = input.trim().split("").map(Number);
  const freeSpace = parsedInput.filter((_, i) => i % 2 === 1);
  const files = parsedInput.filter((_, i) => i % 2 === 0);
  const mapResult = [];
  files.filter((file, i) => {
    for (let f = 0; f < file; f++) {
      mapResult.push(i);
    }
    for (let s = 0; s < freeSpace[i]; s++) {
      mapResult.push(".");
    }
  });
  const linkedList = arrayToLinkedList(mapResult);
  const fulfilledArray = linkedListToArray(replaceDotsWithNumbersTask1(linkedList));
  const result = getFinalResult(fulfilledArray);

  console.log("9.1:", result);
};


const getDotRuns = (head) => {
  const arr = linkedListToArray(head);
  const runs = [];
  let runStart = -1;
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === '.') {
      if (runStart === -1) runStart = i;
    } else {
      if (runStart !== -1) {
        runs.push({ start: runStart, length: i - runStart });
        runStart = -1;
      }
    }
    i++;
  }
  if (runStart !== -1) {
    runs.push({ start: runStart, length: i - runStart });
  }
  return runs;
};

const isNumber = (val) => typeof val === "number";

const getNumberRuns = (head) => {
  const arr = linkedListToArray(head);
  const runs = [];
  let runStart = -1;
  let runVal = null;
  let i = 0;
  while (i < arr.length) {
    let val = arr[i];
    if (isNumber(val)) {
      if (runVal === null) {
        runVal = val;
        runStart = i;
      } else {
        if (val !== runVal) {
          runs.push({ value: runVal, start: runStart, length: i - runStart });
          runVal = val;
          runStart = i;
        }
      }
    } else {
      if (runVal !== null) {
        runs.push({ value: runVal, start: runStart, length: i - runStart });
        runVal = null;
        runStart = -1;
      }
    }
    i++;
  }
  if (runVal !== null) {
    runs.push({ value: runVal, start: runStart, length: i - runStart });
  }
  return runs;
};

const transformList = (head) => {
  const arr = linkedListToArray(head);
  const numberRuns = getNumberRuns(head).sort((a, b) => b.value - a.value);
  const dotRuns = getDotRuns(head);

  for (let { value, start, length } of numberRuns) {
    let needed = length;
    let chosenDotRun = null;
    let chosenDotRunIndex = -1;

    for (let i = 0; i < dotRuns.length; i++) {
      let dotRun = dotRuns[i];
      if (dotRun.start + dotRun.length - 1 < start && dotRun.length >= needed) {
        chosenDotRun = dotRun;
        chosenDotRunIndex = i;
        break;
      }
    }

    if (chosenDotRun) {
      for (let position = start; position < start + length; position++) {
        arr[position] = '.';
      }

      for (let valIndex = 0; valIndex < length; valIndex++) {
        arr[chosenDotRun.start + valIndex] = value;
      }

      let leftOver = chosenDotRun.length - length;
      if (leftOver > 0) {
        dotRuns[chosenDotRunIndex] = {
          start: chosenDotRun.start + length,
          length: leftOver,
        };
      } else {
        dotRuns.splice(chosenDotRunIndex, 1);
      }
    }
  }

  return arr;
};

const task2 = async () => {
  const input = await fetchInputByDay(9);
  const parsedInput = input.trim().split("").map(Number);
  const freeSpace = parsedInput.filter((_, i) => i % 2 === 1);
  const files = parsedInput.filter((_, i) => i % 2 === 0);
  const mapResult = [];
  files.filter((file, i) => {
    for (let f = 0; f < file; f++) {
      mapResult.push(i);
    }
    for (let s = 0; s < freeSpace[i]; s++) {
      mapResult.push(".");
    }
  });
  const linkedList = arrayToLinkedList(mapResult);
  const transformedResult = transformList(linkedList);
  console.log("9.2:", getFinalResult(transformedResult));
};

task1();
task2();
