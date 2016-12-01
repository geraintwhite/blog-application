import express from 'express';
import bcrypt from 'bcrypt';
import UserAPI from '../lib/user';
import UserDB from '../db/user';
import pool from '../db/pool';


const userAPI = new UserAPI(new UserDB(pool));
const router = express.Router();


router.use((req, res, next) => {
  userAPI.get(req.session.user, (code, data) => {
    if (code === 200) {
      res.locals.user = data.user;
    }

    next();
  });
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

router.post('/login', (req, res) => {
  userAPI.getByEmail(req.body.email, (code, data) => {
    if (code !== 200) {
      res.render('login', {title: 'Log In', form: req.body, err: data.err});
    } else if (!bcrypt.compareSync(req.body.password, data.user.password)) {
      res.render('login', {title: 'Log In', form: req.body, err: 'Invalid password'});
    } else {
      req.session.user = data.user.user_id;
      res.redirect('/');
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


export default router;
