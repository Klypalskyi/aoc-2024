const { fetchInputByDay } = require("../utils");

const DIRECTIONS = [
  { dx: 0, dy: -1 }, // Up
  { dx: 0, dy: 1 }, // Down
  { dx: 1, dy: 0 }, // Right
  { dx: -1, dy: 0 }, // Left
];

const findReachableHeights = (map, startX, startY, rows, cols) => {
  const startPosition = map[startX][startY];

  if (startPosition !== "0") {
    return new Set();
  }

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const ways = Array.from({ length: rows }, () => Array(cols).fill(0));
  const queue = [];
  visited[startX][startY] = true;
  ways[startX][startY] = 1;

  queue.push({ x: startX, y: startY, h: 0 });

  const endHeights = new Set();

  while (queue.length > 0) {
    const { x, y, h } = queue.shift();

    if (h === 9) {
      endHeights.add(`${x},${y}`);
      continue;
    }

    const nextH = h + 1;
    for (let { dx, dy } of DIRECTIONS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= rows || ny < 0 || ny >= cols) continue;
      const cellH = map[nx][ny];
      const numH = cellH.charCodeAt(0) - "0".charCodeAt(0);
      if (numH === nextH) {
        if (!visited[nx][ny]) {
          visited[nx][ny] = true;
          ways[nx][ny] = 0;
          queue.push({ x: nx, y: ny, h: numH });
        }

        ways[nx][ny] += ways[x][y];
      }
    }
  }

  let totalDistinctWays = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const h = map[i][j].charCodeAt(0) - "0".charCodeAt(0);
      if (h === 9 && visited[i][j]) {
        totalDistinctWays += ways[i][j];
      }
    }
  }

  return { endHeights, totalDistinctWays };
};

const task1 = async () => {
  const input = await fetchInputByDay(10);
  const map = input.trim().split("\n");
  const rows = map.length;
  const cols = map[0].length;

  let totalScore = 0;
  let totalRating = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (map[i][j] === "0") {
        const { endHeights, totalDistinctWays } = findReachableHeights(map, i, j, rows, cols);
        const score = endHeights.size;
        totalScore += score;
        totalRating += totalDistinctWays;
      }
    }
  }

  console.log("10.1:", totalScore);
  console.log("10.2:", totalRating);
};

task1();
