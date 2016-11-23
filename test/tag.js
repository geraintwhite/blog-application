import TagAPI from '../lib/tag';


const tests = (t) => {
  t.test('tag.all error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(3);

    db.getTags = (cb) => {
      st.pass('db.getTags is called');
      cb({code: 'ER_ERROR'}, null);
    };

    api.all((code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.all no tags', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(3);

    db.getTags = (cb) => {
      st.pass('db.getTags is called');
      cb(null, []);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.tags, [], 'empty tags array');
      st.end();
    });
  });

  t.test('tag.all success', (st) => {
    const db = {}, api = new TagAPI(db);

    const tags = [{id: 1, name: 'tag1'},
                  {id: 2, name: 'tag2'}];

    st.plan(3);

    db.getTags = (cb) => {
      st.pass('db.getTags is called');
      cb(null, tags);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.tags, tags, 'correct tags array');
      st.end();
    });
  });

  t.test('tag.get invalid tag ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.getTag = (tag_id, cb) => {
      st.fail('db.getTag should not be called');
      st.end();
    };

    api.get(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid tag ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.get error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.getTag = (id, cb) => {
      st.pass('db.getTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.get tag not found', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.getTag = (id, cb) => {
      st.pass('db.getTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb(null, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Tag not found', 'correct error message');
      st.end();
    });
  });

  t.test('tag.get success', (st) => {
    const db = {}, api = new TagAPI(db);

    const tag = {id: 1, name: 'tag1'};

    st.plan(4);

    db.getTag = (id, cb) => {
      st.pass('db.getTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb(null, tag);
    };

    api.get(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.tag, tag, 'correct tag object');
      st.end();
    });
  });

  t.test('tag.create error', (st) => {
    const db = {}, api = new TagAPI(db);

    const tag = {name: 'tag1'};

    st.plan(4);

    db.createTag = (obj, cb) => {
      st.pass('db.createTag is called');
      st.deepEqual(obj, tag, 'correct object passed in');
      cb({code: 'ER_ERROR'}, null);
    };

    api.create(tag, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.create tag already exists', (st) => {
    const db = {}, api = new TagAPI(db);

    const tag = {name: 'tag1'};

    st.plan(4);

    db.createTag = (obj, cb) => {
      st.pass('db.createTag is called');
      st.deepEqual(obj, tag, 'correct object passed in');
      cb({code: 'ER_DUP_ENTRY'}, null);
    };

    api.create(tag, (code, data) => {
      st.equal(code, 409, 'correct status code');
      st.equal(data.err, 'Tag already exists', 'correct error message');
      st.end();
    });
  });

  t.test('tag.create validation fails', (st) => {
    const db = {}, api = new TagAPI(db);

    const tag = {};

    st.plan(2);

    db.createTag = (obj, cb) => {
      st.fail('db.createTag should not be called');
      st.end();
    };

    api.create(tag, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid tag name', 'correct error message');
      st.end();
    });
  });

  t.test('tag.create success', (st) => {
    const db = {}, api = new TagAPI(db);

    const tag = {name: 'tag1'};

    st.plan(4);

    db.createTag = (obj, cb) => {
      st.pass('db.createTag is called');
      st.deepEqual(obj, tag, 'correct tag object');
      cb(null, 1);
    };

    api.create(tag, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.equal(data.id, 1, 'correct tag ID');
      st.end();
    });
  });

  t.test('tag.remove invalid tag ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.deleteTag = (id, cb) => {
      st.fail('db.deleteTag should not be called');
      st.end();
    };

    api.remove(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid tag ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.remove error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.deleteTag = (id, cb) => {
      st.pass('db.deleteTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.remove tag not found', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.deleteTag = (id, cb) => {
      st.pass('db.deleteTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb(null, false);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Tag not found', 'correct error message');
      st.end();
    });
  });

  t.test('tag.remove success', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(3);

    db.deleteTag = (id, cb) => {
      st.pass('db.deleteTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb(null, true);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.end();
    });
  });

  t.test('tag.getArticles error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.getArticlesByTag = (id, cb) => {
      st.pass('db.getArticlesByTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.getArticles(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.getArticles invalid tag ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.getArticlesByTag = (id, cb) => {
      st.fail('db.getArticlesByTag should not be called');
      st.end();
    };

    api.getArticles(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid tag ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.getArticles success', (st) => {
    const db = {}, api = new TagAPI(db);

    const articles = [{id: 1, author_id: 20, title: 'Some title', content: 'Lorem Ipsum Dolor', tags: [{id: 7, name: 'truth'}, {id: 15, name: 'cool'}]},
                      {id: 3, author_id: 20, title: 'Some title 2', content: 'Very serious text', tags: [{id: 7, name: 'truth'}]}];

    st.plan(4);

    db.getArticlesByTag = (id, cb) => {
      st.pass('db.getArticlesByTag is called');
      st.equal(id, 7, 'correct tag ID');
      cb(null, articles);
    };

    api.getArticles(7, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.articles, articles, 'correct articles object');
      st.end();
    });
  });

  t.test('tag.getSubscribers error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.getSubscribersByTag = (id, cb) => {
      st.pass('db.getSubscribersByTag is called');
      st.equal(id, 7, 'correct tag ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.getSubscribers(7, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.getSubscribers invalid tag ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.getSubscribersByTag = (id, cb) => {
      st.fail('db.getSubscribersByTag should not have been called');
      st.end();
    };

    api.getSubscribers(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid tag ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.getSubscribers success', (st) => {
    const db = {}, api = new TagAPI(db);

    const subscribers = [{id: 1}, {id: 12}, {id: 6}];

    st.plan(4);

    db.getSubscribersByTag = (id, cb) => {
      st.pass('db.getSubscribersByTag is called');
      st.equal(id, 7, 'correct tag ID');
      cb(null, subscribers);
    };

    api.getSubscribers(7, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.subscribers, subscribers, 'correct subscribers object');
      st.end();
    });
  });

  t.test('tag.subscribe error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(5);

    db.subscribeToTag = (tag_id, subscriber_id, cb) => {
      st.pass('db.subscribeToTag is called');
      st.equal(tag_id, 7, 'correct tag ID');
      st.equal(subscriber_id, 24, 'correct subscriber ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.subscribe(7, 24, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.subscribe invalid tag ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.subscribeToTag = (tag_id, subscriber_id, cb) => {
      st.fail('db.subscribeToTag should not have been called');
      st.end();
    };

    api.subscribe(null, 24, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid tag ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.subscribe invalid subscriber ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.subscribeToTag = (tag_id, subscriber_id, cb) => {
      st.fail('db.subscribeToTag should not have been called');
      st.end();
    };

    api.subscribe(7, null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid subscriber ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.subscribe success', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.subscribeToTag = (tag_id, subscriber_id, cb) => {
      st.pass('db.subscribeToTag is called');
      st.equal(tag_id, 7, 'correct tag ID');
      st.equal(subscriber_id, 24, 'correct subscriber ID');
      cb(null, null);
    };

    api.subscribe(7, 24, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.end();
    });
  });

  t.test('tag.unsubscribe error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(5);

    db.unsubscribeFromTag = (tag_id, subscriber_id, cb) => {
      st.pass('db.unsubscribeFromTag is called');
      st.equal(tag_id, 7, 'correct tag ID');
      st.equal(subscriber_id, 24, 'correct subscriber ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.unsubscribe(7, 24, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.unsubscribe invalid tag ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.unsubscribeFromTag = (tag_id, subscriber_id, cb) => {
      st.fail('db.unsubscribeFromTag should not have been called');
      st.end();
    };

    api.unsubscribe(null, 24, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid tag ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.unsubscribe invalid subscriber ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.unsubscribeFromTag = (tag_id, subscriber_id, cb) => {
      st.fail('db.unsubscribeFromTag should not have been called');
      st.end();
    };

    api.unsubscribe(7, null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid subscriber ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.unsubscribe success', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.unsubscribeFromTag = (tag_id, subscriber_id, cb) => {
      st.pass('db.unsubscribeFromTag is called');
      st.equal(tag_id, 7, 'correct tag ID');
      st.equal(subscriber_id, 24, 'correct subscriber ID');
      cb(null, null);
    };

    api.unsubscribe(7, 24, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.end();
    });
  });
};


export default tests;
