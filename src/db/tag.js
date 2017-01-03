import {articleSelect, groupTags} from './article';


class TagDB {
  constructor(pool) {
    this.pool = pool;
  }

  getTag(tag_id, cb) {
    const sql =
      'SELECT tag_id, tag_name AS name ' +
      'FROM tag ' +
      'WHERE tag_id = ?';

    this.pool.query(sql, [tag_id], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && rows[0]);
    });
  }

  getArticlesByTag(tag_id, cb) {
    const sql = articleSelect +
      'WHERE tag.tag_id = ? ' +
      'GROUP BY article.article_id';

    this.pool.query(sql, [tag_id], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && groupTags(rows));
    });
  }
}


export default TagDB;
