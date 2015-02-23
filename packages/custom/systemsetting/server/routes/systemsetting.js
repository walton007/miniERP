'use strict';

var settings = require('../controllers/settings');
// Settings authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

var getQuality = function(req, res, next) {
  if (!req.body.qualityid) {
    return res.status(401).send('invalid qualityid');
  }

  settings.coalquality(req, res, next, req.body.qualityid);
};

// The Package is past automatically as first parameter
module.exports = function(Systemsetting, app, auth, database) {
  

  app.route('/minerals')
    .get(settings.allMinerals)
    .post(auth.requiresLogin, getQuality, settings.createMineral);

  app.route('/minerals/:mineralId')
    .put(auth.isMongoId, auth.requiresLogin, settings.updateMineral)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroyMineral);

  // Finish with setting up the articleId param
  app.param('mineralId', settings.mineral);

  //coalquality
  app.route('/coalQualities')
    .get(settings.allQualities)
    .post(auth.requiresLogin, getQuality, settings.createQuality);

  app.route('/coalQualities/:coalQualityId')
    // .put(auth.isMongoId, auth.requiresLogin, settings.updateQuality)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroyQuality);

  // Finish with setting up the articleId param
  app.param('coalQualityId', settings.coalquality);


  

  // app.get('/systemsetting/example/auth', auth.requiresLogin, function(req, res, next) {
  //   res.send('Only authenticated users can access this');
  // });

  // app.get('/systemsetting/example/admin', auth.requiresAdmin, function(req, res, next) {
  //   res.send('Only users with Admin role can access this');
  // });

  // app.get('/systemsetting/example/render', function(req, res, next) {
  //   Systemsetting.render('index', {
  //     package: 'systemsetting'
  //   }, function(err, html) {
  //     //Rendering a view from the Package server/views
  //     res.send(html);
  //   });
  // });
};



// 'use strict';

// var articles = require('../controllers/articles');



// module.exports = function(Articles, app, auth) {

  
//   app.route('/articles/:articleId')
//     .get(auth.isMongoId, articles.show)
//     .put(auth.isMongoId, auth.requiresLogin, hasAuthorization, articles.update)
//     .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, articles.destroy);

//   // Finish with setting up the articleId param
//   app.param('articleId', articles.article);
// };
