class TagAPI {
  constructor(db) {
    this.db = db;
  }

  getAll(cb) {
    this.db.gets((err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {tags: results});
    });
  }

  get(tag_id, cb) {
    if (isNaN(parseInt(tag_id))) {
      return cb(400, {err: 'Invalid Tag ID'});
    }

    this.db.get(parseInt(tag_id), (err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!results) {
        return cb(404, {err: 'Tag not found'});
      }

      cb(200, {tag: results});
    });
  }
}


export default TagAPI;
