import * as path from "https://deno.land/std@0.84.0/path/mod.ts";
import { existsSync } from "https://deno.land/std@0.84.0/fs/mod.ts";
import * as Colors from "https://deno.land/std/fmt/colors.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

export interface Props {
  day: number;
  year: number;
  parse(data: string): any;
}

export const getAdventInput = (args: Props): any => {
  const pathDir = path.join(
    __dirname,
    `advent-${args.year}-${args.day}`,
    "input.txt"
  );
  if (!existsSync(pathDir)) {
    throw new Error(
      Colors.red("[ERROR]: ") +
        `Please use the following command within your terminal: deno run -A --unstable tasksHandler.ts fetch`
    );
  }
  const data = Deno.readTextFileSync(pathDir);
  return args.parse(data);
};
