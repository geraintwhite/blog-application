import express from 'express';
import CommentAPI from '../lib/comment';
import CommentDB from '../db/comment';
import pool from '../db/pool';

import {isLoggedIn} from '../lib/util/roles';


const commentAPI = new CommentAPI(new CommentDB(pool));
const router = express.Router();


router.post('/', isLoggedIn, (req, res) => {
  const comment = {
    user_id: req.session.user,
    article_id: req.body.article_id,
    text: req.body.text,
  };

  commentAPI.create(comment, (code, data) => {
    if (code !== 200) {
      req.session.err = data.err;
      req.session.comment = comment.text;
    }

    res.redirect(`/article/${comment.article_id}`);
  });
});


export default router;
