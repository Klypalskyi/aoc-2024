const { fetchInputByDay } = require('../utils');

// we have 2d map with 101 width and 103 height
const WIDTH = 101;
const HEIGHT = 103;
const MAX_TICKS = 100;

// parse robot's initial position and his speed from the input like 'p=81,85 v=-35,88'
const parseRobot = (line) => {
  const [pos, vel] = line.split(' v=');
  const [x, y] = pos.replace('p=', '').split(',').map(Number);
  const [dx, dy] = vel.split(',').map(Number);
  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    dx: parseInt(dx, 10),
    dy: parseInt(dy, 10),
  };
};

const moveRobot = (robot) => {
  // if instead of new variable make the reassignment to the robot
  // like robot.x += robot.dx and robot.y += robot.dy
  // we will get the easter egg 100 seconds faster (but why?)
  // and that result will be the wrong one for solving the puzzle
  let newX = robot.x + robot.dx;
  let newY = robot.y + robot.dy;

  if (newX < 0) newX += WIDTH;
  if (newX >= WIDTH) newX -= WIDTH;
  if (newY < 0) newY += HEIGHT;
  if (newY >= HEIGHT) newY -= HEIGHT;

  return { ...robot, x: newX, y: newY };
};

// calculate the sum of the grid's robots in each quadrant
const getQuadrantsSum = (robots) => {
  const middleX = Math.floor(WIDTH / 2);
  const middleY = Math.floor(HEIGHT / 2);

  return robots.reduce((acc, { x, y }) => {
    if (x < middleX && y < middleY) {
      acc[0]++;
    }
    if (x > middleX && y < middleY) {
      acc[1]++;
    }
    if (x < middleX && y > middleY) {
      acc[2]++;
    }
    if (x > middleX && y > middleY) {
      acc[3]++;
    }

    return acc;
  }, [0, 0, 0, 0]);
};

const countNearestRobots = (robots) => robots.reduce((acc, robot) => {
  const { x, y } = robot;
  const isOnTop = robots.some(r => r.x === x && r.y === y - 1);
  const isOnBottom = robots.some(r => r.x === x && r.y === y + 1);
  const isOnLeft = robots.some(r => r.x === x - 1 && r.y === y);
  const isOnRight = robots.some(r => r.x === x + 1 && r.y === y);

  if (isOnTop && isOnBottom && isOnLeft && isOnRight) {
    acc++;
  }

  return acc;
}, 0);

const drawRobots = (robots) => {
  const grid = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => '.'));
  robots.forEach(({ x, y }) => {
    grid[y][x] = '#';
  });

  console.log(grid.map(row => row.join('')).join('\n'));
};

const task = async () => {
  const input = await fetchInputByDay(14);
  const robots = input.trim().split('\n').map(parseRobot);
  let copyRobotsTask1 = [...robots];
  for (let i = 0; i < MAX_TICKS; i++) {
    copyRobotsTask1 = copyRobotsTask1.map(moveRobot);
  }
  const sums = getQuadrantsSum(copyRobotsTask1);
  const multipliedSums = sums.reduce((acc, sum) => acc * sum, 1);
  console.log('14.1:', multipliedSums);

  let copyRobotsTask2 = [...robots];
  for (let i = 0; i < 10000; i++) {
    copyRobotsTask2 = copyRobotsTask2.map(moveRobot);

    const count = countNearestRobots(copyRobotsTask2);
    if (count > 10) {
      drawRobots(copyRobotsTask2);
      console.log(`14.2: ${i + 1}`);
    }
  }
};

task();