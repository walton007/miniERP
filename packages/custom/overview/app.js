'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Overview = new Module('overview');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Overview.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Overview.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Overview.menus.add({
    title: '总览',
    link: 'overview',
    roles: ['admin', 'worker'],
    menu: 'main',
    name: 'overview',
    weight: 1,
    isdefault : true,
  });

  Overview.menus.add({
    title: '总览',
    link: 'overview.inventory',
    roles: ['admin', 'worker'],
    menu: 'main/overview',
    name: 'one',
    isdefault : true,
  });

  Overview.menus.add({
    title: '查看存煤',
    link: 'overview.inventory',
    roles: ['admin', 'worker'],
    menu: 'main/overview/one',
    name: 'sub1',
    isdefault : true,
  });

  Overview.menus.add({
    title: '报表统计',
    link: 'overview.statistic',
    roles: ['admin', 'worker'],
    menu: 'main/overview/one',
    name: 'sub2'
  });
  
  Overview.aggregateAsset('css', 'overview.css');
  Overview.aggregateAsset('css', 'minierp.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Overview.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Overview.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Overview.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Overview;
});
