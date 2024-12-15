const { fetchInputByDay } = require('../utils');

const parseRule = (rule, splitter) => {
  const [x, y] = rule.split(', ');
  return { x: Number(x.split(splitter)[1]), y: Number(y.split(splitter)[1]) };
};

const findOptimalPresses = ({ a, b, prize }) =>{
  const maxPresses = 100;
  let optimal = null;

  for (let nA = 0; nA <= maxPresses; nA++) {
    const remainingX = prize.x - nA * a.x;
    if (b.x === 0) {
      if (remainingX !== 0) continue;
      for (let nB = 0; nB <= maxPresses; nB++) {
        if (nA * a.y + nB * b.y === prize.y) {
          const totalCost = nA * a.cost + nB * b.cost;
          if (optimal === null || totalCost < optimal.totalCost) {
            optimal = { nA, nB, totalCost };
          }
        }
      }
      continue;
    }

    if (remainingX < 0) continue;

    if (remainingX % b.x !== 0) continue;

    const nB = remainingX / b.x;

    if (nB < 0 || nB > maxPresses) continue;

    const totalY = nA * a.y + nB * b.y;
    if (totalY === prize.y) {
      const totalCost = nA * a.cost + nB * b.cost;
      if (optimal === null || totalCost < optimal.totalCost) {
        optimal = { totalCost };
      }
    }
  }

  return optimal;
};

const findOptimalPressesForShifted = ({ a, b, prize }) => {
  const determinant = a.x * b.y - a.y * b.x;
  if (determinant === 0) {
    const checkA = a.x * prize.y - a.y * prize.x;
    const checkB = b.x * prize.y - b.y * prize.x;

    if (checkA === 0 && checkB === 0) {
      let optimal = null;
      for (let nB = 0; nB <= prize.x / buttonB.x; nB++) {
        if (a.x === 0) {
          if (prize.x === b.x * nB) {
            const nA = 0;
            if (a.y * nA + b.y * nB === prize.y) {
              const totalCost = (nA * a.cost) + (nB * b.cost);
              if (optimal === null || totalCost < optimal.totalCost) {
                optimal = { nA, nB, totalCost };
              }
            }
          }
          continue;
        }

        const pXMinus_bXnB = prize.x - (b.x * nB);
        if (pXMinus_bXnB % a.x !== 0) continue;

        const nA = pXMinus_bXnB / a.x;

        if (nA < 0) continue;

        if (a.y * nA + b.y * nB === prize.y) {
          const totalCost = (nA * a.cost) + (nB * b.cost);
          if (optimal === null || totalCost < optimal.totalCost) {
            optimal = { totalCost };
          }
        }
      }
      return optimal;
    } else return null;
  };

  const numeratorA = prize.x * b.y - prize.y * b.x;
  const numeratorB = a.x * prize.y - a.y * prize.x;

  if (numeratorA % determinant !== 0 || numeratorB % determinant !== 0) {
    return null;
  }

  const nA = numeratorA / determinant;
  const nB = numeratorB / determinant;

  if (nA < 0 || nB < 0) {
    return null;
  }

  const totalCost = (nA * a.cost) + (nB * b.cost);

  return { totalCost };
};

const optimizeClawMachines = (machines, isShifted = false) => {
  let totalTokensSpent = 0;

  machines.forEach((machine) => {
    const solution = isShifted ? findOptimalPressesForShifted(machine) : findOptimalPresses(machine);
    if (solution !== null) {
      totalTokensSpent += solution.totalCost; 
    }
  });

  return totalTokensSpent;
};

const shiftPrizes = (machine) => {
  const shiftValue = 10000000000000;
  const { prize } = machine;
  return {
    ...machine,
    prize: {
      x: prize.x + shiftValue,
      y: prize.y + shiftValue,
    }
  };
};

const task = async () => {
  const input = await fetchInputByDay(13);
  const clawMachines = input.trim().split('\n\n').map(line => {
    const [buttonARules, buttonBRules, prizeRules] = line.split('\n');
    return {
      a: { ...parseRule(buttonARules, '+'), cost: 3 },
      b: { ...parseRule(buttonBRules, '+'), cost: 1 },
      prize: parseRule(prizeRules, '='),
    };
  });
  const result1 = optimizeClawMachines(clawMachines);
  const clawMachinesShifted = clawMachines.map(shiftPrizes);
  const result2 = optimizeClawMachines(clawMachinesShifted, true);

  console.log('13.1:', result1);
  console.log('13.2:', result2);
};

task();