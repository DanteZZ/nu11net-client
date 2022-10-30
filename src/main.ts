import { readdir } from "fs/promises";

const check = async () => {
  const list = await readdir("./");
  console.log(list);
};

check();
