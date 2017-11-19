const axios = require('axios');
const minimist = require('minimist');
const parser = require('./parser');
const visualizer = require('./visualizer');

const argv = minimist(process.argv.slice(2));
if (!argv.path && !argv.url) {
    console.log('Missing required parameter. Please provide `path` or `url`');
    return;
}

let domTree;
if (argv.path) {
    domTree = parser.parseFile(argv.path);
    visualizer.render(domTree);
} else {
    const url = argv.url.startsWith('http') ? argv.url : ('http://' + argv.url);

    axios.get(url).then(result => {
        domTree = parser.parseHtmlString(result.data);
        visualizer.render(domTree);
    });
}
