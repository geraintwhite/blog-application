import ArticleAPI from '../lib/article';


const tests = (t) => {
  t.test('article.all error', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(3);

    db.getArticles = (cb) => {
      st.pass('db.getArticles is called');
      cb({code: 'ER_ERROR'}, null);
    };

    api.all((code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('article.all no articles', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(3);

    db.getArticles = (cb) => {
      st.pass('db.getArticles is called');
      cb(null, []);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.equal(data.articles.length, 0, 'empty articles array');
      st.end();
    });
  });

  t.test('article.all success', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const articles = [{id: 1, author_id: 20, title: 'Some title', content: 'Lorem Ipsum Dolor', tags: [{id: 7, name: 'truth'}, {id: 15, name: 'cool'}]},
                      {id: 2, author_id: 6, title: 'STUFF', content: 'THIS IS SO COOL', tags: []},
                      {id: 3, author_id: 20, title: 'Some title 2', content: 'Very serious text', tags: [{id: 7, name: 'truth'}]}];

    st.plan(3);

    db.getArticles = (cb) => {
      st.pass('db.getArticles is called');
      cb(null, articles);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.articles, articles, 'correct articles array');
      st.end();
    });
  });

  t.test('article.get error', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(4);

    db.getArticle = (id, cb) => {
      st.pass('db.getArticle is called');
      st.equal(id, 1, 'correct article ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct arror message');
      st.end();
    });
  });

  t.test('article.get invalid article ID', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(2);

    db.getArticle = (id, cb) => {
      st.fail('db.getArticle should not be called');
      st.end();
    };

    api.get(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid article ID', 'correct arror message');
      st.end();
    });
  });

  t.test('article.get article not found', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(4);

    db.getArticle = (id, cb) => {
      st.pass('db.getArticle is called');
      st.equal(id, 1, 'correct article ID');
      cb(null, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Article not found', 'correct arror message');
      st.end();
    });
  });

  t.test('article.get success', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {id: 1, author_id: 20, title: 'Some title', content: 'Lorem Ipsum Dolor', tags: [{id: 7, name: 'truth'}, {id: 15, name: 'cool'}]};

    st.plan(4);

    db.getArticle = (id, cb) => {
      st.pass('db.getArticle is called');
      st.equal(id, 1, 'correct article ID');
      cb(null, article);
    };

    api.get(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.article, article, 'correct article object');
      st.end();
    });
  });

  t.test('article.create error', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {author_id: 20, title: 'Some title', content: 'Lorem Ipsum Dolor', tags: ['truth', 'cool']};

    st.plan(4);

    db.createArticle = (obj, cb) => {
      st.pass('db.createArticle is called');
      st.deepEqual(obj, article, 'correct article object');
      cb({code: 'ER_ERROR'}, null);
    };

    db.tagArticle = (article_id, tag_name) => {
      st.fail('db.tagArticle should not be called');
      st.end();
    };

    api.create(article, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('article.create empty object', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {};

    st.plan(2);

    db.createArticle = (obj, cb) => {
      st.fail('db.createArticle should not be called');
      st.end();
    };

    db.tagArticle = (article_id, tag_name) => {
      st.fail('db.tagArticle should not be called');
      st.end();
    };

    api.create(article, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid article object', 'correct error message');
      st.end();
    });
  });

  t.test('article.create invalid author ID', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {author_id: 'FRED', title: 'Some title', content: 'Lorem Ipsum Dolor', tags: ['truth', 'cool']};

    st.plan(2);

    db.createArticle = (obj, cb) => {
      st.fail('db.createArticle should not be called');
      st.end();
    };

    db.tagArticle = (article_id, tag_name) => {
      st.fail('db.tagArticle should not be called');
      st.end();
    };

    api.create(article, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid article object', 'correct error message');
      st.end();
    });
  });

  t.test('article.create invalid tags', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {author_id: 20, title: 'Some title', content: 'Lorem Ipsum Dolor', tags: 'BADTAGS'};

    st.plan(2);

    db.createArticle = (obj, cb) => {
      st.fail('db.createArticle should not be called');
      st.end();
    };

    db.tagArticle = (article_id, tag_name) => {
      st.fail('db.tagArticle should not be called');
      st.end();
    };

    api.create(article, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid article object', 'correct error message');
      st.end();
    });
  });

  t.test('article.create success', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {author_id: 20, title: 'Some title', content: 'Lorem Ipsum Dolor', tags: ['truth', 'cool']};

    st.plan(10);

    db.createArticle = (obj, cb) => {
      st.pass('db.createArticle is called');
      st.deepEqual(obj, article, 'correct article object');
      cb(null, 1);
    };

    db.tagArticle = (article_id, tag_name) => {
      st.pass('db.tagArticle is called');
      st.equal(article_id, 1, 'correct article ID');
      st.ok(article.tags.indexOf(tag_name) > -1, 'correct tag name');
    };

    api.create(article, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.equal(data.id, 1, 'correct article ID');
      st.end();
    });
  });

  t.test('article.update error', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {title: 'SOME TITLE', content: 'Lorem Ipsum Dolor', tags: ['nothing', 'something']};

    st.plan(5);

    db.updateArticle = (id, obj, cb) => {
      st.pass('db.updateArticle is called');
      st.equal(id, 1, 'correct article ID');
      st.deepEqual(obj, article, 'correct article object');
      cb({code: 'ER_ERROR'}, null);
    };

    db.tagArticle = (article_id, tag_name) => {
      st.fail('db.tagArticle should not be called');
      st.end();
    };

    db.removeTags = (article_id) => {
      st.fail('db.removeTags should not be called');
      st.end();
    };

    api.update(1, article, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('article.update invalid article ID', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {title: 'SOME TITLE', content: 'Lorem Ipsum Dolor', tags: ['nothing', 'something']};

    st.plan(2);

    db.updateArticle = (id, obj, cb) => {
      st.fail('db.updateArticle should not be called');
      st.end();
    };

    db.tagArticle = (article_id, tag_name) => {
      st.fail('db.tagArticle should not be called');
      st.end();
    };

    db.removeTags = (article_id) => {
      st.fail('db.removeTags should not be called');
      st.end();
    };

    api.update(null, article, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid article ID', 'correct error message');
      st.end();
    });
  });

  t.test('article.update empty object', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {};

    st.plan(2);

    db.updateArticle = (id, obj, cb) => {
      st.fail('db.updateArticle should not be called');
      st.end();
    };

    db.tagArticle = (article_id, tag_name) => {
      st.fail('db.tagArticle should not be called');
      st.end();
    };

    db.removeTags = (article_id) => {
      st.fail('db.removeTags should not be called');
      st.end();
    };

    api.update(1, article, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid article object', 'correct error message');
      st.end();
    });
  });

  t.test('article.update invalid tags', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {title: 'SOME TITLE', content: 'Lorem Ipsum Dolor', tags: 'BOGUS'};

    st.plan(2);

    db.updateArticle = (id, obj, cb) => {
      st.fail('db.updateArticle should not be called');
      st.end();
    };

    db.tagArticle = (article_id, tag_name) => {
      st.fail('db.tagArticle should not be called');
      st.end();
    };

    db.removeTags = (article_id) => {
      st.fail('db.removeTags should not be called');
      st.end();
    };

    api.update(1, article, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid article object', 'correct error message');
      st.end();
    });
  });

  t.test('article.update article not found', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {title: 'SOME TITLE', content: 'Lorem Ipsum Dolor', tags: ['nothing', 'something']};

    st.plan(5);

    db.updateArticle = (id, obj, cb) => {
      st.pass('db.updateArticle is called');
      st.equal(id, 1, 'correct article ID');
      st.deepEqual(obj, article, 'correct article object');
      cb(null, false);
    };

    db.tagArticle = (article_id, tag_name) => {
      st.fail('db.tagArticle should not be called');
      st.end();
    };

    db.removeTags = (article_id) => {
      st.fail('db.removeTags should not be called');
      st.end();
    };

    api.update(1, article, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Article not found', 'correct error message');
      st.end();
    });
  });

  t.test('article.update success', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const article = {title: 'SOME TITLE', content: 'Lorem Ipsum Dolor', tags: ['nothing', 'something']};

    st.plan(12);

    db.updateArticle = (id, obj, cb) => {
      st.pass('db.updateArticle is called');
      st.equal(id, 1, 'correct article ID');
      st.deepEqual(obj, article, 'correct article object');
      cb(null, true);
    };

    db.tagArticle = (article_id, tag_name) => {
      st.pass('db.tagArticle is called');
      st.equal(article_id, 1, 'correct article ID');
      st.ok(article.tags.indexOf(tag_name) > -1, 'correct tag name');
    };

    db.removeTags = (article_id, cb) => {
      st.pass('db.removeTags is called');
      st.equal(article_id, 1, 'correct article ID');
      cb();
    };

    api.update(1, article, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.end();
    });
  });

  t.test('article.remove error', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(4);

    db.deleteArticle = (id, cb) => {
      st.pass('db.deleteArticle is called');
      st.equal(id, 1, 'correct article ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('article.remove invalid article ID', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(2);

    db.deleteArticle = (id, cb) => {
      st.fail('db.deleteArticle should not be called');
      st.end();
    };

    api.remove(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid article ID', 'correct error message');
      st.end();
    });
  });

  t.test('article.remove article not found', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(4);

    db.deleteArticle = (id, cb) => {
      st.pass('db.deleteArticle is called');
      st.equal(id, 1, 'correct article ID');
      cb(null, false);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Article not found', 'correct error message');
      st.end();
    });
  });

  t.test('article.remove success', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(3);

    db.deleteArticle = (id, cb) => {
      st.pass('db.deleteArticle is called');
      st.equal(id, 1, 'correct article ID');
      cb(null, true);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.end();
    });
  });

  t.test('article.getComments error', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(4);

    db.getCommentsByArticle = (id, cb) => {
      st.pass('db.getCommentsByArticle is called');
      st.equal(id, 1, 'correct article ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.getComments(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('author.getComments invalid article ID', (st) => {
    const db = {}, api = new ArticleAPI(db);

    st.plan(2);

    db.getCommentsByArticle = (id, cb) => {
      st.fail('db.getCommentsByArticle should not be called');
      st.end();
    };

    api.getComments(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid article ID', 'correct error message');
      st.end();
    });
  });

  t.test('author.getComments success', (st) => {
    const db = {}, api = new ArticleAPI(db);

    const comments = [{id: 1, user_id: 10, article_id: 7, text: 'Some comment'},
                      {id: 3, user_id: 2, article_id: 7, text: 'Some other comment'}];

    st.plan(4);

    db.getCommentsByArticle = (id, cb) => {
      st.pass('db.getCommentsByArticle is called');
      st.equal(id, 7, 'correct article ID');
      cb(null, comments);
    };

    api.getComments(7, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.comments, comments, 'correct comments object');
      st.end();
    });
  });
}


export default tests;
