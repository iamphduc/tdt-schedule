
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const getSchedule = require('./get-schedule');


app.get('/', async function(req, res) {
    const MSSV = req.query.mssv;
    const PASSWORD = req.query.pass;

    if (!MSSV || !PASSWORD) {
        return res.send('<p style="font-size:24px;">?mssv=&pass=</p>');
    }

    let schedule = await getSchedule(MSSV, PASSWORD);

    res.send(schedule);
})

app.listen(port, () => {
    console.log(`App: http://localhost:${port}`);
})
