# TDT Schedule Puppeteer
This project is to use Puppeteer to get schedule from TDTU Student Portal.

## Usage
*Make sure your account running on new Student Portal (I didn't use old one).*

Create a ```.env``` and fill in the corresponding values.
```
MSSV=
PASS=
```

After running, data will be saved in ```/files```.

## Why did I do this project?
Puppeteer is a powerful crawler tool which can run full (non-headless) Chromium and generate screenshots, so I want to give it a try.

## Tool used
```Node v14.16.0``` and ```npm v6.14.11```, worth mentioning:
- puppeteer
- cheerio
- inquirer
