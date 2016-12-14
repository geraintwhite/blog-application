import bcrypt from 'bcrypt';


class UserDB {
  constructor(pool) {
    this.pool = pool;
  }

  createUser(user, cb) {
    const sql =
      'INSERT INTO user ' +
      'SET name = ?, email = ?, password = ?';

    const hash = bcrypt.hashSync(user.password, 12);

    this.pool.query(sql, [user.name, user.email, hash], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && rows.insertId);
    });
  }

  updateUser(user_id, user, cb) {
    const sql =
      'UPDATE user ' +
      'SET name = ?, email = ? ' +
      'WHERE user_id = ?';

    this.pool.query(sql, [user.name, user.email, user_id], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && rows.affectedRows);
    });
  }

  getUser(user_id, cb) {
    const sql =
      'SELECT * FROM user ' +
      'WHERE user_id = ?';

    this.pool.query(sql, [user_id], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && rows[0]);
    });
  }

  getUserByEmail(email, cb) {
    const sql =
      'SELECT * FROM user ' +
      'WHERE email = ?';

    this.pool.query(sql, [email], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && rows[0]);
    });
  }
}


export default UserDB;
