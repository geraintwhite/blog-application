import express from 'express';
import ArticleAPI from '../lib/article';
import ArticleDB from '../db/article';
import pool from '../db/pool';


const articleAPI = new ArticleAPI(new ArticleDB(pool));
const router = express.Router();


router.get('/', (req, res) => {
  articleAPI.all((code, data) => {
    if (code !== 200) {
      res.render('error', {title: 'Error', message: data.err});
    } else {
      res.render('articles', {title: 'Latest Articles', articles: data.articles.slice(0, 10)});
    }
  });
});

router.get('/new', (req, res) => {
  res.render('new-article', {title: 'New Article'});
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
        res.render('article', {title: article.title, article: article, comments: data.comments});
      }
    });
  });
});


export default router;
