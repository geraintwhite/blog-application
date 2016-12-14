import {isEmail, isComplexPassword, isInteger} from './util/validate';


class UserAPI {
  constructor(db) {
    this.db = db;
  }

  all(cb) {
    this.db.getUsers((err, users) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {users});
    });
  }

  get(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid user ID'});
    }

    this.db.getUser(id, (err, user) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!user) {
        return cb(404, {err: 'User not found'});
      }

      cb(200, {user});
    });
  }

  getByEmail(email, cb) {
    if (!isEmail(email)) {
      return cb(400, {err: 'Invalid email address'});
    }

    this.db.getUserByEmail(email, (err, user) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!user) {
        return cb(404, {err: 'User not found'});
      }

      cb(200, {user});
    });
  }

  create(user, cb) {
    const errors = {};

    if (user.email && !isEmail(user.email)) {
      errors.email = 'Must be a valid email address.';
    }

    if (user.password && !isComplexPassword(user.password)) {
      errors.password = 'Password must be at least 6 characters long,\n' +
                        'have at least one uppercase letter,\n' +
                        'have at least one lowercase letter,\n' +
                        'have at least one number.';
    }

    if (user.password !== user.password2) {
      errors.password2 = 'Passwords must match.';
    }

    if (!(user.name && user.email && user.password && user.password2) ||
        Object.keys(errors).length)
    {
      return cb(400, {err: 'Invalid user object', errors});
    }

    this.db.createUser(user, (err, id) => {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return cb(409, {err: 'User already exists'});
      } else if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {id});
    });
  }

  update(id, user, cb) {
    const errors = {};

    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid user ID'});
    }

    if (user.email && !isEmail(user.email)) {
      errors.email = 'Must be a valid email address.';
    }

    if (!(user.name && user.email) ||
        Object.keys(errors).length)
    {
      return cb(400, {err: 'Invalid user object', errors});
    }

    this.db.updateUser(id, user, (err, updated) => {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return cb(409, {err: 'User already exists'});
      } else if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!updated) {
        return cb(404, {err: 'User not found'});
      }

      cb(200);
    });
  }

  remove(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid user ID'});
    }

    this.db.deleteUser(id, (err, deleted) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!deleted) {
        return cb(404, {err: 'User not found'});
      }

      cb(200);
    });
  }

  subscriptions(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid user ID'});
    }

    this.db.getSubscriptionsForUser(id, (err, subscriptions) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {subscriptions});
    });
  }
}


export default UserAPI;
