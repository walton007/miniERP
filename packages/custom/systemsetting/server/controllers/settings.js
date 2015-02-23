'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Mineral = mongoose.model('Mineral'),
  Quality = mongoose.model('Quality'),
  _ = require('lodash');


/**
 * Find mineral by id
 */
exports.mineral = function(req, res, next, id) {
  Mineral.load(id, function(err, mineral) {
    if (err) return next(err);
    if (!mineral) return next(new Error('Failed to load mineral ' + id));
    req.mineral = mineral;
    next();
  });
};

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
 * Find quality by id
 */
exports.coalquality = function(req, res, next, id) {
  Quality.load(id, function(err, quality) {
    if (err) return next(err);
    if (!quality) return next(new Error('Failed to load quality ' + id));
    req.quality = quality;
    next();
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
  var article = req.article;

  article = _.extend(article, req.body);

  article.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot update the article'
      });
    }
    res.json(article);

  });
};

/**
 * Delete an mineral
 */
exports.destroyQuality = function(req, res) {
  var quality = req.quality;
  quality.markDelete.then(
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
