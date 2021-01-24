import getAdventInput from "../getAdventInput";
import * as path from "path";
import * as fs from "fs";

enum EyeColor {
  amber = "amb",
  blue = "blu",
  brown = "brn",
  gray = "gry",
  green = "grn",
  hazel = "hzl",
  other = "oth",
}

interface FieldObj {
  byr?: string;
  iyr?: string;
  eyr?: string;
  hgt?: string;
  hcl?: string;
  ecl?: string;
  pid?: string;
  cid?: string;
}

type Fields = "byr" | "iyr" | "eyr" | "hgt" | "hcl" | "ecl" | "pid" | "cid";
type Checks = {
  [key: string]: (value: string) => boolean;
};

interface Valid {
  passport: FieldObj;
  required: Fields[];
  checks?: Checks;
}

interface Input {
  requiredFields: Fields[];
  input: FieldObj[];
  checks?: Checks;
}

enum FieldName {
  BirthYear = "byr",
}

const parseAdventInput = (data: string): FieldObj[] =>
  data.split(/^\s*$(?:\r\n?|\n)/gm).map(
    (field) =>
      field.split(/\s|\n/gm).reduce((map, keyVal) => {
        if (keyVal) {
          const [key, val] = keyVal.split(":");
          map[key] = val;
        }
        return map;
      }, {}) as FieldObj
  );

const isValidPassport = ({ passport, required, checks }: Valid): boolean => {
  for (const field of required) {
    const value = passport[field];
    if (!value) return false;
    if (checks) {
      if (!checks[field](value)) return false;
    }
  }
  return true;
};

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

const checkValidPassports = ({
  input,
  requiredFields,
  checks,
}: Input): number => {
  return input.reduce((count, passport) => {
    if (isValidPassport({ passport, required: requiredFields, checks }))
      count++;
    return count;
  }, 0);
};

const getTests = (): number[] => {
  const input = getAdventInput({
    day: 4,
    path: path.join(__dirname, "input.txt"),
    parse: parseAdventInput,
  });

  const checks = {
    byr: (data) => parseInt(data) >= 1920 && parseInt(data) <= 2002,
    iyr: (data) =>
      data.length === 4 && parseInt(data) >= 2010 && parseInt(data) <= 2020,
    eyr: (data) => parseInt(data) >= 2020 && parseInt(data) <= 2030,
    ecl: (data) => Object.values(EyeColor).includes(data),
    hgt: (data) => {
      if (data.includes("cm")) {
        let num = parseInt(data.split("cm"));
        return num >= 150 && num <= 193;
      }
      if (data.includes("in")) {
        const num = parseInt(data.split("in"));
        return num >= 59 && num <= 76;
      }
      return false;
    },
    hcl: (data) => /^#[\da-f]{6}$/gi.test(data),
    pid: (data) => /^\d{9}[0]*$/g.test(data),
    cid: (data) => data,
  };

  return [
    checkValidPassports({
      input,
      requiredFields: ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"],
    }),
    checkValidPassports({
      input,
      requiredFields: ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"],
      checks,
    }),
  ];
};

const createOutputFile = (tests: number[]) => {
  const output = tests.reduce((str, num, index) => {
    str += `\nTest ${index}: The total number of valid passports is ${num}.\n\n`;
    return str;
  }, "");
  fs.writeFile(path.join(__dirname, "output.txt"), output, (err) => {
    if (err) console.log(err);
    else console.log("check output.txt");
  });
};

createOutputFile(getTests());
