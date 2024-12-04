const { fetchInputByDay } = require("../utils");

const word = 'XMAS';
const wordLength = word.length;

const directions = [
  { x: 0, y: -1 },
  { x: 0, y: 1 }, 
  { x: -1, y: 0 },
  { x: 1, y: 0 }, 
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: 1, y: 1 }, 
];

const findWord = (grid) => {
  const height = grid.length;
  let count = 0;

  for (let y = 0; y < height; y++) {
    const rowWidth = grid[y].length;
    for (let x = 0; x < rowWidth; x++) {
      if (grid[y][x] === word[0]) {
        for (const dir of directions) {
          let found = true;
          for (let i = 1; i < wordLength; i++) {
            const newY = y + dir.y * i;
            const newX = x + dir.x * i;

            if (
              newY < 0 ||
              newY >= height ||
              newX < 0 ||
              newX >= grid[newY].length ||
              grid[newY][newX] !== word[i]
            ) {
              found = false;
              break;
            }
          }
          if (found) count++;
        }
      }
    }
  }
  return count;
};

const isValidPosition = (grid, y, x) =>
  y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;

const findMas = (grid) => {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    const rowLength = grid[y].length;
    for (let x = 0; x < rowLength; x++) {
      let firstMatch = false;
      let secondMatch = false;

      if (
        isValidPosition(grid, y - 1, x - 1) &&
        isValidPosition(grid, y, x) &&
        isValidPosition(grid, y + 1, x + 1)
      ) {
        const L1 = grid[y - 1][x - 1];
        const L2 = grid[y][x];
        const L3 = grid[y + 1][x + 1];

        if (
          (L1 === 'M' && L2 === 'A' && L3 === 'S') ||
          (L1 === 'S' && L2 === 'A' && L3 === 'M')
        ) {
          firstMatch = true;
        }
      }

      if (
        isValidPosition(grid, y - 1, x + 1) &&
        isValidPosition(grid, y, x) &&
        isValidPosition(grid, y + 1, x - 1)
      ) {
        const L1 = grid[y - 1][x + 1];
        const L2 = grid[y][x];
        const L3 = grid[y + 1][x - 1];

        if (
          (L1 === 'M' && L2 === 'A' && L3 === 'S') ||
          (L1 === 'S' && L2 === 'A' && L3 === 'M')
        ) {
          secondMatch = true;
        }
      }

      if (firstMatch && secondMatch) {
        count++;
      }
    }
  }
  return count;
};

const task = async () => {
  const input = await fetchInputByDay(4);
  const gridInput = input.trim().split("\n").map((line) => line.trim().split(""));
  const count = findWord(gridInput);
  const count2 = findMas(gridInput);

  console.log('4.1', count);
  console.log('4.2', count2);
};

task();