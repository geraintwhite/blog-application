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

router.get('/new', isAuthor, (req, res) => {
  res.render('article/new', {title: 'New Article'});
});

router.post('/new', isAuthor, (req, res) => {
  const article = {
    author_id: res.locals.user.user_id,
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags ? req.body.tags.split(/,\s*/) : [],
  };

  articleAPI.create(article, (code, data) => {
    if (code !== 200) {
      res.render('article/new', {title: 'New Article', form: req.body, err: data.err, errors: data.errors});
    } else {
      res.redirect(`/article/${data.id}`);
    }
  });
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
