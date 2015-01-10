'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Coal = new Module('coal');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Coal.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Coal.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Coal.menus.add({
    title: '存煤管理',
    link: 'coalmanager',
    roles: ['worker'],
    menu: 'main',
    name: 'coal',
  });

  Coal.menus.add({
    title: '来煤',
    link: 'coalmanager',
    roles: ['worker'],
    menu: 'main/coal',
    name: 'come',
  });

  Coal.menus.add({
    title: '用煤',
    link: 'coalmanager',
    roles: ['worker'],
    menu: 'main/coal',
    name: 'consume',
  });

  Coal.menus.add({
    title: '化验',
    link: 'coalmanager',
    roles: ['admin'],
    menu: 'main/coal',
    name: 'sub3'
  });
  
  Coal.aggregateAsset('css', 'coal.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Coal.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Coal.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Coal.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Coal;
});
