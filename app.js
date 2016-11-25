import express from 'express';
import path from 'path';
import sass from 'node-sass-middleware';

import {
  ArticleRouter,
  AuthorRouter,
  TagRouter
} from './routes';


const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');

app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  outputStyle: 'compressed',
  response: true,
}));

app.use(ArticleRouter);
app.use(AuthorRouter);
app.use(TagRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(app.get('port'), () => {
  console.log('Server listening on port', app.get('port'));
});
