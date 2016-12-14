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

  t.test('user.create error', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Fred Bloggs', email: 'fred.bloggs@mail.com', password: 'Pa55w0rd', password2: 'Pa55w0rd'};

    st.plan(4);

    db.createUser = (obj, cb) => {
      st.pass('db.getUser is called');
      st.deepEqual(obj, user, 'correct user object');
      cb({code: 'ER_ERROR'}, null);
    };

    api.create(user, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('user.create user already exists', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Fred Bloggs', email: 'fred.bloggs@mail.com', password: 'Pa55w0rd', password2: 'Pa55w0rd'};

    st.plan(4);

    db.createUser = (obj, cb) => {
      st.pass('db.getUser is called');
      st.deepEqual(obj, user, 'correct user object');
      cb({code: 'ER_DUP_ENTRY'}, null);
    };

    api.create(user, (code, data) => {
      st.equal(code, 409, 'correct status code');
      st.equal(data.err, 'User already exists', 'correct error message');
      st.end();
    });
  });

  t.test('user.create empty user object', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {};

    st.plan(2);

    db.createUser = (obj, cb) => {
      st.fail('db.getUser should not be called');
      st.end();
    };

    api.create(user, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid user object', 'correct error message');
      st.end();
    });
  });

  t.test('user.create invalid email address', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Fred Bloggs', email: 'not.an.email.address', password: 'Pa55w0rd', password2: 'Pa55w0rd'};

    st.plan(2);

    db.createUser = (obj, cb) => {
      st.fail('db.getUser should not be called');
      st.end();
    };

    api.create(user, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid user object', 'correct error message');
      st.end();
    });
  });

  t.test('user.create weak password', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Fred Bloggs', email: 'fred.bloggs@mail.com', password: 'asdf', password2: 'asdf'};

    st.plan(2);

    db.createUser = (obj, cb) => {
      st.fail('db.getUser should not be called');
      st.end();
    };

    api.create(user, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid user object', 'correct error message');
      st.end();
    });
  });

  t.test('user.create password mismatch', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Fred Bloggs', email: 'fred.bloggs@mail.com', password: 'Pa55w0rd', password2: 'bogus'};

    st.plan(2);

    db.createUser = (obj, cb) => {
      st.fail('db.getUser should not be called');
      st.end();
    };

    api.create(user, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid user object', 'correct error message');
      st.end();
    });
  });

  t.test('user.create success', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Fred Bloggs', email: 'fred.bloggs@mail.com', password: 'Pa55w0rd', password2: 'Pa55w0rd'};

    st.plan(4);

    db.createUser = (obj, cb) => {
      st.pass('db.getUser is called');
      st.deepEqual(obj, user, 'correct user object');
      cb(null, 1);
    };

    api.create(user, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.equal(data.id, 1, 'correct user ID');
      st.end();
    });
  });

  t.test('user.update invalid user ID', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Joe Bloggs'};

    st.plan(2);

    db.updateUser = (id, obj, cb) => {
      st.fail('db.updateUser should not be called');
      st.end();
    };

    api.update(null, user, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid user ID', 'correct error message');
      st.end();
    });
  });

  t.test('user.update error', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Joe Bloggs', email: 'newperson@mail.com'};

    st.plan(5);

    db.updateUser = (id, obj, cb) => {
      st.pass('db.updateUser is called');
      st.equal(id, 1, 'correct user ID');
      st.deepEqual(obj, user, 'correct user object');
      cb({code: 'ER_ERROR'}, null);
    };

    api.update(1, user, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('user.update user not found', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Joe Bloggs', email: 'newperson@mail.com'};

    st.plan(5);

    db.updateUser = (id, obj, cb) => {
      st.pass('db.updateUser is called');
      st.equal(id, 1, 'correct user ID');
      st.deepEqual(obj, user, 'correct user object');
      cb(null, false);
    };

    api.update(1, user, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'User not found', 'correct error message');
      st.end();
    });
  });

  t.test('user.update user already exists', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Joe Bloggs', email: 'newperson@mail.com'};

    st.plan(5);

    db.updateUser = (id, obj, cb) => {
      st.pass('db.updateUser is called');
      st.equal(id, 1, 'correct user ID');
      st.deepEqual(obj, user, 'correct user object');
      cb({code: 'ER_DUP_ENTRY'}, null);
    };

    api.update(1, user, (code, data) => {
      st.equal(code, 409, 'correct status code');
      st.equal(data.err, 'User already exists', 'correct error message');
      st.end();
    });
  });

  t.test('user.update empty object', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {};

    st.plan(2);

    db.updateUser = (id, obj, cb) => {
      st.fail('db.updateUser should not be called');
      st.end();
    };

    api.update(1, user, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid user object', 'correct error message');
      st.end();
    });
  });

  t.test('user.update invalid email address', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Joe Bloggs', email: 'not.an.email.address'};

    st.plan(2);

    db.updateUser = (id, obj, cb) => {
      st.fail('db.updateUser should not be called');
      st.end();
    };

    api.update(1, user, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid user object', 'correct error message');
      st.end();
    });
  });

  t.test('user.update success', (st) => {
    const db = {}, api = new UserAPI(db);

    const user = {name: 'Joe Bloggs', email: 'newperson@mail.com'};

    st.plan(4);

    db.updateUser = (id, obj, cb) => {
      st.pass('db.updateUser is called');
      st.equal(id, 1, 'correct user ID');
      st.deepEqual(obj, user, 'correct user object');
      cb(null, true);
    };

    api.update(1, user, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.end();
    });
  });

  t.test('user.remove invalid user ID', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(2);

    db.deleteUser = (id, cb) => {
      st.fail('db.deleteUser should not be called');
      st.end();
    };

    api.remove(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid user ID', 'correct error message');
      st.end();
    });
  });

  t.test('user.remove error', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(4);

    db.deleteUser = (id, cb) => {
      st.pass('db.deleteUser is called');
      st.equal(id, 1, 'correct user ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('user.remove user not found', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(4);

    db.deleteUser = (id, cb) => {
      st.pass('db.deleteUser is called');
      st.equal(id, 1, 'correct user ID');
      cb(null, false);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'User not found', 'correct error message');
      st.end();
    });
  });

  t.test('user.remove success', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(3);

    db.deleteUser = (id, cb) => {
      st.pass('db.deleteUser is called');
      st.equal(id, 1, 'correct user ID');
      cb(null, true);
    };

    api.remove(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.end();
    });
  });

  t.test('user.subscriptions error', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(4);

    db.getSubscriptionsForUser = (id, cb) => {
      st.pass('db.getSubscriptionsForUser is called');
      st.equal(id, 1, 'correct user ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.subscriptions(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('user.subscriptions invalid user ID', (st) => {
    const db = {}, api = new UserAPI(db);

    st.plan(2);

    db.getSubscriptionsForUser = (id, cb) => {
      st.fail('db.getSubscriptionsForUser should not be called');
      st.end();
    };

    api.subscriptions(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid user ID', 'correct error message');
      st.end();
    });
  });

  t.test('user.subscriptions success', (st) => {
    const db = {}, api = new UserAPI(db);

    const subscriptions = {author: [{id: 1}, {id: 17}], tag: [{id: 5}, {id: 42}]};

    st.plan(4);

    db.getSubscriptionsForUser = (id, cb) => {
      st.pass('db.getSubscriptionsForUser is called');
      st.equal(id, 1, 'correct user ID');
      cb(null, subscriptions);
    };

    api.subscriptions(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.subscriptions, subscriptions, 'correct subscriptions object');
      st.end();
    });
  });
}


export default tests;
