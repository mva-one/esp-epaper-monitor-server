import express from 'express';
import puppeteer from 'puppeteer';
import ejs from 'ejs';
import fetch from 'node-fetch';

const app = express();
const router = express.Router();

const screen_data = {
  timestamp: '--:--:--',
  prod1: 0,
  prod2: 0,
  prod: 0,
  use: 0,
  grid: 0,
  aut: 0
}

setInterval(async () => {
  try {    
    // timestamp
    screen_data.timestamp = new Date().toLocaleString();
    
    // total use
    let r = await fetch('http://192.168.66.32:8080/rest/items/eigenverbrauch/state');
    screen_data.use = trimPower(await r.text());

    // total production
    r = await fetch('http://192.168.66.32:8080/rest/items/gSolarPower/state');
    screen_data.prod = trimPower(await r.text());

    // production east and south
    r = await fetch('http://192.168.66.32:8080/rest/items/inverter2ACWatt/state');
    screen_data.prod1 = trimPower(await r.text());

    // production west
    r = await fetch('http://192.168.66.32:8080/rest/items/inverter1ACWatt/state');
    screen_data.prod2 = trimPower(await r.text());

    // net grid power
    screen_data.grid = screen_data.use - screen_data.prod;

    // autarky
    // TODO

  } catch (error) {
    console.error('Error with read data from modbus! ' + error);
  }
}, 10000);

function trimPower (input) {
  return input.split('.')[0].split(' ')[0];
}

// serve requests from content in static directory
app.use(express.static('static'));

// set view engine and specify location of view files
app.set('views', './views');
app.set('view engine', 'ejs');

// tell the app to use the router
app.use('/', router);

router.get('/screen', async (req, res) => {
  res.render('screen', {data: screen_data});
});

router.get('/image', async (req, res) => {
  try {
    const imgBuffer = await htmlToImage(await getHtml());
    res.set('Content-Type', 'image/png');
    res.send(imgBuffer);
  } catch (error) {
    console.error('Error in router.get /image:: ' + error);
  }  
});

router.get('/', async (req, res) => {
    res.render('index', {data: screen_data});
});

const server = app.listen(3003, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

async function htmlToImage(html='') {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html);
  const content = await page.$('body');
  const imgBuffer = await content.screenshot();
  await page.close();
  await browser.close();

  return imgBuffer;
}

async function getHtml() {
  try {
    return await ejs.renderFile('views/screen.ejs', {data: screen_data});
  } catch (error) {
    console.error(error);
  }
}
