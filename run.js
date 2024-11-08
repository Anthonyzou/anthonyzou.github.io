const pug = require("pug");
const fs = require("fs/promises");
const puppeteer = require("puppeteer");
const jstscss = require("jstransformer")(require("jstransformer-scss"));

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
