const input = require('./input.json');

const task1 = () => {
  const sortedLeftArray = input.left.sort((a, b) => a - b);
  const sortedRightArray = input.right.sort((a, b) => a - b);

  return sortedLeftArray.reduce((acc, leftVal, i) => {
    const rightVal = sortedRightArray[i];
    const diff = Math.abs(leftVal - rightVal);
    return acc + diff;
  }, 0);
}

const task2 = () => {
  const sortedLeftArray = input.left.sort((a, b) => a - b);
  const sortedRightArray = input.right.sort((a, b) => a - b);

  return sortedLeftArray.reduce((acc, leftVal) => {
    const repeatsInRight = sortedRightArray.filter(rightVal => rightVal === leftVal).length;
    const value = leftVal * repeatsInRight;
    return acc + value;
  }, 0);
};

console.log('1.1', task1());
console.log('1.2', task2());