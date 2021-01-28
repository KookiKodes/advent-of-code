import * as path from "https://deno.land/std@0.84.0/path/mod.ts";
import { getAdventInput } from "../getAdventInput.ts";
import { problem, parseAdventInput, EyeColor } from "./problem.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

/*
byr (Birth Year) - four digits; at least 1920 and at most 2002.
iyr (Issue Year) - four digits; at least 2010 and at most 2020.
eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
hgt (Height) - a number followed by either cm or in:
If cm, the number must be at least 150 and at most 193.
If in, the number must be at least 59 and at most 76.
hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
pid (Passport ID) - a nine-digit number, including leading zeroes.
cid (Country ID) - ignored, missing or not.
*/

const getTests = (): number[] => {
  const input = getAdventInput({
    day: 4,
    year: 2020,
    parse: parseAdventInput,
  });
  const checks = {
    byr: (data: string) => parseInt(data) >= 1920 && parseInt(data) <= 2002,
    iyr: (data: string) =>
      data.length === 4 && parseInt(data) >= 2010 && parseInt(data) <= 2020,
    eyr: (data: string) => parseInt(data) >= 2020 && parseInt(data) <= 2030,
    ecl: (data: string) => Object.values(EyeColor).includes(data as EyeColor),
    hgt: (data: string): boolean => {
      if (data.includes("cm")) {
        let num = parseInt(data.split("cm").join(""));
        return num >= 150 && num <= 193;
      }
      if (data.includes("in")) {
        const num = parseInt(data.split("in").join(""));
        return num >= 59 && num <= 76;
      }
      return false;
    },
    hcl: (data: string) => /^#[\da-f]{6}$/gi.test(data),
    pid: (data: string) => /^\d{9}[0]*$/g.test(data),
  };

  return [
    problem({
      input,
      requiredFields: ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"],
    }),
    problem({
      input,
      requiredFields: ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"],
      checks,
    }),
  ];
};

const createOutputFile = async (tests: number[]) => {
  const encoder = new TextEncoder();
  const pathDir = path.join(__dirname, "output.txt");
  const output = tests.reduce((str, num, index) => {
    str += `\nTest ${index}: The total number of valid passports is ${num}.\n\n`;
    return str;
  }, "");
  await Deno.writeFile(pathDir, encoder.encode(output));
};

createOutputFile(getTests());
