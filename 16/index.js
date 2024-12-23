const { fetchInputByDay } = require("../utils");

const createPoint = (y, x) => ({ y, x });

const DIRECTIONS = [
  { dx: 1, dy: 0 }, // East
  { dx: 0, dy: 1 }, // South
  { dx: -1, dy: 0 }, // West
  { dx: 0, dy: -1 }, // North
];
const EAST = 0;
const SOUTH = 1;
const WEST = 2;
const NORTH = 3;

const COST_FORWARD = 1;
const COST_TURN = 1000;

const iterateMap = (map, callback) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const value = map[y][x];
      if (callback(createPoint(y, x), value)) return;
    }
  }
};

const getBaseGrid = async () => {
  const input = await fetchInputByDay(16);
  const lines = input.trim().split("\n");

  const height = lines.length;
  const width = lines[0].length;

  const grid = lines.map((line) => line.split(""));

  return { grid, height, width };
};

const getPosition = (grid, position) => {
  let startPosition = null;
  iterateMap(grid, (point, value) => {
    if (value === position.toUpperCase()) {
      startPosition = point;
      return true;
    }
    return false;
  });
  return startPosition;
};

const popMin = (que) => {
  que.sort((a, b) => a[0] - b[0]);
  return que.shift();
};

const isInBounds = (x, y, width, height) =>
  x >= 0 && x < width && y >= 0 && y < height;

const isWall = (grid, x, y) => grid[y][x] === "#";

const getShortestPath = (grid, height, width, startStates, isT1 = false, isReverse = false) => {
  const dist = Array.from({ length: width }, () =>
    Array.from({ length: height }, () => Array(4).fill(Infinity))
  );
  const priorityQueue = [];

  startStates.forEach(({ cost, x, y, dir }) => {
    dist[x][y][dir] = cost;
    priorityQueue.push([cost, x, y, dir]);
  });

  while (priorityQueue.length > 0) {
    const [currentCost, currentX, currentY, currentDir] = popMin(priorityQueue);
    if (currentCost > dist[currentX][currentY][currentDir]) {
      continue;
    }

    if (isT1 && grid[currentY][currentX] === "E") {
      return currentCost;
    }

    // Move forward
    const { dx, dy } = DIRECTIONS[currentDir];
    const nextX = isReverse ? currentX - dx : currentX + dx;
    const nextY = isReverse ? currentY - dy : currentY + dy;

    if (
      isInBounds(nextX, nextY, width, height) &&
      !isWall(grid, nextX, nextY)
    ) {
      const nextCost = currentCost + COST_FORWARD;
      if (nextCost < dist[nextX][nextY][currentDir]) {
        dist[nextX][nextY][currentDir] = nextCost;
        priorityQueue.push([nextCost, nextX, nextY, currentDir]);
      }
    }

    // Turn left
    const leftValue = isReverse ? 1 : 3;
    const leftDirection = (currentDir + leftValue) % 4;
    const costLeft = currentCost + COST_TURN;
    if (costLeft < dist[currentX][currentY][leftDirection]) {
      dist[currentX][currentY][leftDirection] = costLeft;
      priorityQueue.push([costLeft, currentX, currentY, leftDirection]);
    }

    // Turn right
    const rightValue = isReverse ? 3 : 1;
    const rightDirection = (currentDir + rightValue) % 4;
    const costRight = currentCost + COST_TURN;
    if (costRight < dist[currentX][currentY][rightDirection]) {
      dist[currentX][currentY][rightDirection] = costRight;
      priorityQueue.push([costRight, currentX, currentY, rightDirection]);
    }
  }

  return dist;
};

const task1 = async () => {
  const { grid, height, width } = await getBaseGrid();
  const startPosition = getPosition(grid, "S");
  const endPosition = getPosition(grid, "E");
  const startState = [
    { ...startPosition, cost: 0, dir: EAST },
  ];
  const endState = [
    { ...endPosition, cost: 0, dir: EAST },
    { ...endPosition, cost: 0, dir: SOUTH },
    { ...endPosition, cost: 0, dir: WEST },
    { ...endPosition, cost: 0, dir: NORTH },
  ];
  let isT1 = true;
  const bestCost = getShortestPath(grid, height, width, startState, isT1);
  console.log("16.1:", bestCost);
  isT1 = false;
  
  const startDistances = getShortestPath(grid, height, width, startState, isT1);
  const isReverse = true;
  const endDistances = getShortestPath(grid, height, width, endState, isT1, isReverse);

  let bestCostFromStart = Infinity;
  for (let dir = 0; dir < 4; dir++) {
    const cost = startDistances[endPosition.x][endPosition.y][dir];
    if (cost < bestCostFromStart) bestCostFromStart = cost;
  }

  // include the Start and End positions
  let count = 2;

  iterateMap(grid, (point, value) => {
    if (value === ".") {
      for (let dir = 0; dir < 4; dir++) {
        if (
          startDistances[point.x][point.y][dir] +
            endDistances[point.x][point.y][dir] ===
          bestCostFromStart
        ) {
          count++;
          break;
        }
      }
    }
  });
  
  console.log('16.2:', count);
};

task1();
