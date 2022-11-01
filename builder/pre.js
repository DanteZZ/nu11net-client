const fs = require("fs");
const os = require("os");
const pjs = JSON.parse(fs.readFileSync("./package.json", "utf8"));

exports.checkTemporaty = function () {
  const dirs = ["./versions"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log(`Create "${dir}" directory`);
    }
  });
};

exports.getPlatform = () => {
  const plat = os.platform();
  if (plat == "linux") {
    if (os.arch() == "x64") {
      return plat + "64";
    } else {
      plat + "32";
    }
  } else {
    return plat;
  }
};

exports.nwinf = pjs.nw;
