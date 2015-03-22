'use strict';

// User routes use users controller
var users = require('../controllers/users'),
    config = require('meanio').loadConfig();

module.exports = function(MeanUser, app, auth, database, passport) {

  app.route('/logout')
    .get(users.signout);
  app.route('/users/me')
    .get(users.me);

  // Setting up the users api
  app.route('/register')
    .post(users.create);

  // app.route('/forgot-password')
  //   .post(users.forgotpassword);

  // app.route('/reset/:token')
  //   .post(users.resetpassword);

  // Setting up the userId param
  app.param('userId', users.user);

  // AngularJS route to check for authentication
  app.route('/loggedin')
    .get(function(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
    });

  // Setting the local strategy route
  app.route('/login')
    .post(passport.authenticate('local', {
      failureFlash: true
    }), function(req, res) {
      console.log('req.user login:', req.user.name);
      res.send({
        user: req.user,
        redirect: (req.user.roles.indexOf('admin') !== -1) ? req.get('referer') : false
      });
    });

  // AngularJS route to get config of social buttons
  // app.route('/get-config')
  //   .get(function (req, res) {
  //     res.send(config);
  //   });
 

};
