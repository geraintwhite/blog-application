class ArticleDB {
  constructor(pool) {
    this.pool = pool;
  }

  getArticles(cb) {
    const sql =
      'SELECT article.article_id, article.author_id, user.name AS author_name, ' +
             'article.date_published, article.title, article.content, ' +
             'GROUP_CONCAT(tag.tag_name) AS tags ' +
      'FROM article ' +
        'LEFT JOIN article_tag ON article.article_id = article_tag.article_id ' +
        'LEFT JOIN tag ON tag.tag_id = article_tag.tag_id ' +
        'LEFT JOIN user ON user.user_id = article.author_id ' +
      'GROUP BY article.article_id';

    this.pool.query(sql, (err, rows) => {
      if (err) console.error(err);
      if (rows) rows.forEach((row) => row.tags = row.tags && row.tags.split(','));
      cb(err, rows);
    });
  }
}


export default ArticleDB;
