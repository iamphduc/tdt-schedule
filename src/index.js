const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const getSchedule = require("./get-schedule");

app.get("/", async (req, res) => {
  const MSSV = req.query.mssv;
  const PASSWORD = req.query.pass;

  if (!MSSV || !PASSWORD) return res.sendStatus(404);

  const schedule = await getSchedule(MSSV, PASSWORD);

  res.json(schedule);
});

app.listen(port, () => {
  console.log(`App: http://localhost:${port}`);
});
