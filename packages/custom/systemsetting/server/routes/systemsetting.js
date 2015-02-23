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
    .post(auth.requiresLogin, settings.createQuality);

  app.route('/coalQualities/:coalQualityId')
    // .put(auth.isMongoId, auth.requiresLogin, settings.updateQuality)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroyQuality);

  // Finish with setting up the articleId param
  app.param('coalQualityId', settings.coalquality);

  //warehouses
  app.route('/warehouses')
    .get(settings.allWarehouses)
    .post(auth.requiresLogin, settings.createWarehouse);

  app.route('/warehouses/:warehouseId')
    // .put(auth.isMongoId, auth.requiresLogin, settings.updateQuality)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroyWarehouse);

  // Finish with setting up the articleId param
  app.param('warehouseId', settings.warehouse);
};
