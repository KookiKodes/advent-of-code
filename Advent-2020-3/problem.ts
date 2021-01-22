import getAdventInput from "../getAdventInput";
import * as path from "path";
import * as fs from "fs";

type Position = number[];

interface TravelInput {
  down: number;
  right: number;
  length: number;
  position: Position;
}

interface Input {
  right: number;
  down: number;
  input: string[];
}

interface Output {
  right: number;
  down: number;
  num: number;
}

type Tests = Input[];

const parseAdventInput = (data: string): string[] =>
  data.split("\n").filter((data) => typeof data === "string");

const move = ({ down, right, length, position }: TravelInput): Position => {
  let [x, y] = position;
  y += down;
  x = (x + right) % length;
  return [x, y];
};

function getNumOfTrees({ right, down, input }: Input): number {
  const inputLength = input.length;
  let count = 0;

  for (
    let position = [0, 0], length = input[position[0]].length;
    position[1] < inputLength;
    position = move({ right, down, length, position })
  ) {
    const [x, y] = position;
    if (input[y][x] === "#") count++;
  }

  return count;
}

const adventInput = getAdventInput({
  day: 3,
  path: path.join(__dirname, "input.txt"),
  parse: parseAdventInput,
});

const tests: Tests = [
  {
    input: adventInput,
    right: 3,
    down: 1,
  },
  {
    input: adventInput,
    right: 1,
    down: 1,
  },
  {
    input: adventInput,
    right: 5,
    down: 1,
  },
  {
    input: adventInput,
    right: 7,
    down: 1,
  },
  {
    input: adventInput,
    right: 1,
    down: 2,
  },
];

const probability = (tests: Tests): Output[] =>
  tests.map((test) => {
    return {
      num: getNumOfTrees(test),
      right: test.right,
      down: test.down,
    };
  });

const createOutputFile = (data: Output[]): void => {
  let product = 1;
  let output = data.reduce((result, info, index) => {
    product *= info.num;
    result += `\nTest ${index + 1}: If you go ${info.right} right and ${
      info.down
    } down you will come across ${info.num} trees.\n`;
    return result;
  }, ``);

  output += `\nThe product of all of these numbers is ${product}`;
  fs.writeFile(path.join(__dirname, "output.txt"), output, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("The output file has been created!");
    }
  });
};

createOutputFile(probability(tests));
