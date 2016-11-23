import {isInteger} from './util/validate';


class CommentAPI {
  constructor(db) {
    this.db = db;
  }

  all(cb) {
    this.db.getComments((err, comments) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {comments});
    });
  }

  get(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid comment ID'});
    }

    this.db.getComment(id, (err, comment) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!comment) {
        return cb(404, {err: 'Comment not found'});
      }

      cb(200, {comment});
    });
  }

  create(comment, cb) {
    if (!(comment.user_id && comment.article_id && comment.text) ||
        !isInteger(comment.user_id) ||
        !isInteger(comment.article_id))
    {
      return cb(400, {err: 'Invalid comment object'});
    }

    this.db.createComment(comment, (err, id) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      cb(200, {id});
    });
  }

  update(id, comment, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid comment ID'});
    }

    this.db.updateComment(id, comment, (err, updated) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!updated) {
        return cb(404, {err: 'Comment not found'});
      }

      cb(200);
    });
  }

  remove(id, cb) {
    if (!isInteger(id)) {
      return cb(400, {err: 'Invalid comment ID'});
    }

    this.db.deleteComment(id, (err, deleted) => {
      if (err) {
        return cb(500, {err: 'Server error'});
      }

      if (!deleted) {
        return cb(404, {err: 'Comment not found'});
      }

      cb(200);
    });
  }
}


export default CommentAPI;
