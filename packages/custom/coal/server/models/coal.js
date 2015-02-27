'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  // crypto = require('crypto'),
  // _ = require('lodash'),
  Q = require('q'),
  _ = require('lodash'),
  math = require('mathjs'),
  commonUtil = require('./commonUtil');

var BaseSchema = commonUtil.BaseSchema;
var ChemicalAttrSchemaDef = commonUtil.ChemicalAttrSchemaDef;


var QualitySchema = BaseSchema.extend({
  name: String,
  comment: String,
});

QualitySchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('Quality', QualitySchema);

var MineralSchema = BaseSchema.extend({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  qualityName: {
    type: String,
    required: true,
    trim: true,
    //validate: [Quality.validate, 'invalid quality value'],
  },
  quality: {
    type: Schema.ObjectId,
    ref: 'Quality'
  },
  comment: String,
});

MineralSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('Mineral', MineralSchema);



var WarehouseSchema = BaseSchema.extend({
  name: String,
  comment: String,
});

WarehouseSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('Warehouse', WarehouseSchema);

var BinlocationSchema = BaseSchema.extend({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  weight: {
    type: Number,
    required: true
  },

  chemicalAttrs: ChemicalAttrSchemaDef,
  warehouseName: String,
  warehouse: {
    type: Schema.ObjectId,
    ref: 'Warehouse'
  },

  prevBin: {
    type: Schema.ObjectId,
    ref: 'Binlocation'
  },

  status: {
    type: String,
    required: true,
    default: 'new',
    enum: ['new', 'historyPre', 'historyPost'],
  },

});

BinlocationSchema.static('updateBinManually',
  function(oldBin, newVal) {
    console.log('oldbin, newVal');
    var Binlocation = mongoose.model('Binlocation', BinlocationSchema);

    //Create a new record to mark as current binlocation inventory
    _.extend(newVal, {
      'name': oldBin.name,
      'warehouseName': oldBin.warehouseName,
      'warehouse': oldBin.warehouse,
    });
    delete newVal['_id'];
    console.log('newVal:', newVal);
    var newBin = new Binlocation(newVal);

    //Change oldBin to be history record
    oldBin.status = 'historyPre';

    //Create a new record, and make this ref the old record
    var historyPostBin = new Binlocation(newVal);
    historyPostBin.prevBin = oldBin;
    historyPostBin.status = 'historyPost';

    var deferred = Q.defer();


    Q.all([Q.ninvoke(newBin, 'save'), Q.ninvoke(oldBin, 'save'), Q.ninvoke(historyPostBin, 'save')])
      .then(function(results) {
        // console.log('results:', results);
        deferred.resolve(newBin);

      }, function(err) {
        console.log('err:', err);
        deferred.reject('failed to updateBinManually');
      });
    return deferred.promise;
  }
);

BinlocationSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }, function(err, bin) {
    console.log('err:',err, bin);
    if (err) {
      cb(err);
      return;
    }
    var deferred = bin.getInventoryInfo();
    deferred.then(
      function(retBin) {
        console.log(16);
        cb(0, retBin);
      }, 
      function(err) {
        cb(err);
      });
  });
};

BinlocationSchema.static('getAllBinList',
  function() {
    // console.log('getBinList');
    var deferred = Q.defer();

    var Binlocation = mongoose.model('Binlocation', BinlocationSchema);
    var p = Binlocation.find({
      status: 'new'
    }).exec();
    p.addCallback(function(binList) {
      //getInventoryInfo 
      var deferArr = [];
      for (var i = binList.length - 1; i >= 0; --i) {
        deferArr.push(binList[i].getInventoryInfo());
      }
      Q.all(deferArr).then(function(binArr) {
        // console.log('getAllBinList binArr:', binArr);
        deferred.resolve(binArr);
      }, function(err) {
        deferred.reject(err);
      });
    });

    p.addErrback(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }
);

BinlocationSchema.method('getInventoryInfo',
  function() {
    console.log(11);
    var deferred = Q.defer();

    var now = new Date();

    var that = this;


    var GoodReceipt = mongoose.model('GoodReceipt');
    var GoodIssue = mongoose.model('GoodIssue');

    //try to update snapshot
    GoodReceipt.find({
        deleteFlag: false,
        bin: that,
      }).where('receiveDate').gt(this.modified).sort('receiveDate')
      .exec(function(err, goodReceipts) {
        console.log(12);

        if (err) {
          deferred.reject(err);
          return;
        }

        //check all GoodIssue during this period
        GoodIssue.find({
            deleteFlag: false,
            bin: that,
            status: 'checked',
          }).where('issueDate').gt(that.modified).sort('issueDate')
          .exec(function(err, goodIssues) {
            console.log(13);
            if (err) {
              deferred.reject(err);
              return;
            }

            console.log(14);

            var updateObj = that._caculate(goodReceipts, goodIssues);

            console.log(15);
            deferred.resolve(updateObj);
            return;
          });
      });

    return deferred.promise;

  });

BinlocationSchema.method('_caculate',
  function(goodReceipts, goodIssues) {
    _(goodIssues).forEach(function(goodIssue) {
      goodReceipts.push(goodIssue);
    });
    
    var GoodReceipt = mongoose.model('GoodReceipt');
    var sortedArray = _.sortBy(goodReceipts, function(obj) {
      // console.log('obj instanceof GoodReceipt:', obj instanceof GoodReceipt);
      return (obj instanceof GoodReceipt) ? obj.receiveDate: obj.issueDate; 
    });

    // handling
    for (var i = 0; i < sortedArray.length; ++i) {

      var obj = sortedArray[i];
      if (obj instanceof GoodReceipt) {
        // console.log('GoodReceipt receiveDate:', obj.receiveDate);
        var oldWeight = this.weight;
        this.weight += obj.weight;
        for (var key in ChemicalAttrSchemaDef) {
          if (obj.status === 'checked') {
            this.chemicalAttrs[key] = (this.chemicalAttrs[key] * oldWeight + obj.weight * obj.actualChemicalAttrs[key]) / this.weight;
          } else {
            this.chemicalAttrs[key] = (this.chemicalAttrs[key] * oldWeight + obj.weight * obj.inputChemicalAttrs[key]) / this.weight;
          }
        }
      } else {
        console.log('goodIssue issueDate:', obj.issueDate);
        this.weight -= obj.actualWeight;
      }
    }

    // console.log('=3dfe== this is:', this)
    return this;
  });

BinlocationSchema.method('updateSnapshot',
  function(snapshotTm) {
    var dtd = Q.defer();
    var GoodReceipt = mongoose.model('GoodReceipt');
    var GoodIssue = mongoose.model('GoodIssue');
    if (!snapshotTm) {
      snapshotTm = new Date();
    }

    var that = this;
    //try to update outdated GoodReceipt and GoodIssue before doing any check
    var dtd1 = GoodReceipt.updateOutdatedRecord();
    var dtd2 = GoodIssue.updateOutdatedRecord();
    Q.all([dtd1, dtd2])
      .then(function(results) {
        //check whether update snapshot condiction have been satisfied
        var conddtd1 = Q.defer();
        GoodReceipt.count({
            deleteFlag: false,
            bin: this,
            status: 'new'
          }).where('receiveDate').gt(this.modified).lte(snapshotTm).sort('receiveDate')
        .exec(function(err, count) {
          if (err) {
            console.error('failed to find goodReceipt count:',err);
            conddtd1.reject(err);
            return;
          }
          conddtd1.resolve(count);
        });

        var conddtd2 = Q.defer();
        GoodIssue.count({
            deleteFlag: false,
            bin: this,
            status: 'planning'
          }).where('issueDate').gt(this.modified).lte(snapshotTm).sort('issueDate')
        .exec(function(err, count) {
          if (err) {
            console.error('failed to find goodIssue count:',err);
            conddtd2.reject(err);
            return;
          }
          conddtd2.resolve(count);
        });

        Q.all([conddtd1, conddtd2]).spread(function (cnt1, cnt2) {
          if (cnt1 > 0 || cnt2 > 0) {
            dtd.resolve();
            return;
          }
          //satisfy update condition
          console.log('going to update binlocation snapshot');
          that.getInventoryInfo()
          .then(function(updatedObj) {
            updatedObj.save(function(err, savedObj) {
              if (err) {
                console.error('failed to updata snapshot due to save error:',err);
                dtd.reject(err);
                return;
              }
              dtd.resolve(savedObj);
            });
          }, function(err) {
            console.error('failed to updata snapshot due to getInventoryInfo error:',err);
            dtd.reject(err);
            return;
          });
        });

      }, function(err) {
        console.log('err:', err);
        dtd.reject(err);
      });

    return dtd.promise;
  }
);

mongoose.model('Binlocation', BinlocationSchema);