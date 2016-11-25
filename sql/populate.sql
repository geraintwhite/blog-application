USE blog;

-- insert_users

INSERT INTO user (name, email, is_author, is_admin)
  VALUES ('Joe Bloggs', 'joe@bloggs.com', true, false),
         ('John Doe', 'john@doe.com', false, false),
         ('Bob Robson', 'bob@robson.com', false, false),
         ('Jim Turner', 'jim@turner.com', false, false),
         ('Jane Doe', 'jane@doe.com', true, false),
         ('Mary Hay', 'mary@hay.com', false, false),
         ('Fred Jones', 'fred@jones.com', false, false),
         ('Geraint White', 'mail@geraintwhite.co.uk', false, true);


-- insert_tags

INSERT INTO tag (tag_name)
  VALUES ('tech'), ('gadgets'), ('rant'), ('truth'), ('flowers');


-- insert_tag_subscribers

INSERT INTO tag_subscriber (tag_id, subscriber_id)
  VALUES (1, 2), (3, 7), (1, 8), (5, 8);


-- insert_author_subscribers

INSERT INTO author_subscriber (author_id, subscriber_id)
  VALUES (5, 6), (1, 8);


-- insert_articles

INSERT INTO article (author_id, title)
  VALUES (1, 'Some tech review'),
         (5, 'Gardening weekly'),
         (1, 'The problem with everything');

INSERT INTO article_tag (article_id, tag_id)
  VALUES (1, 1), (1, 2), (1, 3), (2, 5), (3, 3), (3, 4);


-- insert_comments

INSERT INTO comment (user_id, article_id, text)
  VALUES (3, 1, 'nice article'),
         (2, 1, 'I don\'t like that gadget'),
         (6, 2, 'I love tulips');

