class TagAPI {
  constructor(db) {
    this.db = db;
  }

  getAll(cb) {
    this.db.getTags((err, results) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {tags: results});
    });
  }

  getByAuthor(author_id, cb) {

  }
}


export default TagAPI;
