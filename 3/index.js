const { fetchInputByDay } = require("../utils");
const regexRule = /mul\(\d{1,3},\d{1,3}\)/g;

const accumulate = (arr) => arr.reduce((acc, item) => {
  const [a, b] = item.match(/\d{1,3}/g);
  return acc + a * b;
}, 0);

const task1 = async () => {
  const input = await fetchInputByDay(3);
  const filtered = input.match(regexRule);
  const result = accumulate(filtered)

  console.log('3.1', result);
};

const task2 = async () => {
  const input = await fetchInputByDay(3);
  const ignoreRegex = /don'?t\(\).*?do\(\)/gs;
  const relevantText = input.split(ignoreRegex).join("");

  const filtered = relevantText.match(regexRule);
  const result = accumulate(filtered)

  console.log('3.2', result);
};

task1();
task2();
