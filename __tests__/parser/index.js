const parser = require("../../parser");

describe("parser", () => {
  it("should parse the simple html file", () => {
    const filePath = process.cwd() + "/__tests__/parser/files/simple.html";

    const domTree = parser.parseFile(filePath);
    expect(domTree).toMatchSnapshot();
  });
});
