import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path'

interface Props {
  day: number | string;
  year?: number | string;
  parseInput?: (input: string) => string[];
  path?: string;
}

const cookie = '_ga=GA1.2.127502447.1610956228; _gid=GA1.2.286147976.1610956228; session=53616c7465645f5f449f4427c3247d1080d8d4ff5adf18c683a3d5a35bb208eec1a522928bbf9effc524e000d80ae9fa'

const fetchAdventInput = async (url: string, pathDir: string):Promise<void> => {
  const data = await fetch(url, {
      method: 'GET',
      headers: {
        cookie
      }
  })

  const dataText = await data.text();
  const dataArr = dataText.split('\n').join(',');
  fs.writeFile(pathDir, dataArr, (err) => {
    if (err) console.log('unsuccessful')
    else console.log('success!');
  })
}


const getAdventInput = (props: Props):string[] => {
  const year = props.year || '2020'
  const url = `https://adventofcode.com/${year}/day/${props.day}/input`
  const fileName = `advent-year-${year}-day-${props.day}.txt`
  let pathDir: string;

  if (!props.path) pathDir = path.join(__dirname, fileName);
  try {
      if (fs.existsSync(props.path || pathDir)) {
        const data = fs.readFileSync(props.path || pathDir, {encoding: 'utf8'});
        return data.split(',');
      }
      else {
          fetchAdventInput(url, props.path || pathDir)
      }
  } catch(err) {
      console.log(err);
  }
}

export default getAdventInput;
