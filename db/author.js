import {articleSelect, groupTags} from './article';


class AuthorDB {
  constructor(pool) {
    this.pool = pool;
  }

  getAuthor(author_id, cb) {
    const sql =
      'SELECT user_id, name, email ' +
      'FROM user ' +
      'WHERE user_id = ? ' +
      'AND is_author';

    this.pool.query(sql, [author_id], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && rows[0]);
    });
  }

  getArticlesByAuthor(author_id, cb) {
    const sql = articleSelect +
      'WHERE article.author_id = ? ' +
      'GROUP BY article.article_id';

    this.pool.query(sql, [author_id], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && groupTags(rows));
    });
  }
}


export default AuthorDB;
