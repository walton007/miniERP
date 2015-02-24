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
    isdefault : true,
  });

  //////////////////////////////////
  Systemsetting.menus.add({
    title: '基础数据设置',
    link: 'systemsetting.warehouses',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting',
    name: 'one',  
    isdefault : true,
  });

  Systemsetting.menus.add({
    title: '煤品设置',
    link: 'systemsetting.quality',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting/one',
    name: 'quality',
  });

  Systemsetting.menus.add({
    title: '矿场设置',
    link: 'systemsetting.warehouses',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting/one',
    name: 'warehouse',
  });

  Systemsetting.menus.add({
    title: '矿源设定',
    link: 'systemsetting.minerals',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting/one',
    name: 'minerals'
  });

  Systemsetting.menus.add({
    title: '煤堆设定',
    link: 'systemsetting.binlocation',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting/one',
    name: 'binlocation',
  });

  //////////////////////////////////
  Systemsetting.menus.add({
    title: '用户管理设置',
    link: 'systemsetting.users',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting',
    name: 'two',  
  });

  Systemsetting.menus.add({
    title: '用户设定',
    link: 'systemsetting.users',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting/two',
    name: 'users',
  });

  Systemsetting.menus.add({
    title: '查看日志',
    link: 'systemsetting.logs',
    roles: ['admin', 'worker'],
    menu: 'main/systemsetting/two',
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
