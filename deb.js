const fs = require('fs');
const fse = require('fs-extra');
const deb = require('debian-packaging');
const pjs = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const archs = ['linux64'];

const checkDirs = function() {
    console.log('Checking directories');
    const dirs = [
        './build',
        './build/deb',
        './build/deb/opt',
        './build/deb/usr',
        './build/deb/usr/share',
        './build/deb/usr/share/applications',
        './build/deb/usr/share/pixmaps'
    ]
    if (fs.existsSync(`./build/deb`)) {
        console.log(`Remove "./build/deb" directory`);
        fse.removeSync(`./build/deb`);
    };
    dirs.forEach((dir)=>{
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
            console.log(`Create "${dir}" directory`);
        }
    })
};

checkDirs();

const build = async function() {
    console.log("Building .deb files...");
    for (let k in archs) {
        let arch = archs[k];
        if (fs.existsSync(`./build/${pjs.name}/${arch}`)){
            console.log(`Starting making ${arch} package...`);
            console.log(`Copying game files...`);
            fse.copySync(`./build/${pjs.name}/${arch}`, `./build/deb/opt/${pjs.name}`);
            console.log(`Copying icons and desktop files...`);
            fse.copySync(`./assets/desktop.desktop`, `./build/deb/usr/share/applications/${pjs.name}.desktop`);
            fse.copySync(`./assets/icon.svg`, `./build/deb/usr/share/pixmaps/${pjs.name}.svg`);
            console.log(`Build files is copied`);
            try {
                console.log(`Creating .deb file...`);
                await deb.createPackage({
                    control: `./assets/control`,
                    data: './build/deb',
                    dest: `./build/${pjs.name}-${arch}.deb`
                });
                console.log(`Package "${pjs.name}-${arch}.deb" completed!`);
            } catch (e) {
                console.log(e);
                return;
            }
        } else {

        };
    };
};

build();