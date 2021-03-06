var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, results) {
    if (err) {
      console.error(err);
    } else {
      res.status(200).send(results);
    }
  })

  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  util.getUrlTitle(uri, function(err, title) {
    if (err) {
      console.log('Error reading URL heading: ', err);
      return res.sendStatus(404);
    } else {
      Link.create({url: uri, title: title, baseUrl: req.headers.origin}, function (err, results) {
        if (err) {
          console.error(err);
        } else {
          res.status(200).send(results);
        }
      });
    }
  });

};

//   new Link({ url: uri }).fetch().then(function(found) {
//     if (found) {
//       res.status(200).send(found.attributes);
//     } else {
//       util.getUrlTitle(uri, function(err, title) {
//         if (err) {
//           console.log('Error reading URL heading: ', err);
//           return res.sendStatus(404);
//         }
//         var newLink = new Link({
//           url: uri,
//           title: title,
//           baseUrl: req.headers.origin
//         });
//         newLink.save().then(function(newLink) {
//           Links.add(newLink);
//           res.status(200).send(newLink);
//         });
//       });
//     }
//   });
// };

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({username: username}, function(err, results) {
    if (err) {
      console.error(err);
      res.redirect('/login');
    } else if (results[0]) {
      results[0].comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, results);
        } else {
          res.redirect('/login');
        }
      })
    } else {
      res.redirect('/login');
    }
  })

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       });
  //     }
  //   });

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.create({username: username, password: password}, function(err, results) {
    if (err) {
      console.error(err);
      res.redirect('/signup');
    } else {
      util.createSession(req, res, results);
    }
  });

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });

};

exports.navToLink = function(req, res) {

  Link.find({code: req.params[0]}, function(err, results) {
    if (err) {
      console.error(err);
    } else {
      if (!results[0] || !results[0].url) {
        res.redirect('/');
      } else {
        var newVisits = results[0].visits + 1;
        Link.update({code: req.params[0]}, {visits: 1}, function(err) {
          if (err) {
            console.error(err);
          }
          res.redirect(results[0].url);
        });
      }
    }
  })
  
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });

};