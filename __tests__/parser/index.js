const { test } = require("uvu");
const assert = require("uvu/assert");
const parser = require("../../parser");

test("should parse the simple html file", () => {
  const filePath = process.cwd() + "/__tests__/parser/files/simple.html";

  const domTree = parser.parseFile(filePath);

  assert.equal(domTree, {
    nodeType: "tag",
    tagName: "html",
    attributes: {},
    estimatedSize: 220,
    children: [
      {
        nodeType: "tag",
        tagName: "head",
        attributes: {
          lang: "en",
        },
        estimatedSize: 122,
        children: [
          {
            nodeType: "tag",
            tagName: "title",
            attributes: {},
            estimatedSize: 26,
            children: [],
          },
          {
            nodeType: "tag",
            tagName: "meta",
            attributes: {
              name: "description",
              content: "This is a simple HTML document",
            },
            estimatedSize: 73,
            children: [],
          },
        ],
      },
      {
        nodeType: "tag",
        tagName: "body",
        attributes: {},
        estimatedSize: 85,
        children: [
          {
            nodeType: "tag",
            tagName: "h1",
            attributes: {},
            estimatedSize: 20,
            children: [],
          },
          {
            nodeType: "tag",
            tagName: "p",
            attributes: {},
            estimatedSize: 37,
            children: [],
          },
        ],
      },
    ],
  });
});

test.run();
