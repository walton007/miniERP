'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Mineral = mongoose.model('Mineral'),
  Quality = mongoose.model('Quality'),
  Warehouse = mongoose.model('Warehouse'),
  Binlocation = mongoose.model('Binlocation'),
  _ = require('lodash');


/**
 * Create an mineral
 */
exports.createMineral = function(req, res) {
  var mineral = new Mineral(req.body);
  mineral.creator = req.user;
  mineral.quality = req.quality;
  mineral.qualityName = req.quality.name;

  mineral.save(function(err) {
    if (err) {
      console.error('failed to create mineral:', err);
      return res.status(500).json({
        error: 'Cannot save the mineral'
      });
    }
    res.json(mineral);

  });
};

/**
 * Update an mineral
 */
exports.updateMineral = function(req, res) {
  var mineral = req.mineral;

  mineral = _.extend(mineral, {'comment': req.body.comment});

  mineral.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the mineral'
      });
    }
    res.json(mineral);
  });
};

/**
 * Delete an mineral
 */
exports.destroyMineral = function(req, res) {
  var mineral = req.mineral;
  mineral.markDelete().then(
    function() {
      res.json(mineral);
    }, 
    function() {
      res.status(500).json({
        error: 'Cannot delete the mineral'
      });
    });
};

/**
 * List of Mineral
 */
exports.allMinerals = function(req, res) {
  Mineral.find({deleteFlag: false}).sort('-created').exec(function(err, minerals) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the minerals'
      });
    }
    res.json(minerals);

  });
};

/**
 * Create an quality
 */
exports.createQuality = function(req, res) {
  console.log('createQuality Quality req.body:',req.body);
  var quality = new Quality(req.body);
  quality.creator = req.user;

  quality.save(function(err) {
    if (err) {
      console.error('save Quality error:',err);
      return res.status(500).json({
        error: 'Cannot save the quality'
      });
    }
    res.json(quality);

  });
};

/**
 * Update an quality
 */
exports.updateQuality = function(req, res) {
  var quality = req.quality;

  quality = _.extend(quality, {'comment': req.body.comment});

  quality.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the quality'
      });
    }
    res.json(quality);

  });
};

/**
 * Delete an mineral
 */
exports.destroyQuality = function(req, res) {
  var quality = req.quality;
  console.log('destroyQuality quality:', quality);
  
  quality.markDelete().then(
    function() {
      res.json(quality);
    }, 
    function() {
      res.status(500).json({
        error: 'Cannot delete the quality'
      });
    });
};

/**
 * List of Qualities
 */
exports.allQualities = function(req, res) {
  Quality.find({deleteFlag: false}).sort('-created').exec(function(err, qualities) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the Quality'
      });
    }
    res.json(qualities);

  });
};


//Warehouse
/**
 * Create an warehouse
 */
exports.createWarehouse = function(req, res) {
  console.log('createWarehouse Quality req.body:',req.body);
  var warehouse = new Warehouse(req.body);
  warehouse.creator = req.user;

  warehouse.save(function(err) {
    if (err) {
      console.error('save warehouse error:',err);
      return res.status(500).json({
        error: 'Cannot save the warehouse'
      });
    }
    res.json(warehouse);

  });
};

/**
 * Update an warehouse
 */
exports.updateWarehouse = function(req, res) {
  var warehouse = req.warehouse;

  warehouse = _.extend(warehouse, {'comment': req.body.comment});

  warehouse.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the warehouse'
      });
    }
    res.json(warehouse);

  });
};

/**
 * Delete an warehouses
 */
exports.destroyWarehouse = function(req, res) {
  var warehouse = req.warehouse;
  warehouse.markDelete().then(
    function() {
      res.json(warehouse);
    }, 
    function() {
      res.status(500).json({
        error: 'Cannot delete the warehouse'
      });
    });
};

/**
 * List of warehouses
 */
exports.allWarehouses = function(req, res) {
  Warehouse.find({deleteFlag: false}).sort('-created').exec(function(err, warehouses) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the Warehouse'
      });
    }
    res.json(warehouses);

  });
};


//binlocation

/**
 * Create an binlocation
 */
exports.createBin = function(req, res) {
  console.log('createBin req.body:',req.body);
  var bin = new Binlocation(req.body);
  bin.creator = req.user;
  bin.warehouse = req.warehouse;
  bin.warehouseName = req.warehouse.name;
  //set create time 5 days before
  bin.created =  new Date(Date.now() - 5*24 * 60 * 60 * 1000); 
  // console.log()

  bin.save(function(err) {
    if (err) {
      console.error('save binlocation error:',err);
      return res.status(500).json({
        error: 'Cannot save the binlocation'
      });
    }
    res.json(bin);
  });
};

/**
 * Update a binlocation
 */
exports.updateBin = function(req, res) {
  console.log('updateBin');
  var oldBin = req.bin;
  var newBinVal = _.extend(req.body, {
    creator: req.user
  });

  console.log('updateBin 1 newBinVal:', newBinVal);

  var q = Binlocation.updateBinManually(oldBin, newBinVal);
  q.then(function(newBin) {
    console.log('finish updateBinManually');
    res.json(newBin); 
  }, function(err) {
    console.error('updateBin error:', err);
    return res.status(500).json({
        error: 'Cannot save the binlocation'
      });
  });
};

/**
 * Delete an binlocation
 */
exports.destroyBin = function(req, res) {
  var bin = req.bin;
  bin.markDelete().then(
    function() {
      res.json(bin);
    }, 
    function() {
      res.status(500).json({
        error: 'Cannot delete the bin'
      });
    });
};

/**
 * List of binlocation
 */
exports.allBins = function(req, res) {
  Binlocation.getAllBinList().then(
    function(bins) {
      res.json(bins);
    },
    function(err) {
      return res.status(500).json({
        error: err
      });
    });
};

/**
 * List of binChangelogs
 */
exports.binChangelogs = function(req, res) {
  var pageNumber = req.query.pageNumber;
  var pageSize = req.query.pageSize; 
  Binlocation.getBinChangelogs(pageNumber, pageSize,
     function(error, pageCount, paginatedResults, itemCount) {
      if (error) {
        console.error(error);
        res.status(500).json({
          error: err
        });
      } else {
        res.json({
          pageCount: pageCount,
          paginatedResults: paginatedResults,
          itemCount: itemCount
        });
        console.log('Pages:', pageCount);
        console.log('itemCount:', itemCount);
        // console.log(paginatedResults);
      }
    });
};


