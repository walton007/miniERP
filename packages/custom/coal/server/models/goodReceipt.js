'use strict';
console.log('compile goodReceipt');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Q = require('q'),
  math = require('mathjs'),
  mongoosePaginate = require('mongoose-paginate'),
  commonUtil = require('./commonUtil');

var BaseSchema = commonUtil.BaseSchema;
var ChemicalAttrSchemaDef = commonUtil.ChemicalAttrSchemaDef;
var autoinc = require('./autoinc');

var GoodReceiptSchema = BaseSchema.extend({
  receiveDate: {
    type: Date,
    required: true,
  },
  mineralName: {
    type: String,
    required: true,
    trim: true
  },

  mineral: {
    type: Schema.ObjectId,
    ref: 'Mineral'
  },

  binName: {
    type: String,
    required: true,
    trim: true
  },

  bin: {
    type: Schema.ObjectId,
    ref: 'Binlocation'
  },

  weight: {
    type: Number,
    required: true
  },

  inputChemicalAttrs: ChemicalAttrSchemaDef,

  actualChemicalAttrs: ChemicalAttrSchemaDef,
  
  status: {
    type: String,
    required: true,
    default: 'new',
    enum: ['new', 'checked', 'outdated'],
  },

});

GoodReceiptSchema.static('getRecords', 
  function(pageNumber, resultsPerPage, status, callback) {
    var GoodReceipt = mongoose.model('GoodReceipt');
    var queryConds = {deleteFlag: false, 'status': status};
    if (status === 'all') {
      // queryConds = {deleteFlag: false, 'status': { $in: ['new', 'checked'] }};
      queryConds = {deleteFlag: false};
    };

    GoodReceipt.paginate(queryConds, 
      pageNumber, resultsPerPage, callback, {sortBy:'-receiveDate'});

  }
);

 
var goodReceiptOutdateThreshold = 72;
GoodReceiptSchema.static('updateOutdatedRecord',
  function() {
    var dtd = Q.defer();
    var now = new Date();
    var GoodReceipt = mongoose.model('GoodReceipt');
    //we consider goodReceiptOutdateThreshold conditon only
    GoodReceipt.find({
      markDelete: false,
      status: 'new',
    }).sort('receiveDate')
    .exec(function(err, goodReceipts) {
      if (err) {
        dtd.reject(err);
        return;
      }
      var dtdArr = [];
      for (var i = goodReceipts.length - 1; i >= 0; i=i-1) {
        var goodReceipt = goodReceipts[i];
        var dur = new Date(math.abs(now -goodReceipt.receiveDate));
        if (dur.getUTCHours() > goodReceiptOutdateThreshold) {
          dtdArr.push(goodReceipt.markOutdated());
        }
      }
      if (dtdArr.length === 0) {
        dtd.resolve();
        return;
      }
      Q.all(dtdArr).then(function() {
        dtd.resolve();
      }, function(err) {
        dtd.reject(err);
      });

    }); 
    return dtd.promise;
  });

GoodReceiptSchema.method('markOutdated', function( ) {
  this.status = 'outdated';

  var deferred = Q.defer();
  this.save(function(err, savedObj, numberAffected) {
    if (err) {
      deferred.reject(err);
      return;
    }
    deferred.resolve(savedObj);

  });
  return deferred.promise;
});

GoodReceiptSchema.method('chemicalCheck', function() {
  var deferred = Q.defer();
  if (this.status !== 'new') {
    deferred.reject('only new record can be checked');
    return deferred.promise;
  }

  this.status = 'checked';
  this.save(function(err, savedObj, numberAffected) {
    // console.log('============2 err:', err, savedObj);
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve(savedObj);

  });
  return deferred.promise;
});

autoinc.plugin(GoodReceiptSchema, {
  model: 'GoodReceipt',
  field: 'sequence',
  start: 1
});

GoodReceiptSchema.plugin(mongoosePaginate);
mongoose.model('GoodReceipt', GoodReceiptSchema);