'use strict';



/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
 // crypto = require('crypto'),
 // _ = require('lodash'),
  Q = require('q');

 
mongoose.connect('mongodb://localhost/erptest');
console.log('hello');


//Need administrator to config these information: InventoryUnit, InventorySchema, QualitySchema, CoalMine

var QualitySchema = new Schema({
  contents: [String],
});
var Quality = mongoose.model('Quality', QualitySchema);

/**
 * QualitySchema Statics
 */
QualitySchema.statics = {
  addQuality: function(newQuality, cb) {
    var deferred = Q.defer();

    console.log('typeof this:', (typeof this));
    var p = this.findOne({}).exec();
    p.addCallback(function(quality) {
      quality = quality ? quality : new Quality({
        contents: []
      });

      if (quality.contents.indexOf(newQuality) < 0) {
        quality.contents.push(newQuality);
      }

      quality.save(function(err, savedQuality, numberAffected) {
        console.log(err, savedQuality, numberAffected);
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(savedQuality.contents);
        }
      });
    });

    p.addErrback(function(err) {
      deferred.reject(err);
    });

    return deferred.promise.nodeify(cb);
  },

  getQuality: function(cb) {
    var deferred = Q.defer();

    var p = this.findOne({}).exec();
    p.addCallback(function(quality) {
      var contents = quality ? quality.contents : [];
      deferred.resolve(contents); 
    });

    p.addErrback(function(err) {
      deferred.reject(err);
    });

    return deferred.promise.nodeify(cb);
  },

  validate: function(quality, cb) {
    Quality.getQuality(function(err, contents) {
      //console.log('QualitySchema.validate:', err, contents);
      if (err) {
        cb(false);
        return; 
      }
      if (contents.indexOf(quality) < 0) {
        cb(false);
        return;
      }

      cb(true);
    });
  }
};


var InventoryUnitSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  quality: {
    type: String,
    required: true,
    trim: true
  },
  weight: {
    type: Number,
    required: true
  },

  power: {
    type: Number,
    required: true
  },
  nitrogen: {
    type: Number,
    required: true
  },

});

var ManualMofifyRecordSchema = new Schema({
  reason: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true,
    trim: true
  },
  lastsnapshot: {
    
  }
});

var InventorySchema = new Schema({

  inventory: [InventoryUnitSchema],

  created: {
    type: Date,
    default: Date.now
  },

  datasource: {
    type: String,
    required: true,
    default: 'manual',
    enum: ['manual', 'system'],
  },
   
});

var CoalMineSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  quality: {
    type: String,
    required: true,
    trim: true,
    validate: [Quality.validate, 'invalid quality value'],
  },

  created: {
    type: Date,
    default: Date.now
  },

  modified: {
    type: Date,
    default: Date.now
  },
});

CoalMineSchema.pre('save', function(next) {
  if (!this.isNew) {
    console.log('update modified date');
    this.modified = Date.now;
  }

  next();
});


//Got from SystemA
var CoalBuyTransactionSchema = new Schema({
  //Following data is got from SystemA
  date: {
    type: Date,
    default: Date.now
  },
  coalminename: {
    type: String,
    required: true,
    trim: true
  },

  weight: {
    type: Number,
    required: true
  },

  //Mar Mad Aad Ad  Vad Vdaf  FCad  St,ad Qb,ad Qgr,d Qnet,v,ar Qnet,v,ar
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

  //From now on, following data is caculated by server
  created: {
    type: Date,
    default: Date.now
  },
  coalmine: {
    type: Schema.ObjectId,
    ref: 'CoalMine'
  },
});

// CoalBuyTransactionSchema.pre('save', function(next) {
//   if (!this.isNew) {
//     console.log('update modified date');
//     this.modified = Date.now;
//   };

//   next();
// });

var CoalProductionPlanSchema = new Schema({

  useplan: [InventoryUnitSchema],
  date: {
    type: Date,
    default: Date.now
  },

  created: {
    type: Date,
    default: Date.now
  },

  modified: {
    type: Date,
    default: Date.now
  },

  manualhistory: [ManualMofifyRecordSchema],
});

// var CoalConsuptionDataSISSchema = new Schema({
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   accuweight: {
//     type: Number,
//     required: true
//   },
// });

var MineCostSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  quality: {
    type: String,
    required: true,
    trim: true
  },
  weight: {
    type: Number,
    required: true
  },

  workschedule: {
    type: String,
    required: true,
    trim: true,
    enum: ['morning', 'noon', 'earlynight', 'latenight'],
  },

});

var CoalDailyConsumptionSchema = new Schema({
  //Following data is got from SystemB
  date: {
    type: Date,
    default: Date.now
  },
  
  //sisdata: [CoalConsuptionDataSISSchema],

  cost: [MineCostSchema],
  manualhistory: [ManualMofifyRecordSchema],

  created: {
    type: Date,
    default: Date.now
  },

  modified: {
    type: Date,
    default: Date.now
  },
});


//var CoalMine = mongoose.model('CoalMine', CoalMineSchema);
mongoose.model('Inventory', InventorySchema);
var CoalBuyTransaction = mongoose.model('CoalBuyTransaction', CoalBuyTransactionSchema);
mongoose.model('CoalProductionPlan', CoalProductionPlanSchema);
mongoose.model('CoalDailyConsumption', CoalDailyConsumptionSchema);
 
// Quality.addQuality('优秀3').then(function(contents) {
//   console.log('contents: ', contents);
// }, function(err) {
//   console.error('addQuality error', err);
// });

// Quality.getQuality(function(err, data) {
//   console.log(err, data);
// });

// var coalmine = new CoalMine({name: 'aa', quality: '优秀'});
// coalmine.save(function(err, value) {
//   console.log('coalmine save result:', err, value);

// });

var tran = new CoalBuyTransaction({
  coalminename: '晓兵',
  weight: 34.4
});
tran.save();




//mongoose.disconnect();

// InventoryUnit, InventorySchema, QualitySchema, CoalMine //Initial configuration

// CoalDailyConsumptionSchema  //Got from sis 
// CoalProductionPlanSchema    //Got from operator
// CoalBuyTransactionSchema    //Got from SystemA

// Question:
// 1. how to calculate coal consumpltion
// 2. which table can be modified


// 1. 入煤数据修改要记录修改历史和原因  生产计划现在只记录修改历史
// 2. 煤耗记录修改历史和原因，工人只能输入一次，jt可以修改多次
// 3. 库存信息只允许初始化和重置，从重置之日起，其后每天的库存都是根据来煤和煤耗实时计算得出。
// 4. 关于煤管班，应该是有个类似【审核】的功能流程
//     煤管班可以输入，景涛再确认
//     确认前的数据只记录，不计算
//     另外就是，在景涛确认数据时，有个时间先后顺序，如果有多个记录等待确认，比如昨天来了一批煤，今天来了一批煤，只确认今天的来煤的话，给出提示应先确认昨天的来煤      