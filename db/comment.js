class CommentDB {
  constructor(pool) {
    this.pool = pool;
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
