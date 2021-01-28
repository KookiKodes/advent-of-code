import {
  desc,
  run,
  task,
  makeDir,
  writeFile,
  sh,
} from "https://deno.land/x/drake@v1.4.6/mod.ts";
import * as path from "https://deno.land/std@0.84.0/path/mod.ts";
import { existsSync } from "https://deno.land/std@0.84.0/fs/mod.ts";
import * as Colors from "https://deno.land/std/fmt/colors.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

desc("Creates folder and files for a specified Advent problem");
const createAdventFile = task("create", [], function () {
  console.clear();
  const currentYear = new Date().getFullYear() - 1;
  let [day, year] = [0, 0];
  while (!day) {
    day = parseInt(
      prompt(Colors.green("Please enter a day from 1 - 31:\n")) as string
    );
    if (isNaN(day) || day < 1 || day > 31) {
      console.clear();
      day = 0;
    }
  }
  console.clear();
  while (!year) {
    year = parseInt(
      prompt(Colors.green("Please enter a year from 2015 - 2020:\n")) as string
    );
    if (isNaN(year) || year < 2015 || year > currentYear) {
      console.clear();
      year = 0;
    }
  }
  const pathDir = path.join(__dirname, `advent-${year}-${day}`);
  if (!existsSync(pathDir)) {
    makeDir(pathDir);
    writeFile(path.join(pathDir, "problem.ts"), "");
    writeFile(
      path.join(pathDir, "tests.ts"),
      `import * as path from "https://deno.land/std@0.84.0/path/mod.ts";\nimport {getAdventInput} from '../getAdventInput.ts';\nimport {problem, parseAdventInput} from './problem.ts';\n\nconst __dirname = path.dirname(path.fromFileUrl(import.meta.url));`
    );
  }
  console.clear();
  return [day, year, pathDir];
});

desc("Fetches input from Advent of Code as long as COOKIE env is set!");
task("fetch", [], async function () {
  const encoder = new TextEncoder();
  const action = createAdventFile.action as () => [number, number, string];
  const [day, year, pathDir] = action();
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const headers = new Headers();
  headers.set("cookie", config().COOKIE);
  const resp = await fetch(url, {
    method: "GET",
    headers,
  });
  console.clear();
  if (resp.ok) {
    const input = await resp.text();
    await Deno.writeFile(
      path.join(pathDir, "input.txt"),
      encoder.encode(input)
    );
    console.log(Colors.green("[Success]: ") + `Input fetched from ${url}`);
  } else {
    console.log(
      Colors.red("[Error]: ") +
        `Input could not be fetched from ${url}, please ensure you set COOKIE a .env file within your root dir`
    );
  }
});

desc("Generate output file with correct answers");
task("output", [], async function () {
  const action = createAdventFile.action as () => [number, number, string];
  const [, , pathDir] = action();

  if (existsSync(path.join(pathDir, "tests.ts"))) {
    let command = `deno run --allow-read --allow-write --unstable ${path.join(
      pathDir,
      "tests.ts"
    )}`;
    sh(command);
  }
});

run();
