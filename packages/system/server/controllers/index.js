'use strict';

var mean = require('meanio');

exports.render = function(req, res) {

  var modules = [];
  // Preparing angular modules list with dependencies
  for (var name in mean.modules) {
    modules.push({
      name: name,
      module: 'mean.' + name,
      angularDependencies: mean.modules[name].angularDependencies
    });
  }

  function isAdmin() {
    return req.user && req.user.roles.indexOf('admin') !== -1;
  }

  function getMenus() {
      var roles = req.user ? req.user.roles : ['anonymous'];

      var menu = 'main';
      var defaultMenu = [];
   
      var menus = mean.menus.get({
        roles: roles,
        menu: menu,
        defaultMenu: defaultMenu.map(function(item) {
          return JSON.parse(item);
        })
      });

      return menus.sort( function(a,b) {
        var sortArray  = ['overview', 'coal', 'systemsetting'];
        return sortArray.indexOf(a.name) - sortArray.indexOf(b.name);
      });
    }

    console.log('index render: req.user:', req.user);
  
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
    adminEnabled: isAdmin() && mean.moduleEnabled('mean-admin'),
    menus: getMenus()
  });
};
