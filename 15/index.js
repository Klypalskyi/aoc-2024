const { fetchInputByDay } = require("../utils");

const MOVES = {
  "^": { y: -1, x: 0 },
  v: { y: 1, x: 0 },
  "<": { y: 0, x: -1 },
  ">": { y: 0, x: 1 },
};

const createPoint = (y, x) => ({ y, x });

// Debugging function
const drawMap = (map) => {
  map.forEach((row) => console.log(row.join("")));
  console.log("\n");
};

const parseInput = (inputLines) => {
  const map = [];
  const moves = [];

  inputLines.forEach((line) => {
    if (line.startsWith("#")) {
      map.push(line.split(""));
    } else if (line.trim() !== "") {
      moves.push(...line.trim());
    }
  });

  const currentStep = findStart(map);
  return { map, moves, currentStep };
};

const iterateMap = (map, callback) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const value = map[y][x];
      if (callback(createPoint(y, x), value)) return;
    }
  }
};

const findStart = (map) => {
  let start = createPoint(0, 0);

  iterateMap(map, (point, value) => {
    if (value === "@") {
      start = point;
      return true;
    }
    return false;
  });

  return start;
};

const runMoves = (state) => {
  state.moves.forEach((_, index) => attemptToMove(state, index));
};

const attemptToMove = (state, moveIdx) => {
  const currentMove = state.moves[moveIdx];
  const stepsTillFreeSpace = getStepsTillFreeSpace(state, moveIdx);
  if (stepsTillFreeSpace.length) {
    move(state, stepsTillFreeSpace, currentMove);
  }
};

const move = (state, stepsTillFreeSpace) => {
  if (!stepsTillFreeSpace.length) return;

  const [robotPosition, nextRobotStep] = stepsTillFreeSpace;
  state.map[robotPosition.y][robotPosition.x] = ".";
  state.map[nextRobotStep.y][nextRobotStep.x] = "@";
  state.currentStep = nextRobotStep;

  if (stepsTillFreeSpace.length === 2) return;

  const freeSpacePoint = stepsTillFreeSpace[stepsTillFreeSpace.length - 1];
  state.map[freeSpacePoint.y][freeSpacePoint.x] = "O";
};

const getNextStep = ({ y, x }, move) => {
  const vector = MOVES[move];
  return createPoint(y + vector.y, x + vector.x);
};

const getStepsTillFreeSpace = (state, moveIdx) => {
  const currentMove = state.moves[moveIdx];
  let step = state.currentStep;
  const stepsToMove = [step];

  while (true) {
    step = getNextStep(step, currentMove);
    if (
      step.y < 0 ||
      step.y >= state.map.length ||
      step.x < 0 ||
      step.x >= state.map[0].length
    ) {
      return []; // Out of bounds
    }
    const currentValue = state.map[step.y]?.[step.x];

    if (currentValue === "#") return [];
    if (currentValue === ".") {
      stepsToMove.push(step);
      return stepsToMove;
    }
    if (currentValue === "O") {
      stepsToMove.push(step);
      continue;
    }

    return [];
  }
};

const calculateGPSSum = (state, isT2 = false) => {
  let sum = 0;
  const box = isT2 ? "[" : "O";

  iterateMap(state.map, ({ x, y }, value) => {
    if (value === box) sum += 100 * y + x;
  });

  return sum;
};

const task1 = async () => {
  const input = await fetchInputByDay(15);
  const state = parseInput(input.trim().split("\n"));
  runMoves(state);
  console.log("15.1:", calculateGPSSum(state));
};

const scaleMap = (map) =>
  map.map((row) => {
    let scaledRow = [];
    row.forEach((cell) => {
      switch (cell) {
        case "#":
          scaledRow.push("#", "#");
          break;
        case "O":
          scaledRow.push("[", "]");
          break;
        case ".":
          scaledRow.push(".", ".");
          break;
        case "@":
          scaledRow.push("@", ".");
          break;
        default:
          scaledRow.push(cell, cell); // Handle any unexpected characters
      }
    });
    return scaledRow;
  });

const solvePart2 = ({ map, moves, currentStep }) => {
  const height = map.length;
  const width = map[0].length;

  for (const move of moves) {
    const { y: nextY, x: nextX } = MOVES[move];
    let valid = true;
    const stepsStack = [currentStep];
    const visited = new Set();

    while (stepsStack.length > 0) {
      const { y, x } = stepsStack.pop();
      const key = `${y},${x}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (map[y][x] === "#") {
        valid = false;
        break;
      }

      if (map[y][x] === "[") {
        // push the second bracket
        stepsStack.push({ y, x: x + 1 });
      } else if (map[y][x] === "]") {
        stepsStack.push({ y, x: x - 1 });
      }

      if (map[y][x] === "." && (y !== currentStep.y || x !== currentStep.x)) {
        // We skip
        continue;
      }

      const newY = y + nextY;
      const newX = x + nextX;
      if (newY < 0 || newY >= height || newX < 0 || newX >= width) {
        valid = false;
        break;
      }
      stepsStack.push({ y: newY, x: newX });
    }

    if (valid) {
      // sorted approach, replicate your code
      const visitedArr = Array.from(visited).map((val) => {
        const [y, x] = val.split(",").map(Number);
        return { y, x };
      });

      // sort "fix" => in python code, was "reverse=1" if we do same approach
      visitedArr.sort((a, b) => {
        // just replicate python's logic => sort by?
        // snippet used: key=lambda x: x[0] * di + x[1] * dj, reverse=1
        const sortA = a.y * nextY + a.x * nextX;
        const sortB = b.y * nextY + b.x * nextX;
        return sortB - sortA;
      });

      for (const step of visitedArr) {
        const { y, x } = step;
        if (map[y][x] === ".") {
        } else if (map[y][x] === "[" || map[y][x] === "]") {
          if (map[y + nextY][x + nextX] === ".") {
            map[y + nextY][x + nextX] = map[y][x];
            map[y][x] = ".";
          }
        }
      }
      currentStep.y += nextY;
      currentStep.x += nextX;
    }
  }
};

const task2 = async () => {
  const input = await fetchInputByDay(15);
  const state = parseInput(input.trim().split("\n"));
  state.map = scaleMap(state.map);
  state.currentStep = findStart(state.map);
  state.map[state.currentStep.y][state.currentStep.x] = ".";
  solvePart2(state);
  console.log("15.2:", calculateGPSSum(state, true));
};

task1();
task2();
