import express from 'express';
import puppeteer from 'puppeteer';
import ejs from 'ejs';

const app = express();
const router = express.Router();

const dummyData = {
  timestamp: '22:52:11',
  prod1: 250,
  prod2: 1500,
  prod: 1750,
  use: 1100,
  grid: -650,
  aut: 57
};

// serve requests from content in static directory
app.use(express.static('static'));

// set view engine and specify location of view files
app.set('views', './views');
app.set('view engine', 'ejs');

// tell the app to use the router
app.use('/', router);

router.get('/screen', async (req, res) => {
  const json_data = await getData();
  res.render('screen', {data: json_data});
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
    res.render('index', {data: dummyData});
});

const server = app.listen(3003, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

async function getData() {
  let d = dummyData;
  d.timestamp = new Date().toLocaleString();
  return d;
}

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
    const json_data = await getData();
    return await ejs.renderFile('views/screen.ejs', {data: json_data});
  } catch (error) {
    console.error(error);
  }
}
