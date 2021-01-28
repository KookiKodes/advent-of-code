import * as path from "https://deno.land/std@0.84.0/path/mod.ts";
import { getAdventInput } from "../getAdventInput.ts";
import { problem, parseAdventInput, Input, Output } from "./problem.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const getTests = (): Output[] => {
  const input = getAdventInput({
    day: 3,
    year: 2020,
    parse: parseAdventInput,
  });

  const tests: Input[] = [
    {
      input,
      right: 3,
      down: 1,
    },
    {
      input,
      right: 1,
      down: 1,
    },
    {
      input,
      right: 5,
      down: 1,
    },
    {
      input,
      right: 7,
      down: 1,
    },
    {
      input,
      right: 1,
      down: 2,
    },
  ];
  return tests.map((test) => {
    return {
      num: problem(test),
      right: test.right,
      down: test.down,
    };
  });
};

const createOutputFile = async (data: Output[]): void => {
  const encoder = new TextEncoder();
  const pathDir = path.join(__dirname, "output.txt");
  let product = 1;
  let output = data.reduce((result, info, index) => {
    product *= info.num;
    result += `\nTest ${index + 1}: If you go ${info.right} right and ${
      info.down
    } down you will come across ${info.num} trees.\n`;
    return result;
  }, ``);

  output += `\nThe product of all of these numbers is ${product}`;
  await Deno.writeFile(pathDir, encoder.encode(output));
};

createOutputFile(getTests());
