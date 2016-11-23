import { isArray, isInteger } from './util/validate';


class ArticleAPI {
  constructor(db) {
    this.db = db;
  }

  all(cb) {
    this.db.getArticles((err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {articles: results});
    });
  }

  get(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid article ID'});
    }

    this.db.getArticle(id, (err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!results) {
        return cb(404, {err: 'Article not found'});
      }

      cb(200, {article: results});
    });
  }

  create(article, cb) {
    if (!(article.author_id && article.title && article.content && article.tags) ||
        !isInteger(article.author_id) ||
        !isArray(article.tags))
    {
      return cb(400, {err: 'Invalid article object'});
    }

    this.db.createArticle(article, (err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {id: results});
    });
  }

  update(id, article, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid article ID'});
    }

    if (article.tags && !isArray(article.tags)) {
      return cb(400, {err: 'Invalid article object'});
    }

    this.db.updateArticle(id, article, (err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!results.affectedRows) {
        return cb(404, {err: 'Article not found'});
      }

      cb(200);
    });
  }

  remove(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid article ID'});
    }

    this.db.deleteArticle(id, (err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!results.affectedRows) {
        return cb(404, {err: 'Article not found'});
      }

      cb(200);
    });
  }
}


export default ArticleAPI;
