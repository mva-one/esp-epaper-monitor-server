import express from 'express';

const app = express();
const router = express.Router();

const dummyData = {
  timestamp: '21:52:11',
  prod1: 500,
  prod2: 1500,
  prod: 2000,
  use: 3500,
  grid: 1500,
  aut: 57
}

// serve requests from content in static directory
app.use(express.static('static'));

// set view engine and specify location of view files
app.set('views', './views');
app.set('view engine', 'ejs');

// tell the app to use the router
app.use('/screen', router);

router.get('/', async (req, res) => {
    res.render('screen', {data: dummyData});
});

const server = app.listen(8080, () => {
  console.log(`Express is running on port ${server.address().port}`);
});