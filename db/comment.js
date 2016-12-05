export const commentSelect =
  'SELECT comment.comment_id, comment.article_id, comment.date_published, ' +
         'comment.text, comment.user_id, user.name AS user_name ' +
  'FROM comment ' +
    'LEFT JOIN user ON user.user_id = comment.user_id ';


class CommentDB {
  constructor(pool) {
    this.pool = pool;
  }

  getComment(comment_id, cb) {
    const sql = commentSelect +
      'WHERE comment.comment_id = ?';

    this.pool.query(sql, [comment_id], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && rows[0]);
    });
  }

  createComment(comment, cb) {
    const sql =
      'INSERT INTO comment ' +
      'SET user_id = ?, article_id = ?, text = ?';

    this.pool.query(sql, [comment.user_id, comment.article_id, comment.text], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && rows.insertId);
    });
  }
}


export default CommentDB;
