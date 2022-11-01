const nw = require("./nwbuild.js");

(async () => {
  if (process.argv.indexOf("--build") >= 0) {
    nw.build();
  } else {
    await nw.devServer();
  }
})();
