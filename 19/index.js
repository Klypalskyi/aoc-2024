const { fetchInputByDay } = require("../utils");

const parseInput = (input) => {
  const [rules, towels] = input.trim().split("\n\n");
  const parsedRules = rules.trim().split(',').map(rule => rule.trim());
  const parsedTowels = towels.trim().split('\n');
  return { rules: parsedRules, towels: parsedTowels };
};

const checkTowelForRules = (towel, rules) => {
  const towelLength = towel.length;
  const ways = new Array(towelLength + 1).fill(0);
  ways[0] = 1;

  for (let i = 0; i < towelLength; i++) {
    if (!ways[i]) continue;
    for (const rule of rules) {
      const len = rule.length;
      if (i + len <= towelLength && towel.substr(i, len) === rule) {
        ways[i + len] += ways[i];
      }
    }
  }
  return ways[towelLength];
}

const task = async () => {
  const input = await fetchInputByDay(19);
  const { rules, towels } = parseInput(input);
  let validTowels = 0;
  let waysCount = 0;

  towels.forEach(towel => {
    if (checkTowelForRules(towel, rules)) {
      validTowels++;
      waysCount += checkTowelForRules(towel, rules);
    }
  });

  console.log('19.1:', validTowels);
  console.log('19.2:', waysCount);
};

task();