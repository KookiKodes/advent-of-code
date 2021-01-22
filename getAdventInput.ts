import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";
require("dotenv").config();

interface Props {
  day: number | string;
  parse: (input: string) => any;
  year?: number | string;
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
  fs.writeFile(pathDir, dataText, (err) => {
    if (err) console.log("unsuccessful");
    else console.log("success!");
  });
};

const getAdventInput = (props: Props) => {
  const year = props.year || "2020";
  const url = `https://adventofcode.com/${year}/day/${props.day}/input`;
  const fileName = `advent-year-${year}-day-${props.day}.txt`;
  let pathDir: string;

  if (!props.path) pathDir = path.join(__dirname, fileName);
  try {
    if (fs.existsSync(props.path || pathDir)) {
      const data = fs.readFileSync(props.path || pathDir, { encoding: "utf8" });
      return props.parse(data);
    } else {
      fetchAdventInput(url, props.path || pathDir);
    }
  } catch (err) {
    console.log(
      "Nothing is truly wrong, had to fetch data from Advent, please run again!"
    );
  }
};

export default getAdventInput;
