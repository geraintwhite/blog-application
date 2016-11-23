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

  create(user, cb) {
    if (!(user.name && user.email && user.password) ||
        !isEmail(user.email) ||
        !isComplexPassword(user.password))
    {
      return cb(400, {err: 'Invalid user object'});
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
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid user ID'});
    }

    if ((user.email && !isEmail(user.email)) ||
        (user.password && !isComplexPassword(user.password))) {
      return cb(400, {err: 'Invalid user object'});
    }

    this.db.updateUser(id, user, (err, results) => {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return cb(409, {err: 'User already exists'});
      } else if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!results.affectedRows) {
        return cb(404, {err: 'User not found'});
      }

      cb(200);
    });
  }

  remove(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid user ID'});
    }

    this.db.deleteUser(id, (err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!results.affectedRows) {
        return cb(404, {err: 'User not found'});
      }

      cb(200);
    });
  }
}


export default UserAPI;
