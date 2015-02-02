'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
 // crypto = require('crypto'),
 // _ = require('lodash'),
  Q = require('q'),
  _ = require('lodash');

require('mongoose-schema-extend');

var autoinc = require('./autoinc');

//Need administrator to config these information: InventoryUnit, InventorySchema, QualitySchema, CoalMine
var BaseSchema = new Schema({
  creatorName: String,
  creator: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  modified: {
    type: Date,
    default: Date.now
  },
  
  deleteFlag: {
    type: Boolean,
    default: false
  },
});

 
BaseSchema.pre('save', function(next) {
  if (!this.isNew) {
    // console.log('update modified date');
    this.modified = Date.now();
  } else {
    // console.log('add new object');
    this.created = Date.now();
  }

  next();
});

BaseSchema.method('markDelete', function() {
  var deferred = Q.defer();
  console.log('markDelete');
  this.deleteFlag = true;
  this.save(function(err, savedObj, numberAffected) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(savedObj);
    }
  });
  return deferred.promise;
});

var ChemicalAttrSchemaDef = {  
  Mar: Number,
  Mad: Number,
  Aad: Number,
  Ad: Number,
  Vad: Number,
  Vdaf: Number,
  FCad: Number,
  St_ad: Number,
  Qb_ad: Number,
  Qgr_d: Number,
  Qnet_v_ar: Number,
  Qnet_v_ar_cal: Number,

  power: {
    type: Number,
    required: true
  },
  nitrogen: {
    type: Number,
    required: true
  },
}; 

var QualitySchema = BaseSchema.extend({
  name: String,
  comment: String,
});

mongoose.model('Quality', QualitySchema);

/**
 * QualitySchema Statics
 */
// QualitySchema.statics = {
//   addQuality: function(newQuality, cb) {
//     var deferred = Q.defer();

//     console.log('typeof this:', (typeof this));
//     var p = this.findOne({}).exec();
//     p.addCallback(function(quality) {
//       quality = quality ? quality : new Quality({
//         contents: []
//       });

//       if (quality.contents.indexOf(newQuality) < 0) {
//         quality.contents.push(newQuality);
//       }

//       quality.save(function(err, savedQuality, numberAffected) {
//         console.log(err, savedQuality, numberAffected);
//         if (err) {
//           deferred.reject(err);
//         } else {
//           deferred.resolve(savedQuality.contents);
//         }
//       });
//     });

//     p.addErrback(function(err) {
//       deferred.reject(err);
//     });

//     return deferred.promise.nodeify(cb);
//   },

//   getQuality: function(cb) {
//     var deferred = Q.defer();

//     var p = this.findOne({}).exec();
//     p.addCallback(function(quality) {
//       var contents = quality ? quality.contents : [];
//       deferred.resolve(contents); 
//     });

//     p.addErrback(function(err) {
//       deferred.reject(err);
//     });

//     return deferred.promise.nodeify(cb);
//   },

//   validate: function(quality, cb) {
//     Quality.getQuality(function(err, contents) {
//       //console.log('QualitySchema.validate:', err, contents);
//       if (err) {
//         cb(false);
//         return; 
//       }
//       if (contents.indexOf(quality) < 0) {
//         cb(false);
//         return;
//       }

//       cb(true);
//     });
//   }
// };


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

mongoose.model('Mineral', MineralSchema);



var WarehouseSchema = BaseSchema.extend({
  name: String,
  comment: String,
});

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
    var newBin = new Binlocation(newVal);

    //Change oldBin to be history record
    oldBin.status = 'historyPre';

    //Create a new record, and make this ref the old record
    var historyPostBin = new Binlocation(newVal);
    historyPostBin.prevBin = oldBin;
    historyPostBin.status = 'historyPost';

    var deferred = Q.defer();


    Q.all([Q.ninvoke(newBin, 'save'), Q.ninvoke(oldBin, 'save'), Q.ninvoke(historyPostBin, 'save')])
      .then(function (results) {
        // console.log('results:', results);
        deferred.resolve(newBin);
       
      }, function(err) {
        console.log('err:',err);
        deferred.reject('failed to updateBinManually');
      });
    return deferred.promise;
  }
);

BinlocationSchema.static('getAllBinList', 
  function() {
    console.log('getBinList');
    var deferred = Q.defer();

    var Binlocation = mongoose.model('Binlocation', BinlocationSchema); 
    var p = Binlocation.find({status:'new'}).exec(); 
    p.addCallback(function(binList) {
      deferred.resolve(binList);
    });

    p.addErrback(function(err) {
      deferred.reject(err);
    });
   
    return deferred.promise;
  }
);

 BinlocationSchema.static('updateBinFromGoodReceipt', 
  function(goodReceipt, fromChemicalChecker) {
    // console.log('===updateBinFromGoodReceipt 6');
    var deferred = Q.defer();
     
    var Binlocation = mongoose.model('Binlocation', BinlocationSchema); 
    var p = Binlocation.findOne({status:'new', name: goodReceipt.binName}).exec(); 
    p.addCallback(function(bin) {
      console.log('before update bin:', bin.weight);
      if (fromChemicalChecker) {
        //no need update weight, update chemical attrs only
        for (var key in ChemicalAttrSchemaDef) {
          bin.chemicalAttrs[key] = bin.chemicalAttrs[key] + goodReceipt.weight * (goodReceipt.actualChemicalAttrs[key] - goodReceipt.inputChemicalAttrs[key]) /bin.weight; 
          
        }
      } else {
        var oldWeight = bin.weight; 
        bin.weight += goodReceipt.weight;
        //update chemical data
        for (var key in ChemicalAttrSchemaDef) {
          bin.chemicalAttrs[key] = (bin.chemicalAttrs[key] * oldWeight + goodReceipt.weight * goodReceipt.inputChemicalAttrs[key]) / bin.weight;
        }
      }
      
      bin.save(function(err, savedObj, numberAffected) {
        // console.log('after update bin:', savedObj.weight);
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(savedObj);
        }
      });
    });

    p.addErrback(function(err) {
      deferred.reject(err);
    });
   
    return deferred.promise;
  }
);

mongoose.model('Binlocation', BinlocationSchema); 
 
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

  receiptChecked: {
    type: Boolean,
    required: true
  },

  inputChemicalAttrs: ChemicalAttrSchemaDef,

  actualChemicalAttrs: ChemicalAttrSchemaDef,
  chemicalChecked: {
    type: Boolean,
    required: true
  },
  
});

GoodReceiptSchema.method('receiptCheckPass', function() {
  // console.log('============1');
  if (this.receiptChecked) {
    return this;
  };

  var that = this;

  this.receiptChecked = true;
  //trigger caculation for Binlocation
  var deferred = Q.defer();
  this.save(function(err, savedObj, numberAffected) {
    // console.log('============2 err:', err, savedObj);
    if (err) {
      deferred.reject(err);
      return;
    } 
    var Binlocation = mongoose.model('Binlocation', BinlocationSchema);
    // console.log('============3');
    Binlocation.updateBinFromGoodReceipt(that, false)
    .then(function(savedObj) { 
      // console.log('============4');
      deferred.resolve(that);
    }, function(err) {
      // console.log('============5');
      deferred.reject(err);
    });
 
  });
  return deferred.promise;
});

GoodReceiptSchema.method('chemicalCheckPass', function() {
  console.log('============1');
  if (!this.receiptChecked || this.chemicalChecked) {
    return this;
  };

  var that = this;

  this.chemicalChecked = true;
  //trigger caculation for Binlocation
  var deferred = Q.defer();
  this.save(function(err, savedObj, numberAffected) {
    console.log('============2 err:', err, savedObj);
    if (err) {
      deferred.reject(err);
      return;
    } 
    var Binlocation = mongoose.model('Binlocation', BinlocationSchema);
    // console.log('============3');
    Binlocation.updateBinFromGoodReceipt(that, true)
    .then(function(savedObj) { 
      // console.log('============4');
      deferred.resolve(that);
    }, function(err) {
      // console.log('============5');
      deferred.reject(err);
    });
 
  });
  return deferred.promise;
});

autoinc.plugin(GoodReceiptSchema, {model: 'GoodReceipt', field: 'sequence', start: 1});
mongoose.model('GoodReceipt', GoodReceiptSchema);
 

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

  weight: {
    type: Number,
    required: true
  },

  oldWeight: Number,

  status: {
    type: String,
    required: true,
    default: 'new',
    enum: ['new', 'revised', 'trash','checked'],
  },
   
});
 

mongoose.model('GoodIssue', GoodIssueSchema);
 