import test from 'tape';

test('timing test', (t) => {
  const start = Date.now();

  setTimeout(() => {
    t.equal(Date.now() - start, 100);
    t.end();
  }, 100);
});
