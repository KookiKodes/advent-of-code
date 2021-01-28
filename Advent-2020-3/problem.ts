type Position = number[];

interface TravelInput {
  down: number;
  right: number;
  length: number;
  position: Position;
}

export interface Input {
  right: number;
  down: number;
  input: string[];
}

export interface Output {
  right: number;
  down: number;
  num: number;
}

enum Tiles {
  tree = "#",
  open = ".",
}

export const parseAdventInput = (data: string): string[] =>
  data.split("\n").filter((data) => typeof data === "string");

const move = ({ down, right, length, position }: TravelInput): Position => {
  let [x, y] = position;
  y += down;
  x = (x + right) % length;
  return [x, y];
};

export function problem({ right, down, input }: Input): number {
  const inputLength = input.length;
  let count = 0;

  for (
    let position = [0, 0], length = input[position[0]].length;
    position[1] < inputLength;
    position = move({ right, down, length, position })
  ) {
    const [x, y] = position;
    if (input[y][x] === Tiles.tree) count++;
  }

  return count;
}
