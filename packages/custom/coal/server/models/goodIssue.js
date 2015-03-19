'use strict';
console.log('compile goodIssue');

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
    required: true
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

GoodIssueSchema.pre('save', function(next) {
  console.log(1111);
  if (this.status === 'planning') {
    this.actualWeight = 0;
  } 
  next();
});

GoodIssueSchema.static('getRecords', 
  function(pageNumber, resultsPerPage, status, callback) {
    var GoodIssue = mongoose.model('GoodIssue');
    var queryConds = {deleteFlag: false, 'status': status};
    if (status === 'all') {
      // queryConds = {deleteFlag: false, 'status': { $in: ['new', 'checked'] }};
      queryConds = {deleteFlag: false};
    } else if (status === 'checkedAndoutdated') {
      queryConds = {deleteFlag: false, 'status': {$in: ['checked', 'outdated']}};
    };

    GoodIssue.paginate(queryConds, 
      pageNumber, resultsPerPage, callback, {sortBy:'-issueDate'});

  }
);


GoodIssueSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('bin').exec(cb);
};

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
  console.log('recordActualCost:', actualWeight);
  var deferred = Q.defer();
  if (this.status !== 'planning') {
    deferred.reject('only planning record can be update');
    return deferred.promise;
  };

  if (actualWeight < 0) {
    deferred.reject('invalid weight');
    return deferred.promise;
  };

  //Check whether actualWeight exceed actual inventory weight
  var self = this;
  var binCheckDtd = checkWeightEnoughInBin(this.bin, actualWeight);
  binCheckDtd.then(
    function() {
      self.actualWeight = actualWeight;
      self.status = 'checked';
      self.warnflag = (math.abs(actualWeight - self.planWeight) > goodIssueWarningThreshold);
      self.save(function(err, savedObj, numberAffected) {
        if (err) {
          deferred.reject(err);
          return;
        }
        deferred.resolve(savedObj);
      });
    }, 
    function(err) {
      deferred.reject(err);
    });
  
  return deferred.promise;
});

GoodIssueSchema.method('create', function(bin, cb) {
  console.log('GoodIssue create:');
  var self = this;
  var binCheckDtd = checkWeightEnoughInBin(bin, this.planWeight);
  binCheckDtd.then(
    function() {
      self.save(cb);
    },
    function(err) {
      cb(err);
    });
});

function checkWeightEnoughInBin(bin, weight) {
  // console.log('checkWeightEnoughInBin bin:', bin);
  var deferred = Q.defer();
  var binDtd = bin.getInventoryInfo();
  binDtd.then(
    function(retBin) {
      console.log(1);
      if (retBin.weight < weight) {
        console.log('retBin.weight < actualWeight!');
        deferred.reject('notEnoughWeight');
        return;
      } 
      deferred.resolve();
    }, 
    function(err) {
      console.log(2);
      deferred.reject(err);
    });

  return deferred.promise;
}
 

autoinc.plugin(GoodIssueSchema, {
  model: 'GoodIssue',
  field: 'sequence',
  start: 1
});
GoodIssueSchema.plugin(mongoosePaginate);
mongoose.model('GoodIssue', GoodIssueSchema);