const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

// const bodyParser = require('body-parser');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const verifyWebhook = require('./verify-webhook');
const getSchedule = require('./get-schedule');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ===== ROUTE ===== //

app.get('/webhook', (req, res) => {
    const TOKEN = 'chat-bot';

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token === TOKEN) {
        return res.status(200).send(challenge);
    }
        
    return res.sendStatus(403);
});



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
