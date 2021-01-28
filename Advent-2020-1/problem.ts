interface TargetProducts {
  sum: number;
  input: number[];
  products?: number;
  result?: Result;
}

export type Result = {
  val: number;
  products: number[];
};

export function parseAdventInput(data: string): Result[] {
  return data.split("\n").reduce((result: any[], data) => {
    if (data) {
      const num = parseInt(data);
      result.push(num);
    }
    return result;
  }, [] as Result[]);
}

export const problem = ({
  input,
  sum,
  products = 2,
  result = { val: 1, products: [] },
}: TargetProducts): Result => {
  interface MapObj {
    [key: number]: number;
  }
  // Create a reference map
  const map: MapObj = {};

  //Generate the result
  result.val = input.reduce((acc, num, index) => {
    //Get new sum which is the sum minus current num
    const newSum = sum - num;

    //If it doesn't exist, add it to the map
    if (!map[num]) map[num] = index;

    //We need to use this for products over 2 -> Don't know if this works for products over 3
    if (products > 2) {
      //Create a new input to have one less input value to check;
      // const newInput = [...input.slice(0, index), ...input.slice(index + 1)];

      //This is the new product;
      const product = problem({
        input,
        sum: newSum,
        products: products - 1,
        result,
      });

      //Since our result is 1 we have to check for any number greater than 1
      if (product.val > 1) {
        acc = num * product.val;
        if (
          result.products.indexOf(num) < 0 &&
          result.products.length < products
        ) {
          result.products.push(num);
        }
      }
    } else {
      //This is how we find a product of 2 values
      if (map[newSum] >= 0) {
        acc *= num * newSum;
        if (
          result.products.indexOf(num) < 0 &&
          result.products.length < products
        )
          result.products.push(num);
        if (
          result.products.indexOf(newSum) < 0 &&
          result.products.length < products
        )
          result.products.push(newSum);
      }
    }

    return acc;
  }, 1);

  return result;
};
