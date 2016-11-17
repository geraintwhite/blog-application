import test from 'tape';

import tag_tests from './tag'
import user_tests from './user'
import article_tests from './article'
import author_tests from './author'
import comment_tests from './comment'


test('Tag tests', tag_tests);
test('User tests', user_tests);
test('Article tests', article_tests);
test('Author tests', author_tests);
test('Comment tests', comment_tests);
