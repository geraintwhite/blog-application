class TagAPI {
  constructor(db) {
    this.db = db;
  }

  all(cb) {
    this.db.getTags((err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {tags: results});
    });
  }

  get(id, cb) {
    if (isNaN(parseInt(id))) {
      return cb(400, {err: 'Invalid tag ID'});
    }

    this.db.getTag(parseInt(id), (err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!results) {
        return cb(404, {err: 'Tag not found'});
      }

      cb(200, {tag: results});
    });
  }

  create(tag, cb) {
    if (!tag.name) {
      return cb(400, {err: 'Invalid tag name'});
    }


    this.db.createTag(tag, (err, results) => {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return cb(409, {err: 'Tag already exists'});
      } else if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {id: results});
    });
  }

  remove(id, cb) {
    if (isNaN(parseInt(id))) {
      return cb(400, {err: 'Invalid tag ID'});
    }

    this.db.deleteTag(parseInt(id), (err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!results.affectedRows) {
        return cb(404, {err: 'Tag not found'});
      }

      cb(200);
    });
  }
}


export default TagAPI;
