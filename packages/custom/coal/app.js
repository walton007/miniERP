'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Coal = new Module('coal');

Coal.util = require('./server/middlewares/common.js');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Coal.register(function(app, auth, database) {
  //We enable routing. By default the Package Object is passed to the routes
  Coal.routes(app, auth, database, Coal.util);

  [{
      'name': "来煤操作员",
      role: 'worker'
    },{
      'name': "来煤班长",
      role: 'workerAdmin'
    },{
      'name': "化验员",
      role: 'chemChecker'
    },{
      'name': "化验科科长",
      role: 'chemAdmin'
    },{
      'name': "用煤工",
      role: 'workerB'
    },{ 
      'name': "用煤班长",
      role: 'workerBAdmin'
    }, {
      'name': "超级管理员",
      role: 'admin'
    },{
      'name': "只读小超管",
      role: 'readOnlyAdmin'
    }];

  //We are adding a link to the main menu for all authenticated users
  Coal.menus.add({
    title: '存煤管理',
    link: 'coalmanage',
    roles: ['worker', 'workerAdmin', 'workerB', 'workerBAdmin', 'chemChecker', 'chemAdmin', 'admin', 'readOnlyAdmin'],
    menu: 'main',
    name: 'coal'
  });

  //come manage
  Coal.menus.add({
    title: '来煤管理',
    roles: ['worker', 'workerAdmin', 'admin', 'readOnlyAdmin'],
    menu: 'main/coal',
    name: 'come',
    link: 'coalmanage.comehistory',
    isdefault: true,
  });

  Coal.menus.add({
    title: '来煤录入',
    link: 'coalmanage.createGoodReceipt',
    roles: ['worker','admin'],
    menu: 'main/coal/come'
  });
  Coal.menus.add({
    title: '历史来煤',
    link: 'coalmanage.comehistory',
    roles: ['workerAdmin', 'admin', 'readOnlyAdmin'],
    menu: 'main/coal/come',
    name: 'history'
  });

  // Coal.menus.add({
  //   title: '来煤审核',
  //   link: 'coalmanage.comecheck',
  //   roles: ['worker'],
  //   menu: 'main/coal/come',
  //   name: 'check',
  //   weight: 3,
  // });

  //library manage
  Coal.menus.add({
    title: '化验管理',
    roles: ['chemChecker', 'chemAdmin', 'admin', 'readOnlyAdmin'],
    menu: 'main/coal',
    name: 'labcheck'
  });

  Coal.menus.add({
    title: '记录化验结果',
    link: 'coalmanage.labrecords',
    roles: ['chemChecker', 'admin'],
    menu: 'main/coal/labcheck',
    name: 'records'
  });

  Coal.menus.add({
    title: '历史化验纪录',
    link: 'coalmanage.labsHistory',
    roles: ['chemAdmin', 'admin', 'readOnlyAdmin'],
    menu: 'main/coal/labcheck',
    name: 'history'
  });

  // Coal.menus.add({
  //   title: '化验审核',
  //   link: 'coalmanage.labcheck',
  //   roles: ['admin'],
  //   menu: 'main/coal/lab',
  //   name: 'check'
  // });

  //consume manage
  Coal.menus.add({
    title: '用煤管理',
    roles: ['workerB', 'workerBAdmin', 'admin', 'readOnlyAdmin'],
    menu: 'main/coal',
    name: 'consume',
  });

  Coal.menus.add({
    title: '计划用煤',
    link: 'coalmanage.createGoodIssue',
    roles: ['workerBAdmin', 'admin'],
    menu: 'main/coal/consume',
    name: 'create',
  });

  Coal.menus.add({
    title: '用煤录入',
    link: 'coalmanage.recordConsume',
    roles: ['workerB', 'admin'],
    menu: 'main/coal/consume',
    name: 'record',
  });

  Coal.menus.add({
    title: '用煤历史纪录',
    link: 'coalmanage.consumehistory',
    roles: ['workerBAdmin', 'readOnlyAdmin', 'admin'],
    menu: 'main/coal/consume',
    name: 'check',
  });
  
  Coal.aggregateAsset('css', 'coal.css');


    Coal.consoleLog = function(msg) {
      console.log(msg);
    };

  return Coal;
});



