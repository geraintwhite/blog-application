import {isInteger} from './util/validate';


class TagAPI {
  constructor(db) {
    this.db = db;
  }

  all(cb) {
    this.db.getTags((err, tags) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {tags});
    });
  }

  get(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid tag ID'});
    }

    this.db.getTag(id, (err, tag) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!tag) {
        return cb(404, {err: 'Tag not found'});
      }

      cb(200, {tag});
    });
  }

  create(tag, cb) {
    if (!tag.name) {
      return cb(400, {err: 'Invalid tag name'});
    }


    this.db.createTag(tag, (err, id) => {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return cb(409, {err: 'Tag already exists'});
      } else if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {id});
    });
  }

  remove(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid tag ID'});
    }

    this.db.deleteTag(id, (err, deleted) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!deleted) {
        return cb(404, {err: 'Tag not found'});
      }

      cb(200);
    });
  }

  getArticles(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid tag ID'});
    }

    this.db.getArticlesByTag(id, (err, articles) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {articles});
    });
  }
}


export default TagAPI;
