#!/usr/bin/env node

const sade = require("sade");
const axios = require("axios");
const kleur = require("kleur");
const fs = require("fs");
const pck = require("./package.json");
const parser = require("./parser");
const visualizer = require("./visualizer");

(async () => {
  sade("html-size-visualizer [url|filePath]", true)
    .version(pck.version)
    .describe(
      "Visualize an HTML document as a tree and detect the biggest sub-trees"
    )
    .example("http://www.example.com")
    .example("./my-homepage.html")
    .action(async (arg) => {
      if (typeof arg === "undefined") {
        console.error(
          kleur.red(
            "Missing required argument, please provide a URL or a path to an HTML file"
          )
        );
        console.log(
          `To learn more run ${kleur.magenta("html-size-visualizer --help")}`
        );
        process.exit(1);
      }
      let html = null;
      if (arg.startsWith("http")) {
        try {
          const response = await axios.get(arg);
          html = response.data;
        } catch (err) {
          console.error(
            kleur.red(`Error trying to fetch html from ${kleur.magenta(arg)}`),
            err.message
          );
          process.exit(1);
        }
      } else if (fs.existsSync(arg)) {
        html = fs.readFileSync(arg, "utf-8");
      } else {
        console.error(
          kleur.red(`There is no file in path ${kleur.magenta(arg)}`)
        );
        process.exit(1);
      }
      const domTree = parser.parseHtmlString(html);
      visualizer.render(domTree);
    })
    .parse(process.argv);
})();
