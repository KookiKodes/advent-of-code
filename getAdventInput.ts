import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";
require("dotenv").config();

interface Props {
  day: number | string;
  year?: number | string;
  parseInput?: (input: string) => string[];
  path?: string;
}

const cookie = process.env.COOKIE;

const fetchAdventInput = async (
  url: string,
  pathDir: string
): Promise<void> => {
  const data = await fetch(url, {
    method: "GET",
    headers: {
      cookie,
    },
  });

  const dataText = await data.text();
  const dataArr = dataText.split("\n").join(",");
  fs.writeFile(pathDir, dataArr, (err) => {
    if (err) console.log("unsuccessful");
    else console.log("success!");
  });
};

const getAdventInput = (props: Props): string[] => {
  const year = props.year || "2020";
  const url = `https://adventofcode.com/${year}/day/${props.day}/input`;
  const fileName = `advent-year-${year}-day-${props.day}.txt`;
  let pathDir: string;

  if (!props.path) pathDir = path.join(__dirname, fileName);
  try {
    if (fs.existsSync(props.path || pathDir)) {
      const data = fs.readFileSync(props.path || pathDir, { encoding: "utf8" });
      return [...data.split(",").slice(0, data.length - 1)];
    } else {
      fetchAdventInput(url, props.path || pathDir);
    }
  } catch (err) {
    console.log(err);
  }
};

export default getAdventInput;
