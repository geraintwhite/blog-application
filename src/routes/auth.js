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
    res.render('login', {title: 'Log In'});
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

router.get('/reset', (req, res) => {
  if (req.session.user) {
    res.render('password/forgot', {title: 'Reset Password', email: res.locals.user.email});
  } else {
    res.render('password/forgot', {title: 'Reset Password'});
  }
});

router.post('/reset', (req, res) => {
  userAPI.getByEmail(req.body.email, (code, data) => {
    if (code !== 200) {
      return res.render('password/forgot', {title: 'Reset Password', email: req.body.email, err: data.err});
    }

    userAPI.sendResetCode(data.user.user_id, (code, data) => {
      if (code !== 200) {
        return res.render('password/forgot', {title: 'Reset Password', email: req.body.email, err: data.err});
      }

      console.log(code, data);

      const msg = 'Password reset email sent';
      res.render('password/forgot', {title: 'Reset Password', email: req.body.email, success: data.code});
    });
  });
});

router.get('/reset/:code', (req, res) => {
  res.render('password/reset', {title: 'Reset Password'});
});

router.post('/reset/:code', (req, res) => {
  userAPI.getByEmail(req.body.email, (code, data) => {
    if (code !== 200) {
      return res.render('password/reset', {title: 'Reset Password', form: req.body, err: data.err});
    }

    if (req.params.code !== data.user.reset_code) {
      const msg = 'Password reset code expired';
      return res.render('password/reset', {title: 'Reset Password', form: req.body, err: msg});
    }

    userAPI.resetPassword(data.user.user_id, req.body, (code, data) => {
      if (code !== 200) {
        return res.render('password/reset', {title: 'Reset Password', form: req.body, err: data.err, errors: data.errors});
      }

      req.session.destroy();
      res.redirect('/login');
    });
  });
});


export default router;
