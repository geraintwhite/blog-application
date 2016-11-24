import express from 'express';
import ArticleAPI from '../lib/article';
import ArticleDB from '../db/article';
import pool from '../db/pool';


const article = new ArticleAPI(new ArticleDB(pool));
const router = express.Router();


router.get('/', (req, res) => {
  article.all((code, data) => {
    if (code === 500) {
      res.render('error', {title: 'Error', message: data.err});
    } else {
      res.render('articles', {title: 'Latest Articles', articles: data.articles.slice(0, 10)});
    }
  });
});


export default router;
