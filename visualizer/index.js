const Mustache = require('mustache');
const fs = require('fs');
const opn = require('opn');

exports.render = (data) =>
    readVisualizerFiles()
    .then(files => {
        const distPath = process.cwd() + '/dist/' + (new Date).getTime() + '.html';
        const renderParams = {
            data: JSON.stringify(data),
            styles: files.styles,
            script: files.script,
        };
        const rendered = Mustache.render(files.template, renderParams);
        fs.writeFileSync(distPath, rendered, 'utf8');
        opn(distPath, { wait: false });
    });

const readVisualizerFiles = () => {
    const templatePath = process.cwd() + '/visualizer/template.mustache';
    const scriptPath = process.cwd() + '/visualizer/script.js';
    const stylesPath = process.cwd() + '/visualizer/styles.css';

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
