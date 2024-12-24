const { fetchInputByDay } = require("../utils");

const base = 2n;
const comboValue = (operand, A, B, C) => {
  const operandArray = [0n, 1n, base, 3n, A, B, C];
  return operandArray[operand];
};

const adv = (operand, A, B, C) => {
  const exponent = comboValue(operand, A, B, C);
  const divisor = base ** exponent;

  return A / divisor;
};
const bxl = (operand, B) => B ^ operand;
const bst = (operand, A, B, C) => comboValue(operand, A, B, C) % 8n;
const bxc = (B, C) => B ^ C;
const dv = (operand, A, B, C) => {
  const val = comboValue(operand, A, B, C);
  const divisor = base ** val;

  return A / divisor;
};

const runProgram = (initialA, initialB, initialC, program) => {
  let A = BigInt(initialA);
  let B = BigInt(initialB);
  let C = BigInt(initialC);

  let instructionPointer = 0n;
  const outputValues = [];
  const programLength = BigInt(program.length);

  while (instructionPointer < programLength) {
    const currentOpcode = program[Number(instructionPointer)];
    instructionPointer++;
    if (instructionPointer >= programLength) break;

    const currentOperand = BigInt(program[Number(instructionPointer)]);
    instructionPointer++;

    switch (currentOpcode) {
      case 0: {
        A = adv(currentOperand, A, B, C);
        break;
      }
      case 1: {
        B = bxl(currentOperand, B);
        break;
      }
      case 2: {
        B = bst(currentOperand, A, B, C);
        break;
      }
      case 3: {
        // jnz
        if (A !== 0n) {
          instructionPointer = currentOperand;
        }
        break;
      }
      case 4: {
        B = bxc(B, C);
        break;
      }
      case 5: {
        // out
        const val = comboValue(currentOperand, A, B, C);
        outputValues.push(val % 8n);
        break;
      }
      case 6: {
        B = dv(currentOperand, A, B, C);
        break;
      }
      case 7: {
        C = dv(currentOperand, A, B, C);
        break;
      }
      default: {
        break;
      }
    }
  }
  return outputValues;
};

const parseInput = (input) => {
  const registers = input.match(
    /Register A: (\d+)\nRegister B: (\d+)\nRegister C: (\d+)/
  );
  const program = input.match(/Program: ([\d,]+)/);

  return {
    A: parseInt(registers[1]),
    B: parseInt(registers[2]),
    C: parseInt(registers[3]),
    program: program[1].split(",").map((val) => parseInt(val)),
  };
};


const results = [];
const convertToOctal = (program) => BigInt("0o0" + program.join(""));
const reversedArraysEqual = (arrA, arrB) =>
  arrA.reduce(
    (acc, _, i) => acc && arrA[arrA.length - i - 1] === arrB[arrB.length - i - 1],
    1
  );
const buildSequence = (newProgram, programLength, program, registers) => {
  if (newProgram.length === programLength) {
    results.push(convertToOctal(newProgram));
    return;
  }

  for (let i = 7; i >= 0; i--) {
    const extendedSequence = newProgram.slice();
    extendedSequence.push(i);

    const resultBigIntArray = runProgram(
      convertToOctal(extendedSequence),
      BigInt(0),
      BigInt(0),
      program
    );
    const resultNumbers = resultBigIntArray.map(x => Number(x));

    if (reversedArraysEqual(resultNumbers, program)) {
      buildSequence(extendedSequence, programLength, program, registers);
    }
  }
};

const getLowestA = (A, B, C, program) => {
  const programLength = program.length;
  const registers = { A, B, C };
  buildSequence([], programLength, program, registers);
  return Number(results.sort((a, b) => Number(a) - Number(b))[0]);
};

const task = async () => {
  const input = await fetchInputByDay(17);
  const { A, B, C, program } = parseInput(input);
  const outputBigInts = runProgram(A, B, C, program);
  const task1 = outputBigInts.map((bigVal) => bigVal.toString()).join(",");
  const task2 = getLowestA(A, B, C, program);
  console.log("17.1:", task1);
  console.log("17.2:", task2);
};

task();
