const { fetchInputByDay } = require("../utils");

const inBounds = (x, y, width, height) => x >= 0 && x < width && y >= 0 && y < height;
const getBaseGrid = async () => {
  const input = await fetchInputByDay(8);
  const lines = input.trim().split('\n');

  const height = lines.length;
  const width = lines[0].length;

  const grid = lines.map(line => line.split(''));

  return { grid, height, width };
};

const calculateFrequency = (map, grid, width, height) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const char = grid[y][x];
      if (char !== '.') {
        if (!map.has(char)) {
          map.set(char, []);
        }
        map.get(char).push({ x, y });
      }
    }
  }
};

const getGreatestCommonDivisor = (a, b) => {
  let absA = Math.abs(a);
  let absB = Math.abs(b);
  
  while (absB !== 0) {
    const temp = absB;
    absB = absA % absB;
    absA = temp;
  }
  return absA;
};

const DIRECTIONS = {
  FORWARD: 'FORWARD',
  BACKWARD: 'BACKWARD',
}

async function task1() {
  const { grid, height, width } = await getBaseGrid();
  const antennasByFreq = new Map();
  const antinodes = new Set();
  calculateFrequency(antennasByFreq, grid, width, height);

  for (const [_, positions] of antennasByFreq.entries()) {
    if (positions.length < 2) continue;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const firstAntenna = positions[i];
        const secondAntenna = positions[j];

        const antinode1x = 2 * firstAntenna.x - secondAntenna.x;
        const antinode1y = 2 * firstAntenna.y - secondAntenna.y;

        const antinode2x = 2 * secondAntenna.x - firstAntenna.x;
        const antinode2y = 2 * secondAntenna.y - firstAntenna.y;

        if (inBounds(antinode1x, antinode1y, width, height)) {
          antinodes.add(`${antinode1x},${antinode1y}`);
        }
        if (inBounds(antinode2x, antinode2y, width, height)) {
          antinodes.add(`${antinode2x},${antinode2y}`);
        }
      }
    }
  }

  console.log('8.1', antinodes.size);
}

const task2 = async () => {
  const { grid, height, width } = await getBaseGrid();
  const antennasByFreq = new Map();
  const antinodes = new Set();
  calculateFrequency(antennasByFreq, grid, width, height);

  for (const [_, positions] of antennasByFreq.entries()) {
    if (positions.length < 2) continue;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const firstAntenna = positions[i];
        const secondAntenna = positions[j];
        const dx = secondAntenna.x - firstAntenna.x;
        const dy = secondAntenna.y - firstAntenna.y;
        const gcd = getGreatestCommonDivisor(dx, dy);
        const dxNormalized = dx / gcd;
        const dyNormalized = dy / gcd;

        const drawLine = (startX, startY, direction) => {
          let x = startX;
          let y = startY;
          while (inBounds(x, y, width, height)) {
            if (grid[y][x] === '#') {
              break;
            }
            antinodes.add(`${x},${y}`);
            if (direction === DIRECTIONS.FORWARD) {
              x += dxNormalized;
              y += dyNormalized;
            } else {
              x -= dxNormalized;
              y -= dyNormalized;
            }
          }
        }
        drawLine(firstAntenna.x, firstAntenna.y, DIRECTIONS.FORWARD);
        drawLine(secondAntenna.x, secondAntenna.y, DIRECTIONS.BACKWARD);
      }
    }
  }

  console.log('8.2', antinodes.size);
};

task1();
task2();