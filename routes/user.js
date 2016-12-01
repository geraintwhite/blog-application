import express from 'express';
import UserAPI from '../lib/user';
import UserDB from '../db/user';
import pool from '../db/pool';


const userAPI = new UserAPI(new UserDB(pool));
const router = express.Router();


router.get('/new', (req, res) => {
  res.render('user/new', {title: 'Sign Up'});
});

router.post('/new', (req, res) => {
  userAPI.create(req.body, (code, data) => {
    if (code !== 200) {
      res.render('user/new', {title: 'Sign Up', form: req.body, err: data.err, errors: data.errors});
    } else {
      req.session.user = data.id;
      res.redirect('/');
    }
  });
});


export default router;
