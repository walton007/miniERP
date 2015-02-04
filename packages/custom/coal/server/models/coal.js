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

BinlocationSchema.static('updateBinFromGoodIssue', 
  function(goodIssue) {
    var deferred = Q.defer();
     
    var Binlocation = mongoose.model('Binlocation', BinlocationSchema); 
    var p = Binlocation.findOne({status:'new', name: goodIssue.binName}).exec(); 
    p.addCallback(function(bin) {
      console.log('before update bin:', bin.weight);
      if (bin.weight < goodIssue.weight) {
        

      };
      bin.weight -= goodIssue.weight;
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
  // console.log('============1');
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

  oldWeight: {
    type: Number,
    required: true,
    default: 0,
  },

  status: {
    type: String,
    required: true,
    default: 'new',
    enum: ['new', 'revised', 'reviseback', 'checked'],
  },
   
});

GoodIssueSchema.method('modifyWeight', function(newWeight) {
  if (this.status !== 'new' && this.status !== 'reviseback') {
    return this;
  };

  this.oldWeight = this.weight;
  this.weight = newWeight;
  this.status = 'revised';

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

GoodIssueSchema.method('revertWeight', function() {
  if (this.status !== 'revised') {
    return this;
  };

  this.status = 'reviseback';
  this.weight = this.oldWeight;

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

GoodIssueSchema.method('checkPass', function() {
  if (this.status === 'checked') {
    return this;
  };

  var that = this;
  this.status = 'checked';

  var deferred = Q.defer();
  this.save(function(err, savedObj, numberAffected) {
    if (err) {
      deferred.reject(err);
      return;
    } 
    var Binlocation = mongoose.model('Binlocation', BinlocationSchema);
    // console.log('============3');
    Binlocation.updateBinFromGoodIssue(that)
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
 
autoinc.plugin(GoodReceiptSchema, {model: 'GoodIssue', field: 'sequence', start: 1});
mongoose.model('GoodIssue', GoodIssueSchema);
 