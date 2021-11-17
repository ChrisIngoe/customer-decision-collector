const express = require('express'),
  passwordless = require('passwordless'),
  config = require('config');

const testEmailAddress = config.get('email.testEmailAddress');

const router = express.Router();

const users = [{ id: 10002345, email: testEmailAddress }];

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { page: 'Home', user: req.user });
});

/* GET question site. */
router.get('/question', passwordless.restricted(), function (req, res) {
  res.render('question', { page: 'Question', user: req.user });
});

/* GET login screen. */
router.get('/login', function (req, res) {
  res.render('login', { page: 'Login', user: req.user });
});

/* GET logout. */
router.get('/logout', passwordless.logout(), function (req, res) {
  res.redirect('/');
});

/* POST login screen. */
router.post(
  '/sendtoken',
  passwordless.requestToken(function (user, delivery, callback) {
    //console.log(user);
    for (let i = users.length - 1; i >= 0; i--) {
      if (users[i].email === user.toLowerCase()) {
        return callback(null, users[i].id);
      }
    }
    callback(null, null);
  }),
  function (req, res) {
    res.render('sent', { page: 'Sent' });
  },
);

module.exports = router;
