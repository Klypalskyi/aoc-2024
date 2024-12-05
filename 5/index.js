const { fetchInputByDay } = require("../utils");

const splitInputByEmptyLine = (text) => text.split("\n\n");
const takeTheMiddleIndexFromArray = (arr) => arr[Math.floor(arr.length / 2)];

const findValidData = (rules, data) => {
  let isValid = true;
  const relatedRules = data.flatMap(number => rules.filter(rule => rule[0] === number));
  relatedRules.forEach(([first, second], i) => {
    const firstIndex = data.indexOf(first);
    const secondIndex = data.indexOf(second);

    if (firstIndex > secondIndex && secondIndex !== -1) {
      isValid = false;
    }
  });

  return isValid;
};

const updateDataAccordingToRules = (rules, data) => {
  const graph = new Map();
  const inDegree = new Map();

  data.forEach((number) => {
    graph.set(number, []);
    inDegree.set(number, 0);
  });

  rules.forEach(([first, second]) => {
    if (data.includes(first) && data.includes(second)) {
      graph.get(first).push(second);
      inDegree.set(second, inDegree.get(second) + 1);
    }
  });

  const queue = [];
  const visited = new Set();

  const visitNumber = (number) => {
    if (inDegree.get(number) === 0 && !visited.has(number)) {
      queue.push(number);
      visited.add(number);
    }
  }

  data.forEach((number) => {
    visitNumber(number);
  });

  const sortedData = [];

  while (queue.length > 0) {
    const node = queue.shift();
    sortedData.push(node);

    graph.get(node).forEach((neighbor) => {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      visitNumber(neighbor);
    });
  }

  return sortedData;
};

const getCommonData = async () => {
  const input = await fetchInputByDay(5);
  const [rules, data] = splitInputByEmptyLine(input);
  const rulesArray = rules.split("\n").map((rule) => rule.split("|").map(Number));
  const dataArrays = data.split("\n").map((data) => data.split(",").map(Number));
  return [rulesArray, dataArrays];
}

const task1 = async () => {
  const [rules, data] = await getCommonData();
  const filteredData = data.filter((arr) => findValidData(rules, arr));
  const result = filteredData.reduce((acc, arr) => acc + takeTheMiddleIndexFromArray(arr), 0);
  console.log('5.1', result);
};

const task2 = async () => {
  const [rules, data] = await getCommonData();
  const filteredData = data.filter((arr) => !findValidData(rules, arr));
  const updatedData = filteredData.map((data) => updateDataAccordingToRules(rules, data));
  const result = updatedData.reduce((acc, data) => acc + takeTheMiddleIndexFromArray(data), 0);
  console.log('5.2', result);
};

task1();
task2();