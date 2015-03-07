'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Binlocation = mongoose.model('Binlocation'),
  GoodReceipt = mongoose.model('GoodReceipt'),
  _ = require('lodash');


/**
 * Create an binlocation
 */
exports.createGoodReceipt = function(req, res) {
  console.log('createGoodReceipt req.body:',req.body);
  var gr = new GoodReceipt(req.body);
  gr.status = 'new';
  gr.creator = req.user;
  gr.bin = req.bin;
  gr.binName = req.bin.name;
  gr.mineral = req.mineral;
  gr.mineralName = req.mineral.name;
  gr.actualChemicalAttrs = gr.inputChemicalAttrs;

  gr.save(function(err) {
    if (err) {
      console.error('save gr error:',err);
      return res.status(500).json({
        error: 'Cannot save the gr'
      });
    }
    res.json(gr);
  });
};

/**
 * List of getGoodReceipts
 */
exports.getGoodReceipts = function(req, res) {
  var pageNumber = req.query.pageNumber;
  var pageSize = req.query.pageSize; 
  var status = !!req.query.status ? req.query.status: 'new';
  GoodReceipt.getRecords(pageNumber, pageSize, status,
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


/**
 * List of binlocation basic infos
 */
exports.getBinBasicInfo = function(req, res) {
  Binlocation.getBinBasicInfoList(
    function(error, binlist) {
      if (error) {
        console.error(error);
        res.status(500).json({
          error: err
        });
      } else {
        res.json(binlist);
      }
    });
};
