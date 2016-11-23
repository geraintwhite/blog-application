import {isInteger} from './util/validate';


class AuthorAPI {
  constructor(db) {
    this.db = db;
  }

  all(cb) {
    this.db.getAuthors((err, authors) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {authors});
    });
  }

  get(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid author ID'});
    }

    this.db.getAuthor(id, (err, author) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!author) {
        return cb(404, {err: 'Author not found'});
      }

      cb(200, {author});
    });
  }

  getArticles(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid author ID'});
    }

    this.db.getArticlesByAuthor(id, (err, articles) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {articles});
    });
  }
}


export default AuthorAPI;
