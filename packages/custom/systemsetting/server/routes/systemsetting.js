'use strict';

var settings = require('../controllers/settings');
// Settings authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

var consoleRequest = function(req, res, next) {
  console.log('consoleRequest ');
  next();
};

// The Package is past automatically as first parameter
module.exports = function(Systemsetting, app, auth, database, coalutil) {
  app.route('/minerals')
    .get(settings.allMinerals)
    .post(auth.requiresLogin, coalutil.getQuality, settings.createMineral);

  app.route('/minerals/:mineralId')
    .put(auth.isMongoId, auth.requiresLogin, settings.updateMineral)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroyMineral);

  // Finish with setting up the mineralId param
  app.param('mineralId', coalutil.mineral);

  //coalquality
  app.route('/coalQualities')
    .get(settings.allQualities)
    .post(auth.requiresLogin, settings.createQuality);

  app.route('/coalQualities/:coalQualityId')
    .put(auth.isMongoId, auth.requiresLogin, settings.updateQuality)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroyQuality);

  // Finish with setting up the coalQualityId param
  app.param('coalQualityId', coalutil.coalquality);

  //warehouses
  app.route('/warehouses')
    .get(settings.allWarehouses)
    .post(auth.requiresLogin, settings.createWarehouse);

  app.route('/warehouses/:warehouseId')
    .put(auth.isMongoId, auth.requiresLogin, settings.updateWarehouse)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroyWarehouse);

  // Finish with setting up the warehouseId param
  app.param('warehouseId', coalutil.warehouse);

  // bins
  app.route('/bins')
    .get(settings.allBins)
    .post(auth.requiresLogin, coalutil.getWarehouse, settings.createBin);

  app.route('/bins/:binId')
    .put(auth.isMongoId, auth.requiresLogin, settings.updateBin)
    .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, settings.destroyBin);

  // Finish with setting up the binId param
  app.param('binId', coalutil.bin);

  // binChangelogs
  app.route('/binChangelogs')
    .get(settings.binChangelogs);
};
