'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Quality = mongoose.model('Quality'),
  Mineral = mongoose.model('Mineral'),
  Warehouse = mongoose.model('Warehouse'),
  Binlocation = mongoose.model('Binlocation'),
  GoodReceipt = mongoose.model('GoodReceipt'),
  GoodIssue = mongoose.model('GoodIssue'),
  _ = require('lodash');


function consoleRequest(req, res, next) {
  console.log('consoleRequest ');
  next();
};

console.log('in commonutil file');
/**
 * Find quality by id
 */
function coalquality(req, res, next, id) {
  console.log('load quality id:',id);
  Quality.load(id, function(err, quality) {
    if (err) return next(err);
    if (!quality) return next(new Error('Failed to load quality ' + id));
    req.quality = quality;
    next();
  });
};

function getQuality(req, res, next) {
  if (!req.body.qualityid) {
    return res.status(401).send('invalid qualityid');
  }

  coalquality(req, res, next, req.body.qualityid);
};

/**
 * Find mineral by id
 */
function mineral(req, res, next, id) {
  Mineral.load(id, function(err, mineral) {
    if (err) return next(err);
    if (!mineral) return next(new Error('Failed to load mineral ' + id));
    req.mineral = mineral;
    next();
  });
};

function getMineral(req, res, next) {
  if (!req.body.mineralid) {
    return res.status(401).send('invalid mineralid');
  }

  mineral(req, res, next, req.body.mineralid);
};

/**
 * Find warehouse by id
 */
function warehouse(req, res, next, id) {
  Warehouse.load(id, function(err, warehouse) {
    if (err) return next(err);
    if (!warehouse) return next(new Error('Failed to load warehouse ' + id));
    req.warehouse = warehouse;
    next();
  });
};

function getWarehouse(req, res, next) {
  if (!req.body.warehouseId) {
    return res.status(401).send('invalid warehouseId');
  }
  warehouse(req, res, next, req.body.warehouseId);
};

/**
 * Find binlocation by id
 */
function bin(req, res, next, id) {
  // console.log('get bin id:', id);
  Binlocation.load(id, function(err, binlocation) {
    // console.log(17,binlocation);
    if (err) {
      console.error('load bin err:',err);
      return res.status(500).json({
        error: err
      });
    }
    console.log(18);
    if (!binlocation) {
      console.error('binlocation is null:',err);
      return res.status(500).json({
        error: 'failed to find binlocation'
      });
    } 
    req.bin = binlocation;
    console.log(19);
    next();
  });
};

function getBin(req, res, next) {
  if (!req.body.binid) {
    return res.status(401).send('invalid binid');
  }

  bin(req, res, next, req.body.binid);
};

// good receipt
function goodReceipt(req, res, next, id) {
  GoodReceipt.load(id, function(err, gr) {
    if (err) return next(err);
    if (!gr) return next(new Error('Failed to load goodReceipt ' + id));
    	req.gr = gr;
    next();
  });
};

// good issue
function goodIssue(req, res, next, id) {
  GoodIssue.load(id, function(err, gi) {
    if (err) return next(err);
    if (!gi) return next(new Error('Failed to load goodIssue ' + id));
      req.gi = gi;
    next();
  });
}

module.exports = {
	consoleRequest: consoleRequest,

	coalquality: coalquality,
	getQuality: getQuality,

	mineral: mineral,
	getMineral: getMineral,

	warehouse: warehouse,
	getWarehouse: getWarehouse,

	bin: bin,
	getBin: getBin,

	goodReceipt: goodReceipt,
  goodIssue: goodIssue
};