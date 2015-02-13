'use strict';
console.log('compile goodIssue');

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Q = require('q'),
  math = require('mathjs'),
  commonUtil = require('./commonUtil');

var BaseSchema = commonUtil.BaseSchema;
var autoinc = require('./autoinc');

var GoodIssueSchema = BaseSchema.extend({
  issueDate: {
    type: Date,
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

  actualWeight: {
    type: Number,
    required: false
  },

  planWeight: {
    type: Number,
    required: true,
    default: 0,
  },

  status: {
    type: String,
    required: true,
    default: 'planning',
    enum: ['planning', 'checked', 'outdated'],
  },

  warnflag: {
    type: Boolean,
    default: false,
    required: true,
  },

});

var goodIssueOutdateThreshold = 72;
GoodIssueSchema.static('updateOutdatedRecord',
  function() {
    var dtd = Q.defer();
    var now = new Date();
    var GoodIssue = mongoose.model('GoodIssue');
    //we consider goodIssueWarningThreshold conditon only
    GoodIssue.find({
      markDelete: false,
      status: 'planning',
    }).sort('issueDate')
    .exec(function(err, goodIssues) {
      if (err) {
        dtd.reject(err);
        return;
      };
      var dtdArr = [];
      for (var i = goodIssues.length - 1; i >= 0; i--) {
        var goodIssue = goodIssues[i];
        var dur = new Date(math.abs(now -goodIssue.issueDate));
        if (dur.getUTCHours() > goodIssueOutdateThreshold) {
          dtdArr.push(goodIssue.markOutdated());
        }
      };
      if (dtdArr.length == 0) {
        dtd.resolve();
        return;
      };
      Q.all(dtdArr).then(function() {
        dtd.resolve();
      }, function(err) {
        dtd.reject(err);
      })

    }); 
    return dtd.promise;
  });

GoodIssueSchema.method('markOutdated', function( ) {
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

var goodIssueWarningThreshold = 2000;
GoodIssueSchema.method('recordActualCost', function(actualWeight) {
  var deferred = Q.defer();
  if (this.status !== 'planning') {
    deferred.reject('only planning record can be update');
    return deferred.promise;
  };

  if (actualWeight < 0) {
    deferred.reject('invalid weight');
    return deferred.promise;
  };

  this.actualWeight = actualWeight;
  this.status = 'checked';
  this.warnflag = (math.abs(actualWeight - this.planWeight) > goodIssueWarningThreshold);
  this.save(function(err, savedObj, numberAffected) {
    if (err) {
      deferred.reject(err);
      return;
    }
    deferred.resolve(savedObj);
  });
  return deferred.promise;
});

autoinc.plugin(GoodIssueSchema, {
  model: 'GoodIssue',
  field: 'sequence',
  start: 1
});
mongoose.model('GoodIssue', GoodIssueSchema);