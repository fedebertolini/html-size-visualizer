const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const open = require('open');

exports.render = (data) =>
    readVisualizerFiles()
    .then(files => {
        const distPath = path.join(__dirname, '..', 'dist', `${Date.now()}.html`);
        const renderParams = {
            data: JSON.stringify(data),
            styles: files.styles,
            script: files.script,
        };
        const rendered = Mustache.render(files.template, renderParams);
        fs.writeFileSync(distPath, rendered, 'utf8');
        open(distPath, { wait: false });
    });

const readVisualizerFiles = () => {
    const templatePath = path.join(__dirname, 'template.mustache');
    const scriptPath = path.join(__dirname, 'script.js');
    const stylesPath = path.join(__dirname, 'styles.css');

    return Promise.all([
        readFile(templatePath),
        readFile(scriptPath),
        readFile(stylesPath),
    ])
    .then(result => ({
        template: result[0],
        script: result[1],
        styles: result[2],
    }));
};

const readFile = path => new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(data);
    });
});
