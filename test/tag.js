import TagAPI from '../lib/tag';


const tests = (t) => {
  t.test('tag.getAll error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.getTags = (cb) => {
      st.pass('db.getTags should be called');
      cb(true, null);
    }

    api.getAll((code, data) => {
      st.equal(code, 500, 'should return correct status code');
      st.ok(data);
      st.equal(data.err, 'Server error', 'should return correct error message');
      st.end();
    });
  });
};


export default tests;
