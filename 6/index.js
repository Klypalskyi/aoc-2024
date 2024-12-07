const { fetchInputByDay } = require("../utils");

// Directions in the order: Up, Right, Down, Left
const DIRECTIONS = [
  { dx: 0, dy: -1, symbol: '^' },
  { dx: 1, dy: 0, symbol: '>' },
  { dx: 0, dy: 1, symbol: 'v' },
  { dx: -1, dy: 0, symbol: '<' },
];
const DIRECTION_CHARS = '^>v<';

const simulate = (grid, startX, startY, directionIndex) => {
  let x = startX;
  let y = startY;
  
  const visitedStates = new Set();
  visitedStates.add(`${x},${y},${directionIndex}`);

  const height = grid.length;
  const width = grid[0].length;

  while (true) {
    const dir = DIRECTIONS[directionIndex];
    const nx = x + dir.dx;
    const ny = y + dir.dy;

    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      return false; 
    }

    if (grid[ny][nx] === '#') {
      directionIndex = (directionIndex + 1) % 4;
      const state = `${x},${y},${directionIndex}`;
      if (visitedStates.has(state)) {
        return true;
      }
      visitedStates.add(state);
      continue;
    }

    x = nx;
    y = ny;
    const state = `${x},${y},${directionIndex}`;
    if (visitedStates.has(state)) {
      return true;
    }
    visitedStates.add(state);
  }
}

const task1 = async () => {
  const input = await fetchInputByDay(6);
  let grid = input.split('\n').map(line => line.split(''));
  const height = grid.length;
  const width = grid[0].length;

  let startX;
  let startY;
  let directionIndex;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = grid[y][x];
      if (DIRECTION_CHARS.includes(char)) {
        startX = x;
        startY = y;
        directionIndex = DIRECTION_CHARS.indexOf(char);
        grid[y][x] = '.';
        break;
      }
    }
  }

  const visited = new Set();
  visited.add(`${startX},${startY}`);

  let x = startX;
  let y = startY;

  while (true) {
    const dir = DIRECTIONS[directionIndex];
    const nx = x + dir.dx;
    const ny = y + dir.dy;

    // If next step is off the map, stop
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
      break;
    }

    // If obstacle ahead, turn right (do not move)
    if (grid[ny][nx] === '#') {
      directionIndex = (directionIndex + 1) % 4;
      continue; 
    }

    // Otherwise, move forward
    x = nx;
    y = ny;
    visited.add(`${x},${y}`);
  }

  console.log('6.1', visited.size - 1);
};

const task2 = async () => {
  const input = await fetchInputByDay(6);
  let grid = input.trim().split('\n').map(line => line.split(''));
  const height = grid.length;
  const width = grid[0].length;

  let startX;
  let startY;
  let directionIndex;
  let foundStart = false;

  // Find guard's start position & direction
  for (let y = 0; y < height && !foundStart; y++) {
    for (let x = 0; x < width && !foundStart; x++) {
      const char = grid[y][x];
      if (DIRECTION_CHARS.includes(char)) {
        startX = x;
        startY = y;
        directionIndex = DIRECTION_CHARS.indexOf(char);
        grid[y][x] = '.'; // Replace guard symbol with floor
        foundStart = true;
      }
    }
  }

  let loopCount = 0;

  // Try placing a new obstruction on every '.' cell except the guard's start
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((x === startX && y === startY) || grid[y][x] !== '.') {
        continue;
      }

      grid[y][x] = '#';

      if (simulate(grid, startX, startY, directionIndex)) {
        loopCount++;
      }

      grid[y][x] = '.';
    }
  }

  console.log('6.2', loopCount);
};

task1();
task2();