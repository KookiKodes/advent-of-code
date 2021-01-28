import * as path from "https://deno.land/std@0.84.0/path/mod.ts";
import { getAdventInput } from "../getAdventInput.ts";
import { problem, parseAdventInput, Result } from "./problem.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

interface Output {
  title: string;
  value: Result;
}

const getTests = (): Output[] => {
  const input = getAdventInput({
    day: 1,
    year: 2020,
    parse: parseAdventInput,
  });
  return [
    { title: "This is for 2 Products", value: problem({ input, sum: 2020 }) },
    {
      title: "This is for 3 Products",
      value: problem({ input, sum: 2020, products: 3 }),
    },
    {
      title: "This is for 4 Products",
      value: problem({ input, sum: 2020, products: 4 }),
    },
  ];
};

const createOutputFile = async (pathName: string) => {
  const encoder = new TextEncoder();
  const input = getTests();
  const result: string = input.reduce((str: string, ans) => {
    return (str += `${ans.title}\nAnswer: ${ans.value.val}\nNumbers: ${ans.value.products}\n\n\n`);
  }, "");
  await Deno.writeFile(pathName, encoder.encode(result));
};

createOutputFile(path.join(__dirname, "output.txt"));
