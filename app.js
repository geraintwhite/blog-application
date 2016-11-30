import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import sass from 'node-sass-middleware';

import ArticleRouter from './routes/article';
import AuthorRouter from './routes/author';
import TagRouter from './routes/tag';
import UserRouter from './routes/user';


const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: true}));
app.use(sass(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/article'));

app.use('/article', ArticleRouter);
app.use('/author', AuthorRouter);
app.use('/tag', TagRouter);
app.use('/user', UserRouter);

app.listen(app.get('port'), () => console.log('Server listening on port', app.get('port')));
