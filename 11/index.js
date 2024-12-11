const { fetchInputByDay } = require("../utils");
const MULT = 2024;
const BLINKS = 75; // or however many you need

// Splits an even-length number string into two halves, removing leading zeros from each half
function splitEvenNumberStr(numStr) {
  const half = numStr.length / 2;
  const leftStr = numStr.slice(0, half);
  const rightStr = numStr.slice(half);

  // Convert to Number and back to String to remove leading zeros
  const leftNum = Number(leftStr);
  const rightNum = Number(rightStr);

  return [String(leftNum), String(rightNum)];
}

const multiplyOddNumberStr = (numStr) => {
  const bigVal = Number(numStr);
  const multiplied = bigVal * MULT;
  return multiplied.toString();
}

const isEvenLength = (str) => str.length % 2 === 0;

const task = async () => {
  const input = await fetchInputByDay(11);
  const stoneCounts = new Map();

  for (const val of input.split(" ")) {
    const stoneStr = String(Number(val));
    stoneCounts.set(stoneStr, (stoneCounts.get(stoneStr) || 0) + 1);
  }

  for (let i = 0; i < BLINKS; i++) {
    const newStoneCounts = new Map();

    for (const [stoneStr, count] of stoneCounts.entries()) {
      if (stoneStr === "0") {
        const newCount = (newStoneCounts.get("1") || 0) + count;
        newStoneCounts.set("1", newCount);
      } else if (isEvenLength(stoneStr)) {
        const [left, right] = splitEvenNumberStr(stoneStr);
        newStoneCounts.set(left, (newStoneCounts.get(left) || 0) + count);
        newStoneCounts.set(right, (newStoneCounts.get(right) || 0) + count);
      } else {
        const multipliedStr = multiplyOddNumberStr(stoneStr);
        newStoneCounts.set(multipliedStr, (newStoneCounts.get(multipliedStr) || 0) + count);
      }
    }

    stoneCounts.clear();
    for (const [key, value] of newStoneCounts.entries()) {
      stoneCounts.set(key, value);
    }
  }

  let totalCount = 0;
  for (const count of stoneCounts.values()) {
    totalCount += count;
  }

  console.log(totalCount);
};

task();