import fs from "fs";
import { PNG } from "pngjs";

let newfile = new PNG({ width: 10, height: 10 });

const toBinary = (x: boolean) => (x ? 1 : 0);

console.log(newfile.width, newfile.height);

for (let y = 0; y < newfile.height; y++) {
  for (let x = 0; x < newfile.width; x++) {
    let idx = (newfile.width * y + x) << 2;

    const left = x < newfile.width >> 1;
    const right = y < newfile.height >> 1;
    const result = toBinary(left) ^ toBinary(right);
    let col = result === 1 ? 0xe5 : 0xff;

    if (y === 0 && x === 0) {
      newfile.data[idx] = 255;
      newfile.data[idx + 1] = 0;
      newfile.data[idx + 2] = 0;
    } else if (y === 0 && x === 1) {
      newfile.data[idx] = 0;
      newfile.data[idx + 1] = 0;
      newfile.data[idx + 2] = 0;
    } else {
      newfile.data[idx] = x % 2 === 0 ? 255 : 0;
      newfile.data[idx + 1] = 255;
      newfile.data[idx + 2] = x % 2 === 0 ? 255 : 0;
    }
    newfile.data[idx + 3] = 0xff;
  }
}

newfile
  .pack()
  .pipe(fs.createWriteStream(__dirname + "/newfile.png"))
  .on("finish", function () {
    console.log("Written!");
  });
