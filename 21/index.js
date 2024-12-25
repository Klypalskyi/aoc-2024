const { fetchInputByDay } = require("../utils");

const KEYPAD = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [null, "0", "A"],
];

const DIR_PAD = [
  [null, "^", "A"],
  ["<", "v", ">"],
];

const getAllShortestPaths = (startCoord, layout) => {
  const pathsByValue = {};
  const visitedSet = new Set();
  visitedSet.add(startCoord.join("|"));
  const startVal = layout[startCoord[0]][startCoord[1]];
  let queueOfPaths = [[[startCoord, "", startVal]]];

  const getNextSteps = ([row, col], grid) =>
    [
      [row - 1, col, "^"],
      [row, col + 1, ">"],
      [row + 1, col, "v"],
      [row, col - 1, "<"],
    ]
      .filter(
        ([nRow, nCol]) =>
          grid?.[nRow]?.[nCol] !== undefined &&
          !visitedSet.has(`${nRow}|${nCol}`) &&
          grid?.[nRow]?.[nCol]
      )
      .map(([nRow, nCol, dirVal]) => [[nRow, nCol], dirVal, grid[nRow][nCol]]);

  while (queueOfPaths.length) {
    const nextQueue = [];
    const newlyVisited = [];

    queueOfPaths.forEach((path) => {
      const [currentCoord] = path.at(-1);
      getNextSteps(currentCoord, layout).forEach(
        ([nextCoord, dirVal, nextVal]) => {
          newlyVisited.push(nextCoord.join("|"));
          const extendedPath = path.concat([[nextCoord, dirVal, nextVal]]);
          if (pathsByValue[nextVal]) {
            pathsByValue[nextVal].push(extendedPath.map((p) => p[1]).join(""));
          } else {
            pathsByValue[nextVal] = [extendedPath.map((p) => p[1]).join("")];
          }
          nextQueue.push(extendedPath);
        }
      );
    });
    newlyVisited.forEach((x) => visitedSet.add(x));
    queueOfPaths = nextQueue;
  }

  const bestPaths = {};
  Object.entries(pathsByValue).forEach(([val, pathList]) => {
    if (pathList.length === 1) {
      bestPaths[`${startVal}${val}`] = `${pathList[0]}A`;
      if (startVal === "A") {
        bestPaths[val] = `${pathList[0]}A`;
      }
    } else {
      const dirOrder = "<v^>";
      const getScore = (dirPath) => {
        const arr = dirPath.split("");
        return arr
          .slice(0, -1)
          .map((step, idx) => {
            let sc = 0;
            if (step !== arr[idx + 1]) sc += 10;
            if (dirOrder.indexOf(arr[idx + 1]) < dirOrder.indexOf(step))
              sc += 5;
            return sc;
          })
          .reduce((acc, cur) => acc + cur, 0);
      };
      let scored = pathList.map((pathString) => [
        getScore(pathString),
        pathString,
      ]);
      scored.sort((a, b) => a[0] - b[0]);
      bestPaths[`${startVal}${val}`] = `${scored[0][1]}A`;
      if (startVal === "A") {
        bestPaths[val] = `${scored[0][1]}A`;
      }
    }
  });
  return bestPaths;
};

const numpadDirections = Object.assign(
  ...KEYPAD.flatMap((rowData, rowIdx) =>
    rowData.map((cellVal, colIdx) => [rowIdx, colIdx, cellVal])
  )
    .filter((triple) => triple[2] !== null)
    .map(([row, col]) => getAllShortestPaths([row, col], KEYPAD))
);

const directions = Object.assign(
  ...DIR_PAD.flatMap((rowData, rowIdx) =>
    rowData.map((cellVal, colIdx) => [rowIdx, colIdx, cellVal])
  )
    .filter((triple) => triple[2] !== null)
    .map(([row, col]) => getAllShortestPaths([row, col], DIR_PAD))
);

directions["A"] = "A";
directions["AA"] = "A";
directions["<<"] = "A";
directions[">>"] = "A";
directions["^^"] = "A";
directions["vv"] = "A";

const computePressCounts = (keypadCodesArr, dirCodesArr, totalKeyboards) => {
  const numericVals = keypadCodesArr.map((codeStr) =>
    parseInt(codeStr.slice(0, -1))
  );
  const targetDepth = totalKeyboards - 1;
  let finalSum = 0;

  dirCodesArr.forEach((segmentArr, idx) => {
    let countingObj = segmentArr.reduce(
      (acc, item) => ((acc[item] = (acc[item] || 0) + 1), acc),
      {}
    );

    for (let i = 0; i < targetDepth; i++) {
      let updatedObj = {};
      Object.entries(countingObj).forEach(([keyPresses, valCount]) => {
        if (keyPresses.length === 1) {
          let replaceKey = directions[keyPresses];
          updatedObj[replaceKey] = (updatedObj[replaceKey] || 0) + valCount;
        } else {
          let splitted = [""]
            .concat(keyPresses.split(""))
            .map((ch, i2, arr2) => `${ch}${arr2[i2 + 1]}`)
            .slice(0, -1);
          splitted.forEach((part) => {
            let replaceKey = directions[part];
            updatedObj[replaceKey] = (updatedObj[replaceKey] || 0) + valCount;
          });
        }
      });
      countingObj = updatedObj;
    }

    finalSum +=
      Object.entries(countingObj)
        .map(([strPress, cVal]) => strPress.length * cVal)
        .reduce((a, c) => a + c, 0) * numericVals[idx];
  });
  return finalSum;
};

const task = async () => {
  const input = await fetchInputByDay(21);
  const keypadCodes = input.trim().split("\n");
  const codes = keypadCodes
    .map((fullCode) =>
      [""]
        .concat(fullCode.split(""))
        .map((char, idx, arr) => `${char}${arr[idx + 1]}`)
        .slice(0, -1)
    )
    .map((splitArr) => splitArr.map((chunk) => numpadDirections[chunk]));

  const task1 = computePressCounts(keypadCodes, codes, 3);
  const task2 = computePressCounts(keypadCodes, codes, 26);

  console.log("21.1:", task1);
  console.log("21.2:", task2);
};

task();