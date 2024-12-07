const { fetchInputByDay } = require("../utils");

const parseInputFromText = (text) => {
  const arr = text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const [value, rest] = line.split(': ');
      const numbers = rest.split(' ').map(Number);
      return { value: Number(value), numbers };
    });
  return arr;
};

function evaluateLeftToRight(expression) {
  const tokens = expression.split(' ');
  let result = parseInt(tokens[0], 10);

  for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const operand = parseInt(tokens[i + 1], 10);

      if (operator === '+') {
          result += operand;
      } else if (operator === '*') {
          result *= operand;
      } else if (operator === '||') {
          result = Number(`${result}${operand}`);
      }
  }

  // console.log(result);

  return result;
}

const recursiveExpressionCalculation = (numbers, operators, currentExpression = '', index = 0, results = []) => {
  if (index === numbers.length - 1) {
      const finalExpression = currentExpression + numbers[index];
      // console.log(finalExpression);
      results.push(evaluateLeftToRight(finalExpression)); // Evaluate and store the result
      return;
  }

  for (let operator of operators) {
      const newExpression = currentExpression + numbers[index] + ` ${operator} `;
      recursiveExpressionCalculation(numbers, operators, newExpression, index + 1, results);
  }
  // console.log(results);
  return results;
};

const findValidValues = (input, operators = ['+', '*']) => {
  const validValues = [];
  input.forEach(({ value, numbers }) => {
    const results = recursiveExpressionCalculation(numbers, operators);
    if (results.includes(value)) {
      validValues.push(value);
    }
  });
  return validValues.reduce((acc, curr) => acc + curr, 0);
}

const task1 = async () => {
  const input = await fetchInputByDay(7);
  const parsedInput = parseInputFromText(input);
  console.log('7.1', findValidValues(parsedInput));
  console.log('7.2', findValidValues(parsedInput, ['*','+', '||']));
};

task1();