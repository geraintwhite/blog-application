export const groupTags = (rows) => {
  rows.forEach((row) => {
    row.tags = [];
    if (row.tag_ids && row.tag_ids.length) {
      row.tag_ids.split(',').forEach((tag_id, i) => {
        row.tags.push({tag_id: tag_id, tag_name: row.tag_names.split(',')[i]});
      });
    }
  });

  return rows;
}


export const articleSelect =
  'SELECT article.article_id, article.author_id, user.name AS author_name, ' +
         'article.date_published, article.title, article.content, ' +
         'GROUP_CONCAT(tag.tag_id) AS tag_ids, ' +
         'GROUP_CONCAT(tag.tag_name) AS tag_names ' +
  'FROM article ' +
    'LEFT JOIN article_tag ON article.article_id = article_tag.article_id ' +
    'LEFT JOIN tag ON tag.tag_id = article_tag.tag_id ' +
    'LEFT JOIN user ON user.user_id = article.author_id ';


class ArticleDB {
  constructor(pool) {
    this.pool = pool;
  }

  getArticles(cb) {
    const sql = articleSelect +
      'GROUP BY article.article_id';

    this.pool.query(sql, (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && groupTags(rows));
    });
  }

  getArticle(article_id, cb) {
    const sql = articleSelect +
      'WHERE article.article_id = ? ' +
      'GROUP BY article.article_id';

    this.pool.query(sql, [article_id], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && groupTags(rows)[0]);
    });
  }

  getCommentsByArticle(article_id, cb) {
    const sql =
      'SELECT comment.comment_id, comment.text, comment.date_published, ' +
             'comment.user_id, user.name AS user_name ' +
      'FROM comment ' +
        'LEFT JOIN user ON user.user_id = comment.user_id ' +
      'WHERE comment.article_id = ?';

    this.pool.query(sql, [article_id], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows);
    });
  }

  createArticle(article, cb) {
    const sql =
      'INSERT INTO article ' +
        '(author_id, title, content) ' +
      'VALUES (?, ?, ?)';

    this.pool.query(sql, [article.author_id, article.title, article.content], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && rows.insertId);
    });
  }

  tagArticle(article_id, tag_name) {
    const sql =
      'CALL tag_article(?, ?)';

    this.pool.query(sql, [article_id, tag_name], (err, rows) => {
      if (err) console.error(err);
    });
  }
}


export default ArticleDB;
