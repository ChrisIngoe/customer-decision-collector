const express = require('express'),
  path = require('path'),
  config = require('config'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  expressSession = require('express-session'),
  bodyParser = require('body-parser'),
  Mailgun = require('mailgun-js'),
  passwordless = require('passwordless'),
  MemoryStore = require('passwordless-memorystore'),
  routes = require('./routes/index');

const emailApiKey = config.get('email.apiKey'),
  emailDomain = config.get('email.domain'),
  emailFrom = config.get('email.from'),
  emailSubject = config.get('email.subject'),
  host = config.get('website.host');

const app = express();
const mailgun = new Mailgun({ apiKey: emailApiKey, domain: emailDomain });

//const { createHistogram } = require('perf_hooks');
//const { getMaxListeners } = require('process');

passwordless.init(new MemoryStore());
passwordless.addDelivery(function (
  tokenToSend,
  uidToSend,
  recipient,
  callback,
) {
  let data = {
    from: emailFrom,
    to: recipient,
    subject: emailSubject,
    html:
      'Great! Almost there, just click this link then answer the question: ' +
      host +
      '?token=' +
      tokenToSend +
      '&uid=' +
      encodeURIComponent(uidToSend),
  };
  mailgun.messages().send(
    data,
    function (err) {
      if (err) {
        //console.log(err);
      } else {
        callback(err);
      }
    },
    { ttl: 1000 * 60 * 10 },
  );
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: config.get('cookie.secret'),
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 10, secure: config.get('cookie.secure') },
  }),
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/' }));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
    page: 'Error',
  });
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
  // eslint-disable-next-line no-console
  console.log('Express server listening on port ' + server.address().port);
});
