const { fetchInputByDay } = require("../utils");

const DIRECTIONS = [
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
];

const parseInput = (input)  =>{
  const grid = input.trim().split('\n').map((line) => line.split(''));

  let start = undefined;
  let end = undefined;

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 'S') {
        start = { y, x };
      }

      if (row[x] === 'E') {
        end = { y, x };
      }
    }
  }

  return { grid, start, end };
};

const serializePoint = ({ x, y }) => `${y},${x}`;

const getNeighbors = ({
  map,
  position,
  isNeighborAllowed,
}) => {
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
      (isNeighborAllowed?.(map[y]?.[x], { y, x }) ?? true)
  );
};

const findPath = (grid, start, end) => {
  const endPosId = serializePoint(end);
  const path = new Map();

  let steps = 0;
  path.set(serializePoint(start), { ...start, steps });

  const queue = [start];

  while (queue.length) {
    const currentPos = queue.shift();

    if (serializePoint(currentPos) === endPosId) {
      return path;
    }

    getNeighbors({
      map: grid,
      position: currentPos,
      isNeighborAllowed: (value, pos) => value !== '#' && !path.has(serializePoint(pos)),
    }).forEach((pos) => {
      steps++;
      path.set(serializePoint(pos), { ...pos, steps });
      queue.push(pos);
    });
  }

  return path;
};

const findCheats = (pathMap, maxCheatTime) => {
  const pathArr = [...pathMap.values()];
  const cheats = [];

  for (let i = 0; i < pathArr.length - 1; i++) {
    for (let j = i + 1; j < pathArr.length; j++) {
      const posA = pathArr[i];
      const posB = pathArr[j];
      const stepsSaved = posB.steps - posA.steps;
      const distance = Math.abs(posA.x - posB.x) + Math.abs(posA.y - posB.y);

      if (distance > maxCheatTime) {
        continue;
      }

      const saved = stepsSaved - distance;
      if (saved > 0) {
        cheats.push(saved);
      }
    }
  }

  return cheats;
}

const countResult = (path, maxCheatTime) =>{
  const cheats = findCheats(path, maxCheatTime);
  const numOfCheatsBySavedSteps = cheats.reduce(
    (acc, savedSteps) => {
      if (acc[savedSteps] === undefined) {
        acc[savedSteps] = 0;
      }

      acc[savedSteps]++;

      return acc;
    },
    {}
  );

  const countOfCheatsWithOver100StepsSaved = Object.entries(
    numOfCheatsBySavedSteps
  ).reduce((sum, [savedSteps, numberOfCheats]) => {
    if (Number(savedSteps) >= 100) {
      sum += numberOfCheats;
    }
    return sum;
  }, 0);

  return countOfCheatsWithOver100StepsSaved;
}

const task = async () => {
  const input = await fetchInputByDay(20);
  const { grid, start, end } = parseInput(input);
  const path = findPath(grid, start, end);
  const task1 = countResult(path, 2);
  const task2 = countResult(path, 20);

  console.log("20.1:", task1);
  console.log("20.2:", task2);
};

task();
