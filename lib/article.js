import {isArray, isInteger} from './util/validate';


class ArticleAPI {
  constructor(db) {
    this.db = db;
  }

  all(cb) {
    this.db.getArticles((err, articles) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {articles});
    });
  }

  get(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid article ID'});
    }

    this.db.getArticle(id, (err, article) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!article) {
        return cb(404, {err: 'Article not found'});
      }

      cb(200, {article});
    });
  }

  create(article, cb) {
    if (!(article.author_id && article.title && article.content && article.tags) ||
        !isInteger(article.author_id) ||
        !isArray(article.tags))
    {
      return cb(400, {err: 'Invalid article object'});
    }

    this.db.createArticle(article, (err, id) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      article.tags.map((tag) => this.db.tagArticle(id, tag));

      cb(200, {id});
    });
  }

  update(id, article, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid article ID'});
    }

    if (article.tags && !isArray(article.tags)) {
      return cb(400, {err: 'Invalid article object'});
    }

    this.db.updateArticle(id, article, (err, updated) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!updated) {
        return cb(404, {err: 'Article not found'});
      }

      cb(200);
    });
  }

  remove(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid article ID'});
    }

    this.db.deleteArticle(id, (err, deleted) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!deleted) {
        return cb(404, {err: 'Article not found'});
      }

      cb(200);
    });
  }

  getComments(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid article ID'});
    }

    this.db.getCommentsByArticle(id, (err, comments) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {comments});
    });
  }
}


export default ArticleAPI;
