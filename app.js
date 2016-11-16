import express from 'express';
import path from 'path';
import sass from 'node-sass-middleware';


const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');

app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  outputStyle: 'compressed',
  response: true,
}));

app.get('/', (req, res) => {
  res.render('index', { title: 'Hello World!', message: 'My Site' });
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(app.get('port'), () => {
  console.log('Server listening on port', app.get('port'));
});
