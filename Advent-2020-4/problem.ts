export enum EyeColor {
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
  [key: string]: (data: string) => boolean;
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

interface MapObj {
  [key: string]: string;
}

export const parseAdventInput = (data: string): FieldObj[] =>
  data.split(/^\s*$(?:\r\n?|\n)/gm).map(
    (field) =>
      field.split(/\s|\n/gm).reduce((map: MapObj, keyVal) => {
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

export const problem = ({ input, requiredFields, checks }: Input): number => {
  return input.reduce((count, passport) => {
    if (isValidPassport({ passport, required: requiredFields, checks }))
      count++;
    return count;
  }, 0);
};
