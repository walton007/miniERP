'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Systemsetting = new Module('systemsetting');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Systemsetting.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Systemsetting.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Systemsetting.menus.add({
    title: '系统设置',
    link: 'systemsetting',
    roles: ['admin'],
    menu: 'main',
    name: 'systemsetting',
    weight: 4,
  });

  Systemsetting.menus.add({
    title: '系统设置',
    link: 'systemsetting.inventory',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting',
    name: 'one'
  });

  Systemsetting.menus.add({
    title: '煤堆设定',
    link: 'systemsetting.inventory',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting/one',
    name: 'inventory',
    isdefault : true,
  });

  Systemsetting.menus.add({
    title: '矿源设定',
    link: 'systemsetting.coals',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting/one',
    name: 'coals'
  });

  Systemsetting.menus.add({
    title: '用户设定',
    link: 'systemsetting.users',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting/one',
    name: 'users'
  });

  Systemsetting.menus.add({
    title: '查看日志',
    link: 'systemsetting.logs',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting/one',
    name: 'logs'
  });
  
  Systemsetting.aggregateAsset('css', 'systemsetting.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Systemsetting.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Systemsetting.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Systemsetting.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Systemsetting;
});
