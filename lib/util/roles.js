export const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

export const isAuthor = (req, res, next) => {
  if (req.session.user && res.locals.user.is_author) {
    next();
  } else {
    res.redirect('/');
  }
};

export const isAdmin = (req, res, next) => {
  if (req.session.user && res.locals.user.is_admin) {
    next();
  } else {
    res.redirect('/');
  }
};
