import express from 'express';
import ArticleAPI from '../lib/article';
import ArticleDB from '../db/article';
import pool from '../db/pool';


const article = new ArticleAPI(new ArticleDB(pool));
const router = express.Router();


router.get('/', (req, res) => {
  article.all((code, data) => {
    if (code !== 200) {
      res.render('error', {title: 'Error', message: data.err});
    } else {
      res.render('articles', {title: 'Latest Articles', articles: data.articles.slice(0, 10)});
    }
  });
});

router.get('/article/:id', (req, res) => {
  article.get(req.params.id, (code, data) => {
    if (code !== 200) {
      res.render('error', {title: 'Error', message: data.err});
    } else {
      res.render('article', {title: data.article.title, article: data.article});
    }
  });
});


export default router;
