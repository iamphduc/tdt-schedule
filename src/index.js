const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const bodyParser = require('body-parser');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const verifyWebhook = require('./verify-webhook');
const getSchedule = require('./get-schedule');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ===== ROUTE ===== //

app.get('/webhook', verifyWebhook);

app.get('/', async function(req, res) {
    const MSSV = req.query.mssv;
    const PASSWORD = req.query.pass;

    if (!MSSV || !PASSWORD) {
        return res.send('<p style="font-size:28px;">https://tdt-schedule-puppeteer.herokuapp.com?mssv=&pass=</p>');
    }

    let schedule = await getSchedule(MSSV, PASSWORD);

    res.send(schedule);
})

app.listen(port, () => {
    console.log(`App: http://localhost:${port}`);
})
