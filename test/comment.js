import CommentAPI from '../src/lib/comment';


const tests = (t) => {
  t.test('comment.all error', (st) => {
    const db = {}, api = new CommentAPI(db);

    st.plan(3);

    db.getComments = (cb) => {
      st.pass('db.getComments is called');
      cb({code: 'ER_ERROR'}, null);
    };

    api.all((code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('comment.all no comments', (st) => {
    const db = {}, api = new CommentAPI(db);

    st.plan(3);

    db.getComments = (cb) => {
      st.pass('db.getComments is called');
      cb(null, []);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.equal(data.comments.length, 0, 'empty comments array');
      st.end();
    });
  });

  t.test('comment.all success', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comments = [{id: 1, author_id: 20, title: 'Some title', content: 'Lorem Ipsum Dolor', tags: [{id: 7, name: 'truth'}, {id: 15, name: 'cool'}]},
                      {id: 2, author_id: 6, title: 'STUFF', content: 'THIS IS SO COOL', tags: []},
                      {id: 3, author_id: 20, title: 'Some title 2', content: 'Very serious text', tags: [{id: 7, name: 'truth'}]}];

    st.plan(3);

    db.getComments = (cb) => {
      st.pass('db.getComments is called');
      cb(null, comments);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.comments, comments, 'correct comments array');
      st.end();
    });
  });

  t.test('comment.get error', (st) => {
    const db = {}, api = new CommentAPI(db);

    st.plan(4);

    db.getComment = (id, cb) => {
      st.pass('db.getComment is called');
      st.equal(id, 1, 'correct comment ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct arror message');
      st.end();
    });
  });

  t.test('comment.get invalid comment ID', (st) => {
    const db = {}, api = new CommentAPI(db);

    st.plan(2);

    db.getComment = (id, cb) => {
      st.fail('db.getComment should not be called');
      st.end();
    };

    api.get(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid comment ID', 'correct arror message');
      st.end();
    });
  });

  t.test('comment.get comment not found', (st) => {
    const db = {}, api = new CommentAPI(db);

    st.plan(4);

    db.getComment = (id, cb) => {
      st.pass('db.getComment is called');
      st.equal(id, 1, 'correct comment ID');
      cb(null, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Comment not found', 'correct arror message');
      st.end();
    });
  });

  t.test('comment.get success', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comment = {id: 1, author_id: 20, title: 'Some title', content: 'Lorem Ipsum Dolor', tags: [{id: 7, name: 'truth'}, {id: 15, name: 'cool'}]};

    st.plan(4);

    db.getComment = (id, cb) => {
      st.pass('db.getComment is called');
      st.equal(id, 1, 'correct comment ID');
      cb(null, comment);
    };

    api.get(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.comment, comment, 'correct comment object');
      st.end();
    });
  });

  t.test('comment.create error', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comment = {user_id: 10, article_id: 40, text: 'some cool comment'};

    st.plan(4);

    db.createComment = (obj, cb) => {
      st.pass('db.createComment is called');
      st.deepEqual(obj, comment, 'correct comment object');
      cb({code: 'ER_ERROR'}, null);
    };

    api.create(comment, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('comment.create empty object', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comment = {};

    st.plan(2);

    db.createComment = (obj, cb) => {
      st.fail('db.createComment should not be called');
      st.end();
    };

    api.create(comment, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid comment object', 'correct error message');
      st.end();
    });
  });

  t.test('comment.create invalid user ID', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comment = {user_id: 'FRED', article_id: 40, text: 'some cool comment'};

    st.plan(2);

    db.createComment = (obj, cb) => {
      st.fail('db.createComment should not be called');
      st.end();
    };

    api.create(comment, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid comment object', 'correct error message');
      st.end();
    });
  });

  t.test('comment.create invalid article ID', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comment = {user_id: 10, article_id: 'FRED', text: 'some cool comment'};

    st.plan(2);

    db.createComment = (obj, cb) => {
      st.fail('db.createComment should not be called');
      st.end();
    };

    api.create(comment, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid comment object', 'correct error message');
      st.end();
    });
  });

  t.test('comment.create success', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comment = {user_id: 10, article_id: 40, text: 'some cool comment'};

    st.plan(4);

    db.createComment = (obj, cb) => {
      st.pass('db.createComment is called');
      st.deepEqual(obj, comment, 'correct comment object');
      cb(null, 1);
    };

    api.create(comment, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.equal(data.id, 1, 'correct comment ID');
      st.end();
    });
  });

  t.test('comment.update error', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comment = {text: 'some other cool comment'};

    st.plan(5);

    db.updateComment = (id, obj, cb) => {
      st.pass('db.updateComment is called');
      st.equal(id, 1, 'correct comment ID');
      st.deepEqual(obj, comment, 'correct comment object');
      cb({code: 'ER_ERROR'}, null);
    };

    api.update(1, comment, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('comment.update invalid comment ID', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comment = {text: 'some other cool comment'};

    st.plan(2);

    db.updateComment = (id, obj, cb) => {
      st.fail('db.updateComment should not be called');
      st.end();
    };

    api.update(null, comment, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid comment ID', 'correct error message');
      st.end();
    });
  });

  t.test('comment.update comment not found', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comment = {text: 'some other cool comment'};

    st.plan(5);

    db.updateComment = (id, obj, cb) => {
      st.pass('db.updateComment is called');
      st.equal(id, 1, 'correct comment ID');
      st.deepEqual(obj, comment, 'correct comment object');
      cb(null, false);
    };

    api.update(1, comment, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Comment not found', 'correct error message');
      st.end();
    });
  });

  t.test('comment.update success', (st) => {
    const db = {}, api = new CommentAPI(db);

    const comment = {text: 'some other cool comment'};

    st.plan(4);

    db.updateComment = (id, obj, cb) => {
      st.pass('db.updateComment is called');
      st.equal(id, 1, 'correct comment ID');
      st.deepEqual(obj, comment, 'correct comment object');
      cb(null, true);
    };

    api.update(1, comment, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.end();
    });
  });

  t.test('comment.remove error', (st) => {
    const db = {}, api = new CommentAPI(db);

    st.plan(4);

    db.deleteComment = (id, cb) => {
      st.pass('db.deleteComment is called');
      st.equal(id, 1, 'correct comment ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('comment.remove invalid comment ID', (st) => {
    const db = {}, api = new CommentAPI(db);

    st.plan(2);

    db.deleteComment = (id, cb) => {
      st.fail('db.deleteComment should not be called');
      st.end();
    };

    api.remove(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid comment ID', 'correct error message');
      st.end();
    });
  });

  t.test('comment.remove comment not found', (st) => {
    const db = {}, api = new CommentAPI(db);

    st.plan(4);

    db.deleteComment = (id, cb) => {
      st.pass('db.deleteComment is called');
      st.equal(id, 1, 'correct comment ID');
      cb(null, false);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Comment not found', 'correct error message');
      st.end();
    });
  });

  t.test('comment.remove success', (st) => {
    const db = {}, api = new CommentAPI(db);

    st.plan(3);

    db.deleteComment = (id, cb) => {
      st.pass('db.deleteComment is called');
      st.equal(id, 1, 'correct comment ID');
      cb(null, true);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.end();
    });
  });
};


export default tests;
