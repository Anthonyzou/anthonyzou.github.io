import pug from "pug";
import fs from "fs/promises";
import puppeteer from "puppeteer";
import jstransformer from "jstransformer";

import transformerScss from "jstransformer-scss";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const jstscss = jstransformer(transformerScss);

const htmFile = "anthonyou_temp.htm";

const locals = { jstscss };
const html = pug.compileFile("anthonyou.pug", locals)();

puppeteer.launch().then(async (browser) => {
  await fs.writeFile(htmFile, html);

  const page = await browser.newPage();
  await page.goto(`file://${__dirname}/${htmFile}`);
  await page.pdf({ path: "anthonyou.pdf" });
  await browser.close();
});
