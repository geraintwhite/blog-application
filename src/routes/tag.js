import express from 'express';
import TagAPI from '../lib/tag';
import TagDB from '../db/tag';
import pool from '../db/pool';


const tagAPI = new TagAPI(new TagDB(pool));
const router = express.Router();


router.get('/:id', (req, res) => {
  tagAPI.get(req.params.id, (code, data) => {
    if (code !== 200) {
      return res.render('error', {title: 'Error', message: data.err});
    }

    const tag = data.tag;

    tagAPI.getArticles(req.params.id, (code, data) => {
      if (code !== 200) {
        res.render('error', {title: 'Error', message: data.err});
      } else {
        res.render('article/all', {title: tag.name, articles: data.articles});
      }
    });
  });
});


export default router;
