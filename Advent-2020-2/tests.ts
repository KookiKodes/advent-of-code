import * as path from "https://deno.land/std@0.84.0/path/mod.ts";
import { getAdventInput } from "../getAdventInput.ts";
import {
  problem,
  validPasswordBetweenRange,
  validPasswordOnRange,
  parseAdventInput,
  Test,
} from "./problem.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

const getTests = (): Test[] => {
  const input = getAdventInput({
    day: 2,
    year: 2020,
    parse: parseAdventInput,
  });
  return [
    {
      desc: "Total number of valid passwords between given range",
      value: problem(input, validPasswordBetweenRange),
    },
    {
      desc: "Total number of valid passwords at a given string index",
      value: problem(input, validPasswordOnRange),
    },
  ];
};

const createOutputFile = async (
  pathName: string,
  tests: Test[]
): Promise<void> => {
  const encoder = new TextEncoder();
  const output = tests.reduce((str, test) => {
    str += `${test.desc}\nAnswer: ${test.value}\n\n\n`;
    return str;
  }, "");
  await Deno.writeFile(pathName, encoder.encode(output));
};

createOutputFile(path.join(__dirname, "output.txt"), getTests());
