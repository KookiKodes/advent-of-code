import getAdventInput from "../getAdventInput";
import * as path from "path";

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

const parseAdventInput = (): Input[] => {
  const data = getAdventInput({
    day: 2,
    path: path.join(__dirname, "input.txt"),
  });
  const input = data.reduce((arr, value) => {
    const [strRange, strTarget, str] = value.split(" ");
    if (strRange && strTarget && str) {
      const range = strRange.split("-").map((val) => parseInt(val));
      const target = strTarget.substring(0, 1);
      arr.push({ range, target, str });
    }
    return arr;
  }, []);
  return input as Input[];
};

const validPasswordBetweenRange = ({ target, range, str }: Input): boolean => {
  const [min, max] = range;
  let targetCounter: number = 0;

  for (let char of str) {
    if (char === target) targetCounter++;
  }

  if (targetCounter <= max && min <= targetCounter) {
    return true;
  }
  return false;
};

const validPasswordOnRange = ({ target, range, str }: Input): boolean => {
  const map = {};
  const strLength = str.length;
  const [min, max] = range;

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
  const input = parseAdventInput();
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
