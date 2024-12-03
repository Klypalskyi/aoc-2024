const { fetchInputByDay } = require("../utils");

const regexRule = /mul\(\d{1,3},\d{1,3}\)/g;


const task1 = async () => {
  const input = await fetchInputByDay(3);
  const filtered = input.match(regexRule);
  const result = filtered.reduce((acc, item) => {
    const [a, b] = item.match(/\d{1,3}/g);
    return acc + a * b;
  }, 0);

  console.log(result)
};

task1();