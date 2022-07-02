import express from 'express';

const app = express();
const router = express.Router();

// serve requests from content in static directory
app.use(express.static('static'));

// set view engine and specify location of view files
app.set('views', './views');
app.set('view engine', 'pug');

// tell the app to use the router
app.use('/', router);

router.get('/', async (req, res) => {
    res.render('index', {title: 'Gctl ALPHA'});
});

router.get('/data', async (req, res) => {
    const response_json = {'power': 500, 'voltage': 24, 'weather': 'sunny'}
    res.json(response_json);
});

const server = app.listen(3001, () => {
  console.log(`Express is running on port ${server.address().port}`);
});