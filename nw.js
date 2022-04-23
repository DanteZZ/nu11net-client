const fs = require('fs');
const os = require('os');
const NwBuilder = require('nw-builder');
const pjs = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const nwinf = pjs.nw;

const checkDirs = function() {
    const dirs = ['./versions']
    dirs.forEach((dir)=>{
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
            console.log(`Create "${dir}" directory`);
        }
    })
};

const getPlatform = () => {
    const plat = os.platform();
    if (plat == "linux") {
        if (os.arch() == "x64") {
            return plat+"64";
        } else {
            plat+"32";
        }
    } else {
        return plat;
    }
}

checkDirs();

if (process.argv.indexOf("--build") >= 0) { // IF BUILD
    var nw = new NwBuilder({
        files: __dirname+"/"+nwinf.dirName+"/**/**", // use the glob format
        buildDir: "./build",
        platforms: nwinf.platforms,
        version: nwinf.version,
        flavor: "normal",
        cacheDir: "./versions/",
        macIcns:"./assets/icon.icns",
        winIco:"./assets/icon.ico",
        zip:true
    });

    nw.build().then(function () {
        console.log('all done!');
    }).catch(function (error) {
        console.error(error);
    });
} else {
    var nw = new NwBuilder({
        files: __dirname+"/"+nwinf.dirName+"/**/**", // use the glob format
        platforms: [getPlatform()],
        version: nwinf.version,
        flavor: "sdk",
        cacheDir: "./versions/"
    });

    nw.run().then(function () {
        console.log('all done!');
    }).catch(function (error) {
        console.error(error);
    });
}