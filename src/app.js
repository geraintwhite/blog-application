import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import sass from 'node-sass-middleware';
import session from 'express-session';
import moment from 'moment';

import {secret} from '../config';

import AuthRouter from './routes/auth';
import ArticleRouter from './routes/article';
import CommentRouter from './routes/comment';
import AuthorRouter from './routes/author';
import TagRouter from './routes/tag';
import UserRouter from './routes/user';


const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

app.locals.moment = moment;

app.use(session({resave: false, saveUninitialized: false, secret}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sass(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public')));

app.use(AuthRouter);

app.get('/', (req, res) => res.redirect('/article'));

app.use('/article', ArticleRouter);
app.use('/comment', CommentRouter);
app.use('/author', AuthorRouter);
app.use('/tag', TagRouter);
app.use('/user', UserRouter);

app.listen(app.get('port'), () => console.log('Server listening on port', app.get('port')));
