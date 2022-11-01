const webpack = require("webpack");
const io = require("socket.io")();
const NwBuilder = require("nw-builder");

const { nwinf, getPlatform, checkTemporaty } = require("./pre.js");

checkTemporaty();

exports.devServer = () => {
  let nwStarted = false;
  var nw = new NwBuilder({
    files: nwinf.dirName + "/**/**", // use the glob format
    platforms: [getPlatform()],
    version: nwinf.version,
    flavor: "sdk",
    cacheDir: "versions/",
  });
  console.log("Starting server...");
  io.listen(1234);
  console.log("Livereload is started!");

  const compiler = webpack(require("../webpack.config.js"));
  const watching = compiler.watch(
    {
      aggregateTimeout: 300,
      poll: undefined,
    },
    (err, stats) => {
      if (!err) {
        if (!nwStarted) {
          nw.run()
            .then(() => {
              watching.close();
              io.close();
            })
            .catch((e) => console.log("ERROR", e));
          nwStarted = true;
        }
        console.log("Reloading...");
        io.emit("updateBundle");
      }
    }
  );
};

exports.build = () => {
  var nw = new NwBuilder({
    files: nwinf.dirName + "/**/**", // use the glob format
    buildDir: "build",
    platforms: nwinf.platforms,
    version: nwinf.version,
    flavor: "normal",
    cacheDir: "versions/",
    macIcns: "assets/icon.icns",
    winIco: "assets/icon.ico",
    zip: true,
  });

  nw.build()
    .then(function () {
      console.log("all done!");
    })
    .catch(function (error) {
      console.error(error);
    });
};
