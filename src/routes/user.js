import express from 'express';
import bcrypt from 'bcrypt';
import UserAPI from '../lib/user';
import UserDB from '../db/user';
import pool from '../db/pool';

import {isLoggedIn} from '../lib/util/roles';


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

router.get('/:id/edit', isLoggedIn, (req, res) => {
  userAPI.get(req.params.id, (code, data) => {
    if (code !== 200) {
      return res.render('error', {title: 'Error', message: data.err});
    }

    if (data.user.user_id !== req.session.user) {
      return res.redirect('/');
    }

    res.render('user/edit', {title: 'Modify Personal Details', form: data.user});
  });
});

router.post('/:id/edit', isLoggedIn, (req, res) => {
  userAPI.get(req.params.id, (code, data) => {
    if (code !== 200) {
      return res.render('error', {title: 'Error', message: data.err});
    }

    if (data.user.user_id !== req.session.user) {
      return res.redirect('/');
    }

    if (!bcrypt.compareSync(req.body.password, data.user.password)) {
      return res.render('user/edit', {title: 'Modify Personal Details', form: req.body, err: 'Invalid password'});
    }

    const user = {
      name: req.body.name,
      email: req.body.email,
    };

    userAPI.update(req.params.id, user, (code, data) => {
      if (code !== 200) {
        res.render('user/edit', {title: 'Modify Personal Details', form: req.body, err: data.err});
      } else {
        res.redirect('/');
      }
    });
  });
});


export default router;
