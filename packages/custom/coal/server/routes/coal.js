'use strict';
var controller = require('../controllers/coal');

// The Package is past automatically as first parameter
module.exports = function(Coal, app, auth, database, coalutil) {
  // console.log('111 coalutil:', coalutil);
  app.route('/basicBins')
    .get(controller.getBinBasicInfo);

  app.route('/goodReceipts')
    .get(controller.getGoodReceipts)
    .post(auth.requiresLogin, coalutil.getMineral, coalutil.getBin, controller.createGoodReceipt);

  app.route('/goodReceipts/:grId')
    .put(auth.isMongoId, auth.requiresLogin, controller.updateGoodReceipt);
    // .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroyMineral);

  app.param('grId', coalutil.goodReceipt);

  // Good Issue
  app.route('/goodIssues')
    .get(controller.getGoodIssues)
    .post(auth.requiresLogin, coalutil.getBin, controller.createGoodIssue);

  app.route('/goodIssues/:giId')
    .put(auth.isMongoId, auth.requiresLogin, controller.updateGoodIssue);
    // .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroyMineral);

  app.param('giId', coalutil.goodIssue);
   
};
