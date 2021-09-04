const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const LOGIN_URL = "https://stdportal.tdtu.edu.vn/Login/";

getScheduleList = async (MSSV, PASSWORD) => {
  let html = "";
  try {
    const browser = await puppeteer.launch({
      //executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      defaultViewport: { width: 1920, height: 1080 },
      // args: [
      //     '--no-sandbox',
      //     '--disable-setuid-sandbox',
      //     '--disable-dev-shm-usage',
      //     '--single-process'
      // ],
      headless: false,
    });

    const page = await browser.newPage();
    await page.goto(LOGIN_URL);

    // ===== LOGIN ===== //
    console.time("Login");
    await page.type("#txtUser", MSSV);
    await page.type("#txtPass", PASSWORD);
    await Promise.all([page.waitForNavigation(), page.click("#btnLogIn")]);
    console.timeEnd("Login");

    // ===== HOME ===== //
    console.time("Home");
    await Promise.all([
      page.waitForNavigation(),
      page.click(
        '#event > .container > .section-content > .row > .col-md-8 a[href="/main#daotao"]'
      ),
    ]);
    console.timeEnd("Home");

    // ===== SCHEDULE ===== //
    console.time("Schedule page");

    // this is for pop up
    const [schedule] = await Promise.all([
      new Promise((resolve) =>
        page.once("popup", async (p) => {
          // popup need headless false to work
          await p.waitForNavigation({ waitUntil: "networkidle0" });
          resolve(p);
        })
      ),
      page.click(
        '#sidebar > .sidebar-collapse > #side-menu > #daotao > .nav a[href="https://lichhoc-lichthi.tdtu.edu.vn/tkb2.aspx"]'
      ),
    ]);

    // this for headless true

    // await page.click('#sidebar > .sidebar-collapse > #side-menu > #daotao > .nav a[href="https://lichhoc-lichthi.tdtu.edu.vn/tkb2.aspx"]')

    // const getNewPageWhenLoaded =  async () => {
    //     return new Promise(x =>
    //         browser.on('targetcreated', async target => {
    //             if (target.type() === 'page') {
    //                 const newPage = await target.page();
    //                 const newPagePromise = new Promise(y =>
    //                     newPage.once('domcontentloaded', () => y(newPage))
    //                 );
    //                 const isPageLoaded = await newPage.evaluate(
    //                     () => document.readyState
    //                 );
    //                 return isPageLoaded.match('complete|interactive')
    //                     ? x(newPage)
    //                     : x(newPagePromise);
    //             }
    //         })
    //     );
    // };

    // const newPagePromise = getNewPageWhenLoaded();
    // const schedule = await newPagePromise;

    console.timeEnd("Schedule page");

    // ===== SELECT SEMESTER ===== //
    console.time("Select semester");
    await Promise.all([
      schedule.waitForNavigation(),
      await schedule.select("#ThoiKhoaBieu1_cboHocKy", "109"), // 109 la hoc ky he 2020-2021
    ]);
    console.timeEnd("Select semester");

    html = await schedule.content();

    //await schedule.screenshot({ path: 'example.png' });

    await browser.close();
  } catch (err) {
    console.error(err);
  }

  // ===== CHEERIO ===== //
  console.time("Cheerio");
  const subjectList = cheerioSchedule(html);
  console.timeEnd("Cheerio");

  return subjectList;
};

function cheerioSchedule(html) {
  const $ = cheerio.load(html);
  let table = $("#ThoiKhoaBieu1_tbTKBTheoTuan > tbody");
  let subjectList = [];

  table.find(".rowContent").each(function (i, ele) {
    let start = i + 1; // start period
    let dateIdx = 1;

    $(this)
      .find(".cell")
      .each(function (i, ele) {
        dateIdx++;

        if (!$(this).attr("rowspan")) return; // skip td has no subject

        let length = parseInt($(this).attr("rowspan"));
        let groupIdx = $(this).text().indexOf("Groups");
        let subGroupIdx = $(this).text().indexOf("Sub-group");
        let roomIdx = $(this).text().indexOf("Room:");

        let date = table
          .find(".Headerrow td:nth-child(" + dateIdx + ")")
          .text();

        subjectList.push({
          // date
          date:
            date.slice(0, dateIdx == 8 ? 9 : 6) + date.slice(-7, date.length),
          // subject
          subject: $(this).find("b").clone().children().remove().end().text(),
          // period
          period: Array(length)
            .fill()
            .map((_, i) => i + start)
            .join(","), // similar to python range
          // group
          group: $(this)
            .text()
            .substring(groupIdx + 8, groupIdx + 10)
            .replace(/[^0-9a-z]/gi, ""),
          // subgroup
          subGroup:
            subGroupIdx === -1
              ? "0"
              : $(this)
                  .text()
                  .substring(subGroupIdx + 11, subGroupIdx + 13)
                  .replace(/[^0-9a-z]/gi, ""),
          // room
          room: $(this)
            .text()
            .substring(roomIdx + 6)
            .replace(/[^0-9a-z]/gi, ""),
        });
      });
  });

  // sort by date
  subjectList.sort((a, b) => {
    if (a.date > b.date) return 1;
    if (a.date < b.date) return -1;
    return 0;
  });
}

module.exports = getScheduleList;
