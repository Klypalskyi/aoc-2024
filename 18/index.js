const { fetchInputByDay } = require("../utils");

const START = { x: 0, y: 0 };
const END = { x: 70, y: 70 };
const BYTES = 1024;

const DIRECTIONS = [
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
];

const serializePoint = ({ x, y }) => `${y},${x}`;

const drawMap = (map) => {
  map.forEach((row) => console.log(row.join("")));
  console.log("\n");
};

const parseInput = (input) => {
  const lines = input
    .trim()
    .split("\n")
    .map((line) => {
      const [x, y] = line.split(",").map(Number);
      return { x, y };
    });
  return lines;
};

const getNeighbors = (map, position) => {
  const { x, y } = position;
  return DIRECTIONS.map((vector) => ({
    y: y + vector.dy,
    x: x + vector.dx,
  })).filter(
    ({ y, x }) =>
      y >= 0 &&
      x >= 0 &&
      y < map.length &&
      x < map[0].length &&
      map[y]?.[x] !== "#"
  );
};

const bfs = (start, end, map) => {
  const visited = new Set();
  visited.add(serializePoint(start));

  const queue = [start];
  let steps = 0;

  while (queue.length) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const currentPosition = queue.shift();

      if (currentPosition.x === end.x && currentPosition.y === end.y) {
        return steps;
      }

      getNeighbors(map, currentPosition).forEach((position) => {
        const posId = serializePoint(position);
        if (!visited.has(posId)) {
          visited.add(posId);
          queue.push(position);
        }
      });
    }

    steps++;
  }
};

const createCorruptedMap = (failedBytes, bytesCount) => {
  const corruptedMap = Array.from({ length: 71 }, () => Array(71).fill("."));
  failedBytes.forEach(({ x, y }, i) => {
    if (i < bytesCount) corruptedMap[y][x] = "#";
  });
  return corruptedMap;
};

const bfsByBytesCount = (map, failedBytes, bytesCount) => {
  const corruptedMap = createCorruptedMap(map, failedBytes, bytesCount);
  return bfs(START, END, corruptedMap);
};

const binarySearch = (maxIndex, checkIndex, failedBytes) => {
  let leftIndex = 0;
  let rightIndex = maxIndex;
  let middleIndex;

  while (leftIndex <= rightIndex) {
    middleIndex = Math.floor((leftIndex + rightIndex) / 2);
    const compareResult = checkIndex(failedBytes, middleIndex);
    if (compareResult === 0) {
      return middleIndex;
    }
    if (compareResult === -1) {
      leftIndex = middleIndex + 1;
    } else if (compareResult === 1) {
      rightIndex = middleIndex - 1;
    }
  }
};

const binarySearchCheck = (failedBytes, bytesCount) => {
  const curr = bfsByBytesCount(failedBytes, bytesCount);
  const prev = bfsByBytesCount(failedBytes, bytesCount - 1);

  if (curr === undefined && prev !== undefined) {
    return 0;
  }

  if (curr === undefined && prev === undefined) {
    return 1;
  }

  return -1;
};

const task = async () => {
  const input = await fetchInputByDay(18);
  const failedBytes = parseInput(input);
  const task1Map = createCorruptedMap(failedBytes, BYTES);

  const task1 = bfs(START, END, task1Map);
  console.log("18.1:", task1);

  const firstBlockingBytes = binarySearch(
    failedBytes.length - 1,
    binarySearchCheck,
    failedBytes
  );
  const firstBlockingCoords = failedBytes[firstBlockingBytes - 1];
  console.log("18.2", `${firstBlockingCoords.x},${firstBlockingCoords.y}`);
};

task();
