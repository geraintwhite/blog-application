import express from 'express';
import AuthorAPI from '../lib/author';
import AuthorDB from '../db/author';
import pool from '../db/pool';


const authorAPI = new AuthorAPI(new AuthorDB(pool));
const router = express.Router();


router.get('/:id', (req, res) => {
  authorAPI.get(req.params.id, (code, data) => {
    if (code !== 200) {
      return res.render('error', {title: 'Error', message: data.err});
    }

    const author = data.author;

    authorAPI.getArticles(req.params.id, (code, data) => {
      if (code !== 200) {
        res.render('error', {title: 'Error', message: data.err});
      } else {
        res.render('articles', {title: author.name, articles: data.articles});
      }
    });
  });
});


export default router;
