import TagAPI from '../lib/tag';


const tests = (t) => {
  t.test('tag.getAll error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(3);

    db.gets = (cb) => {
      st.pass('db.gets is called');
      cb(true, null);
    };

    api.getAll((code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.getAll no tags', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(3);

    db.gets = (cb) => {
      st.pass('db.gets is called');
      cb(false, []);
    };

    api.getAll((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.tags, [], 'empty tags array');
      st.end();
    });
  });

  t.test('tag.getAll success', (st) => {
    const db = {}, api = new TagAPI(db);

    const tags = [{id: 1, name: 'tag1'},
                  {id: 2, name: 'tag2'}];

    st.plan(3);

    db.gets = (cb) => {
      st.pass('db.gets is called');
      cb(false, tags);
    };

    api.getAll((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.tags, tags, 'correct tags array');
      st.end();
    });
  });

  t.test('tag.get invalid Tag ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.get = (tag_id, cb) => {
      st.fail('db.get should not be called');
      st.end();
    };

    api.get(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid Tag ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.get error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.get = (tag_id, cb) => {
      st.pass('db.get is called');
      st.equal(tag_id, 1, 'correct tag_id');
      cb(true, null);
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

    db.get = (tag_id, cb) => {
      st.pass('db.get is called');
      st.equal(tag_id, 1, 'correct tag_id');
      cb(false, null);
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

    db.get = (tag_id, cb) => {
      st.pass('db.get is called');
      st.equal(tag_id, 1, 'correct tag_id');
      cb(false, tag);
    };

    api.get(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.tag, tag, 'correct tag object');
      st.end();
    });
  });

};


export default tests;
