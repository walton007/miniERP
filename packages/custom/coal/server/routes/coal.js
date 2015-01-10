'use strict';

// The Package is past automatically as first parameter
module.exports = function(Coal, app, auth, database) {

  app.get('/coal/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/coal/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/coal/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/coal/example/render', function(req, res, next) {
    Coal.render('index', {
      package: 'coal'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
