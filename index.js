import puppeteer from "puppeteer";
import { writeFileSync } from "fs";

import { cheerioSchedule } from "./modules/cheerio.js";
import { prompt } from "./modules/inquirer.js";

const URL = {
  LOGIN: "https://stdportal.tdtu.edu.vn/Login/",
  SCHEDULE: "https://lichhoc-lichthi.tdtu.edu.vn/tkb2.aspx",
};
const PATH = {
  SCREENSHOT: "./screenshots/puppeteer.png",
  FILE: "./files/puppeteer.json",
};
const VIEW = { WIDTH: 1900, HEIGHT: 1080 };
const SEMESTER = "110"; // Check /files/_hockyID.txt

(async () => {
  try {
    const { headless, save } = await prompt();

    const browser = await puppeteer.launch({
      headless,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    // ===== LOGIN ===== //
    console.time("Login");
    await page.goto(URL.LOGIN);
    await page.type("#txtUser", process.env.MSSV);
    await page.type("#txtPass", process.env.PASS);
    await Promise.all([page.click("#btnLogIn"), page.waitForNavigation()]);
    console.timeEnd("Login");

    // ===== GOTO SCHEDULE PAGE ===== //
    console.time("Schedule page");
    await page.goto("https://lichhoc-lichthi.tdtu.edu.vn/tkb2.aspx");
    console.timeEnd("Schedule page");

    // ===== SELECT SEMESTER ===== //
    // console.time("Select semester");
    // await Promise.all([
    //   page.select("#ThoiKhoaBieu1_cboHocKy", SEMESTER),
    //   page.waitForNavigation(),
    // ]);
    // console.timeEnd("Select semester");

    // ===== SAVE DATA ===== //
    console.time("Save data");
    // Save as file .json
    if (save === 1 || save === 3) {
      const html = await page.content();
      const data = cheerioSchedule(html);
      writeFileSync(PATH.FILE, JSON.stringify(data));
      console.log(`Write file: "${PATH.FILE}"`);
    }
    // Take screenshot
    if (save === 2 || save === 3) {
      await page.setViewport({ width: VIEW.WIDTH, height: VIEW.HEIGHT });
      const element = await page.$("#ThoiKhoaBieu1_pnTKBTheoTuan");
      await element.screenshot({ path: PATH.SCREENSHOT });
      console.log(`Take screenshot: "${PATH.SCREENSHOT}"`);
    }
    console.timeEnd("Save data");

    browser.close();
  } catch (error) {
    console.log(error);
  }
})();
