import express from 'express';


const router = express.Router();


router.get('/new', (req, res) => {
  res.render('new-user', {title: 'Sign Up'});
});

router.post('/new', (req, res) => {
  res.send(req.body);
});


export default router;
