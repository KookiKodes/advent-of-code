import getAdventInput from "../getAdventInput";
import * as path from "path";
import * as fs from "fs";

interface Input {
  target: string;
  range: number[];
  str: string;
}

interface Test {
  desc: string;
  value: number;
}

type Check = (value: Input) => boolean;

const parseAdventInput = (data: string): Input[] => {
  const input = data.split("\n").reduce((arr, value) => {
    const [strRange, strTarget, str] = value.split(" ");
    if (strRange && strTarget && str) {
      //Makes range an array of two numbers
      const range = strRange.split("-").map((val) => parseInt(val));

      //ensures the target value is the target letter to look for
      const target = strTarget.substring(0, 1);

      //pushes the data into the arr as an object with range, target and the str
      arr.push({ range, target, str });
    }
    return arr;
  }, []);
  return input as Input[];
};

const validPasswordBetweenRange = ({ target, range, str }: Input): boolean => {
  const [min, max] = range;

  //Init the counter at 1 which will store  the total iterations of the target within the provided str
  let targetCounter: number = 0;

  //loops through each character of the str and only increment the counter when a letter matches the target
  for (let char of str) if (char === target) targetCounter++;

  //If the counter is between the range then we will return true
  if (targetCounter <= max && min <= targetCounter) return true;

  return false;
};

const validPasswordOnRange = ({ target, range, str }: Input): boolean => {
  //Create a map to solely store the character at a given index.
  const map = {};
  const strLength = str.length;
  const [min, max] = range;

  // Need to start
  for (let i = 1; i <= strLength; i++) {
    if (i === min || i === max) {
      map[i] = str[i - 1];
    }
  }

  if (map[min] === target && map[max] !== target) return true;
  if (map[max] === target && map[min] !== target) return true;
  return false;
};

const totalPasswords = (input: Input[], check: Check): number => {
  return input.reduce((result, value) => {
    const valid = check(value);
    if (valid) result++;
    return result;
  }, 0);
};

// Can play around with the tests here to find different solutions
const getTests = (): Test[] => {
  const input = getAdventInput({
    day: 2,
    path: path.join(__dirname, "input.txt"),
    parse: parseAdventInput,
  });
  return [
    {
      desc: "Total number of valid passwords between given range",
      value: totalPasswords(input, validPasswordBetweenRange),
    },
    {
      desc: "Total number of valid passwords at a given string index",
      value: totalPasswords(input, validPasswordOnRange),
    },
  ];
};

const createOutputFile = (pathName: string, tests: Test[]): void => {
  const output = tests.reduce((str, test) => {
    str += `${test.desc}\nAnswer: ${test.value}\n\n\n`;
    return str;
  }, "");
  fs.writeFileSync(pathName, output);
};

createOutputFile(path.join(__dirname, "output.txt"), getTests());
