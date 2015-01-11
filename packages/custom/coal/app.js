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
    link: 'coalmanage',
    roles: ['worker'],
    menu: 'main',
    name: 'coal',
  });

  //come manage
  Coal.menus.add({
    title: '来煤',
    link: 'coalmanage/come',
    roles: ['worker'],
    menu: 'main/coal',
    name: 'come',
  });

  Coal.menus.add({
    title: '历史来煤',
    link: 'coalmanage.comehistory',
    roles: ['worker'],
    menu: 'main/coal/come',
    name: 'history',
  });

  Coal.menus.add({
    title: '来煤录入',
    link: 'coalmanage.comecreate',
    roles: ['worker'],
    menu: 'main/coal/come',
    name: 'create',
  });

  Coal.menus.add({
    title: '来煤审核',
    link: 'coalmanage.comecheck',
    roles: ['worker'],
    menu: 'main/coal/come',
    name: 'check',
  });

  //library manage
  Coal.menus.add({
    title: '化验',
    link: 'coalmanage/lab',
    roles: ['admin'],
    menu: 'main/coal',
    name: 'lab'
  });

  Coal.menus.add({
    title: '化验记录',
    link: 'coalmanage/lab/history',
    roles: ['admin'],
    menu: 'main/coal/lab',
    name: 'history'
  });

  //consume manage
  Coal.menus.add({
    title: '用煤',
    link: 'coalmanage/consume',
    roles: ['worker'],
    menu: 'main/coal',
    name: 'consume',
  });

  Coal.menus.add({
    title: '用煤记录',
    link: 'coalmanage/consume/history',
    roles: ['worker'],
    menu: 'main/coal/consume',
    name: 'history',
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
