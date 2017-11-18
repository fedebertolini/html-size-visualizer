const fs = require('fs');
const parse5 = require('parse5');

exports.parseFile = (filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    const document = parse5.parse(file);
    const html = document.childNodes.find(node => node.nodeName === 'html');
    return {
        root: parseNode(html),
    };
};

const parseNode = (nodeData) => {
    switch(nodeData.nodeName) {
        case '#comment':
            return null;
        case '#text':
            return nodeData.value.trim() ? parseText(nodeData) : null;
        default:
            return parseTag(nodeData);
    }
};

const parseTag = (tagNode) => {
    const tag = {
        nodeType: 'tag',
        tagName: tagNode.tagName,
        attributes: {},
        estimatedSize: 0
    };
    tagNode.attrs.forEach((attr) => {
        tag.attributes[attr.name] = attr.value;
        tag.estimatedSize += attr.name.length + (attr.value || '').length + 4;
    });
    tag.children = tagNode.childNodes.map(parseNode).filter(n => n !== null);

    tag.estimatedSize += tag.children.reduce((size, node) => size + node.estimatedSize, 0);
    tag.estimatedSize += (tag.tagName.length * 2) + 5;

    return tag;
};

const parseText = (textNode) => {
    const text = {
        nodeType: 'text',
        textValue: textNode.value.trim(),
    };
    text.estimatedSize = text.textValue.length;
    return text;
};
