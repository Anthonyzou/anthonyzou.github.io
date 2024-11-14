import pug from "pug";
import fs from "fs/promises";
import puppeteer from "puppeteer";
import * as sass from "sass";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

puppeteer.launch().then(async (browser) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const styling = sass.compile("./resume.scss");
  const htmFile = "anthonyou_temp.htm";

  const html = pug.renderFile("anthonyou.pug", {
    pretty: false,
    styling: styling.css,
  });
  await fs.writeFile(htmFile, html);

  const page = await browser.newPage();
  await page.goto(`file://${__dirname}/${htmFile}`);
  await page.pdf({ path: "anthonyou.pdf" });
  await browser.close();
});
