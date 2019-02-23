const fs = require('fs');
const parse5 = require('parse5');

exports.parseFile = (filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    return exports.parseHtmlString(file);
};

exports.parseHtmlString = (htmlString) => {
    const document = parse5.parse(htmlString);
    const htmlElement = findNodeChild(document, 'html');
    return parseTag(htmlElement);
};

const findNodeChild = (element, nodeName) =>
    element.childNodes.find(node => node.nodeName === nodeName);

const parseTag = (tagNode) => {
    const tag = {
        nodeType: 'tag',
        tagName: tagNode.tagName,
        attributes: {},
        estimatedSize: 0,
        children: [],
    };
    tagNode.attrs.forEach((attr) => {
        tag.attributes[attr.name] = attr.value;
        tag.estimatedSize += attr.name.length + (attr.value || '').length + 4;
    });

    tagNode.childNodes.forEach(childNode => {
        if (childNode.nodeName === '#text') {
            const size = childNode.value.trim().length;
            tag.estimatedSize += size;
        } else if (childNode.nodeName !== '#comment') {
            tag.children.push(parseTag(childNode));
        }
    });

    tag.estimatedSize += tag.children.reduce((size, node) => size + node.estimatedSize, 0);
    tag.estimatedSize += (tag.tagName.length * 2) + 5;

    return tag;
};
