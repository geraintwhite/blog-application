import UserAPI from '../lib/user';


const tests = (t) => {
  t.test('user.all error', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(3);

    db.getUsers = (cb) => {
      st.pass('db.getUsers is called');
      cb({code: 'ER_ERROR'}, null);
    };

    api.all((code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('user.all no users', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(3);

    db.getUsers = (cb) => {
      st.pass('db.getUsers is called');
      cb(null, []);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.users, [], 'empty users array');
      st.end();
    });
  });

  t.test('user.all success', (st) => {
    const db = {}, api = new UserAPI(db);

    const users = [{id: 1, name: 'Fred Bloggs', email: 'fred.bloggs@mail.com', is_author: false, is_admin: false, password: 'hash1'},
                   {id: 2, name: 'Bib Smoth', email: 'bib.smoth@mail.com', is_author: true, is_admin: false, password: 'hash2'},
                   {id: 3, name: 'Jim Stevens', email: 'jim.stevens@mail.com', is_author: false, is_admin: true, password: 'hash3'}];

    st.plan(3);

    db.getUsers = (cb) => {
      st.pass('db.getUsers is called');
      cb(null, users);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.users, users, 'empty users array');
      st.end();
    });
  });

  t.test('user.get invalid user ID', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(2);

    db.getUser = (id, cb) => {
      st.fail('db.getUser should not be called');
      st.end();
    };

    api.get(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid user ID', 'correct error message');
      st.end();
    });
  });

  t.test('user.get error', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(4);

    db.getUser = (id, cb) => {
      st.pass('db.getUser is called');
      st.equal(id, 1, 'correct user ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('user.get user not found', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(4);

    db.getUser = (id, cb) => {
      st.pass('db.getUser is called');
      st.equal(id, 1, 'correct user ID');
      cb(null, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'User not found', 'correct error message');
      st.end();
    });
  });

  t.test('user.get success', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {id: 1, name: 'Fred Bloggs', email: 'fred.bloggs@mail.com', is_author: false, is_admin: false, password: 'hash1'};

    st.plan(4);

    db.getUser = (id, cb) => {
      st.pass('db.getUser is called');
      st.equal(id, 1, 'correct user ID');
      cb(null, user);
    };

    api.get(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.user, user, 'correct user object');
      st.end();
    });
  });
}


export default tests;
