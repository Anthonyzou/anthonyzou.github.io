import pug from "pug";
import fs from "fs/promises";

import puppeteer from "puppeteer";
import * as sass from "sass";
import { debounce } from "lodash-es";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { program } from "commander";

program.option("-w, --watch");

program.parse();

const ac = new AbortController();

const fn = async () => {
  const browser = await puppeteer.launch();
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const styling = sass.compile("./resume.scss");
  const htmFile = "index.html";

  const html = pug.renderFile("anthonyou.pug", {
    pretty: false,
    styling: styling.css,
  });
  await fs.writeFile(htmFile, html);

  const page = await browser.newPage();
  await page.goto(`file://${__dirname}/${htmFile}`);
  await page.pdf({ path: "anthonyou.pdf" });
  await browser.close();
};
const dfn = debounce(fn, 1000);

const options = program.opts();

if (options.watch) {
  // Start watching the file
  (async () => {
    console.log("watching", new Date());
    try {
      const watcher = fs.watch("./", { signal: ac.signal });

      for await (const event of watcher) {
        if (event.filename.match("pug|scss")) {
          console.log(`running ${new Date()}`);
          await dfn();
        }
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      throw err;
    }
  })();

  process.on("SIGINT", function () {
    console.log("sigint");
    ac.abort();
  });
} else {
  fn();
}
