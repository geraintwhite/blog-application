const groupTags = (rows) => {
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


const articleSelect =
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

  getArticle(id, cb) {
    const sql = articleSelect +
      'WHERE article.article_id = ? ' +
      'GROUP BY article.article_id';

    this.pool.query(sql, [id], (err, rows) => {
      if (err) console.error(err);
      cb(err, rows && groupTags(rows)[0]);
    });
  }
}


export default ArticleDB;
