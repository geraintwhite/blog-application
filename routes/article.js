import express from 'express';
import ArticleAPI from '../lib/article';
import ArticleDB from '../db/article';
import pool from '../db/pool';

import {isAuthor} from '../lib/util/roles';


const articleAPI = new ArticleAPI(new ArticleDB(pool));
const router = express.Router();


router.get('/', (req, res) => {
  articleAPI.all((code, data) => {
    if (code !== 200) {
      res.render('error', {title: 'Error', message: data.err});
    } else {
      res.render('article/all', {title: 'Latest Articles', articles: data.articles.slice(0, 10)});
    }
  });
});

router.get('/new', (req, res) => {
  res.render('article/new', {title: 'New Article'});
});

router.post('/new', (req, res) => {
  res.send(req.body);
});

router.get('/:id', (req, res) => {
  articleAPI.get(req.params.id, (code, data) => {
    if (code !== 200) {
      return res.render('error', {title: 'Error', message: data.err});
    }

    const article = data.article;

    articleAPI.getComments(req.params.id, (code, data) => {
      if (code !== 200) {
        res.render('error', {title: 'Error', message: data.err});
      } else {
        res.render('article/show', {title: article.title, article: article, comments: data.comments});
      }
    });
  });
});


export default router;
