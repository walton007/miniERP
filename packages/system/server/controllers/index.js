'use strict';

var mean = require('meanio');

exports.render = function(req, res) {

  var modules = [];
  // Preparing angular modules list with dependencies
  for (var name in mean.modules) {
    if (!req.user && ['access', 'system', 'users', 'theme'].indexOf(name) === -1) {
      // continue;
    };
    modules.push({
      name: name,
      module: 'mean.' + name,
      angularDependencies: mean.modules[name].angularDependencies
    });
  }

  function isAdmin() {
    return req.user && req.user.roles.indexOf('admin') !== -1;
  }

 // console.log('modules:', mean.modules);
 //  console.log('req.user is:', req.user );
 //  console.log('res.aggregatedassets is:', res.locals.aggregatedassets );

  //filter res.locals.aggregatedassets for non registered user
  // if (!req.user) {

  //    res.locals.aggregatedassets2 =    { header: { css: [  ], js: [] },
  // footer: 
  //  { css: 
  //     [ '/packages/system/public/assets/css/common.css',
  //       '/packages/theme/public/assets/css/loginForms.css',
  //       '/packages/theme/public/assets/css/theme.css' ],
  //    js: 
  //     [ '/bower_components/jquery/dist/jquery.min.js',
  //       '/bower_components/angular/angular.min.js',

  //       '/bower_components/angular-cookies/angular-cookies.min.js',
  //       '/bower_components/angular-resource/angular-resource.min.js',
  //       '/bower_components/angular-ui-router/release/angular-ui-router.min.js',
  //       '/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
  //       '/bower_components/angular-ui-router.stateHelper/statehelper.min.js',
  //       '/bower_components/bootstrap/dist/js/bootstrap.min.js',
  //       '/packages/system/public/init.js',
  //       '/packages/system/public/system.js',
  //       '/packages/theme/public/theme.js',
  //       '/packages/users/public/users.js',
        
  //       '/packages/system/public/controllers/header.js',
  //       '/packages/system/public/controllers/index.js',
  //       '/packages/system/public/routes/system.js',
  //       '/packages/system/public/services/global.js',
  //       '/packages/system/public/services/interceptor.js',
  //       '/packages/system/public/services/menus.js',
  //       '/packages/theme/public/controllers/theme.js',
  //       '/packages/theme/public/routes/theme.js',
  //       '/packages/theme/public/services/theme.js',
  //       '/packages/users/public/controllers/meanUser.js',
  //       '/packages/users/public/routes/auth.js',
  //       '/packages/users/public/services/meanUser.js'] } };
  // };
  
  // Send some basic starting info to the view
  res.render('index', {
    user: req.user ? {
      name: req.user.name,
      _id: req.user._id,
      username: req.user.username,
      roles: req.user.roles
    } : {},
    modules: modules,
    isAdmin: isAdmin,
    adminEnabled: isAdmin() && mean.moduleEnabled('mean-admin')
  });
};
