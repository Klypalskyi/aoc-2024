const { fetchInputByDay } = require("../utils");

const DIRECTIONS = [
  { dx: -1, dy: 0 }, // Up
  { dx: 1, dy: 0 },  // Down
  { dx: 0, dy: -1 }, // Left
  { dx: 0, dy: 1 }   // Right
];

const groupCoords = (coordinates) => {
  if (!coordinates || coordinates.length === 0) return [];
  const groupSet = new Set(coordinates.map(coord => `${coord.x},${coord.y}`));

  const visited = new Set();
  const groups = [];

  for (const coord of coordinates) {
    const key = `${coord.x},${coord.y}`;
    if (visited.has(key)) continue;

    const group = [];
    const queue = [coord];
    visited.add(key);

    while (queue.length > 0) {
      const current = queue.shift();
      group.push(current);

      for (const dir of DIRECTIONS) {
        const adjacentX = current.x + dir.dx;
        const adjacentY = current.y + dir.dy;
        const adjacentKey = `${adjacentX},${adjacentY}`;

        if (groupSet.has(adjacentKey) && !visited.has(adjacentKey)) {
          const adjacentCoord = coordinates.find(c => c.x === adjacentX && c.y === adjacentY);
          if (adjacentCoord) {
            queue.push(adjacentCoord);
            visited.add(adjacentKey);
          }
        }
      }
    }

    groups.push(group);
  }

  return groups;
};

const calculatePerimeter = (group) => {
  const groupSet = new Set(group.map(coord => `${coord.x},${coord.y}`));
  let perimeter = 0;
  for (const coord of group) {
    for (const dir of DIRECTIONS) {
      const adjacentX = coord.x + dir.dx;
      const adjacentY = coord.y + dir.dy;
      const adjacentKey = `${adjacentX},${adjacentY}`;

      if (!groupSet.has(adjacentKey)) {
        perimeter++;
      }
    }
  }

  return perimeter;
};

const getEdges = ({ y, x }) => {
  const top = { y: y - 1, x };
  const down = { y: y + 1, x };
  const left = { y, x: x - 1 };
  const right = { y, x: x + 1 };

  return [top, down, left, right];
};

const getSidesCount = (group) => group.reduce(
  (sum, point) => sum + getCornersCountForPoint(point, group),
  0
);

const serializeKey = ({ y, x }) => `${y},${x}`;

const getCornersCountForPoint = (
  point,
  group
) => {
  const [top, down, left, right] = getEdges(point);
  let count = 0;
  const simplifiedGroupMap = new Map();
  group.forEach(point => simplifiedGroupMap.set(serializeKey(point), point));
  const topRight = { y: top.y, x: right.x };
  const rightDown = { y: down.y, x: right.x };
  const downLeft = { y: down.y, x: left.x };
  const leftTop = { y: top.y, x: left.x };
  const hasTop = simplifiedGroupMap.has(serializeKey(top));
  const hasRight = simplifiedGroupMap.has(serializeKey(right));
  const hasDown = simplifiedGroupMap.has(serializeKey(down));
  const hasLeft = simplifiedGroupMap.has(serializeKey(left));

  if (!hasTop && !hasRight) {
    count++;
  }

  if (!hasRight && !hasDown) {
    count++;
  }

  if (!hasDown && !hasLeft) {
    count++;
  }

  if (!hasLeft && !hasTop) {
    count++;
  }

  if (hasTop && hasRight && !simplifiedGroupMap.has(serializeKey(topRight))) {
    count++;
  }

  if (hasRight && hasDown && !simplifiedGroupMap.has(serializeKey(rightDown))) {
    count++;
  }

  if (hasDown && hasLeft && !simplifiedGroupMap.has(serializeKey(downLeft))) {
    count++;
  }

  if (hasLeft && hasTop && !simplifiedGroupMap.has(serializeKey(leftTop))) {
    count++;
  }

  return count;
};

const task = async () => {
  const input = await fetchInputByDay(12);
  const grid = input.split('\n').map(row => row.split(''));
  const plantsMap = new Map();
  const perimeterMap = new Map();
  const sidesMap = new Map();

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      plantsMap.set(cell, [...plantsMap.get(cell) || [], { x, y }].sort((a, b) => a.x - b.x));
    });
  });


  Array.from(plantsMap.keys()).forEach(key => {
    const groups = groupCoords(plantsMap.get(key));
    plantsMap.set(key, groups);
    groups.forEach(group => {
      const perimeter = calculatePerimeter(group);
      perimeterMap.set(key, [...perimeterMap.get(key) || [], { count: group.length, perimeter, price: group.length * perimeter }]);
      const sides = getSidesCount(group);
      sidesMap.set(key, [...sidesMap.get(key) || [], { count: group.length, sides, priceWithDiscount: group.length * sides }]);
    });
  });

  const result1 = Array.from(perimeterMap.values()).flatMap((group) => group).reduce((acc, group) => acc + group.price, 0);
  const result2 = Array.from(sidesMap.values()).flatMap((group) => group).reduce((acc, group) => acc + group.priceWithDiscount, 0);
  console.log('12.1:', result1);
  console.log('12.2:', result2);
};

task();