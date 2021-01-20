import getAdventInput from '../getAdventInput';
import * as path from 'path';
import * as fs from 'fs';

interface TargetProducts {
  sum: number;
  input: number[];
  products: number;
  result?: Result
}

type Result = {
  val: number;
  products: number[];
}

const calcTargetProduct = ({input, sum, products, result={val: 1, products: []}}: TargetProducts): Result => {
  // Create a reference map
  const map = {};

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
      const product = calcTargetProduct({input, sum: newSum, products: products - 1, result})

      //Since our result is 1 we have to check for any number greater than 1
      if (product.val > 1) {
        acc = num * product.val;
        if (result.products.indexOf(num) < 0 && result.products.length < products) {
          result.products.push(num);
        }
      }
    } else {

      //This is how we find a product of 2 values
      if (map[newSum] >= 0) {
        acc *= num * newSum;
        if (result.products.indexOf(num) < 0 && result.products.length < products) result.products.push(num);
        if (result.products.indexOf(newSum) < 0 && result.products.length < products) result.products.push(newSum);
      }
    }

    return acc;
  }, 1)

  return result;
}


const find2020Product = (sum: number, products: number = 2):Result => {

  //Get's string input from advent website;
  const strInput =  getAdventInput({day: 1, path: path.join(__dirname, 'input.txt')})

  //Converts input to numbers and make's sure there are no NAN values
  const input = strInput.map((item) => parseInt(item)).filter((val) => !isNaN(val));

  //Get result;
  const result = calcTargetProduct({sum, input, products});
  return result;
}

const createOutputFile = (pathName:string, data:{title: string; value: Result}[]) => {
    const result = data.reduce((str, ans) => {
        return str += `\n\n\n${ans.title}\nAnswer: ${ans.value.val}\nNumbers: ${ans.value.products}`
    }, '')
    fs.writeFile(pathName, result, (err) => {
      if (err) console.log(err)
      else console.log('success');
    });
}

createOutputFile(
  path.join(__dirname, 'output.txt'),
  [
    {title: 'This is for 2 Products', value: find2020Product(2020)},
    {title: 'This is for 3 Products', value: find2020Product(2020, 3)},
    {title: 'This is for 4 Products', value: find2020Product(2020, 4)},
    // {title: 'This is for 5 Products', value: find2020Product(2020, 5)}
  ]
)
