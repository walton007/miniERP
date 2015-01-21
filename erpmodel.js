'use strict';



/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
 // crypto = require('crypto'),
 // _ = require('lodash'),
  Q = require('q');
  extend = require('mongoose-schema-extend');

 
var db = mongoose.connect('mongodb://localhost/erptest2');
console.log('hello');

var autoinc = require('mongoose-id-autoinc2');
autoinc.init(db);

//Need administrator to config these information: InventoryUnit, InventorySchema, QualitySchema, CoalMine
var BaseSchema = new Schema({
  creator: String,
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  },
});

var ChemicalAttrSchema = new Schema({
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
});



var QualitySchema = BaseSchema.extend({
  name: String,
  comment: String,
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
  qualityId: {
    type: Schema.ObjectId,
    ref: 'Quality'
  },
  comment: String,
});

mongoose.model('Mineral', MineralSchema);

// MineralSchema.pre('save', function(next) {
//   if (!this.isNew) {
//     console.log('update modified date');
//     this.modified = Date.now;
//   }

//   next();
// });

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
    unique: true,
  },
  
  weight: {
    type: Number,
    required: true
  },
 
  chemicalAttrs: ChemicalAttrSchema,
  warehouseName: String,
  warehouseId: {
    type: Schema.ObjectId,
    ref: 'Warehouse'
  },

  parentBin: {
    type: Schema.ObjectId,
    ref: 'Binlocation'
  },

  active: {
    type: Boolean,
    default: true
  },

});
mongoose.model('Binlocation', BinlocationSchema);
 
var GoodReceiptSchema = BaseSchema.extend({
  receiveDate: {
    type: Date,
  },
  mineralName: {
    type: String,
    required: true,
    trim: true
  },

  mineralId: {
    type: Schema.ObjectId,
    ref: 'Mineral'
  },

  binName: {
    type: String,
    required: true,
    trim: true
  },

  binId: {
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

  origchemicalAttrs: ChemicalAttrSchema,

  chemicalAttrs: ChemicalAttrSchema,
  chemicalChecked: {
    type: Boolean,
    required: true
  },
  
}, {
  _id: false
});

autoinc.plugin(GoodReceiptSchema, {model: 'GoodReceipt', field: '_id'});
var GoodReceipt = mongoose.model('GoodReceipt', GoodReceiptSchema);
 

var GoodIssueSchema = BaseSchema.extend({
  issueDate: {
    type: Date,
  },

  binName: {
    type: String,
    required: true,
    trim: true
  },

  binId: {
    type: Schema.ObjectId,
    ref: 'Binlocation'
  },

  weight: {
    type: Number,
    required: true
  },

  issueChecked: {
    type: Boolean,
    required: true
  },
  
});
 

mongoose.model('GoodIssue', GoodIssueSchema);
 
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

// var tran = new CoalBuyTransaction({
//   coalminename: '晓兵',
//   weight: 34.4
// });
// tran.save();




//mongoose.disconnect();

// var Quality = mongoose.model('Quality', QualitySchema);
// mongoose.model('Mineral', MineralSchema);
// mongoose.model('Warehouse', WarehouseSchema);
// mongoose.model('Binlocation', BinlocationSchema);
// var GoodReceipt = mongoose.model('GoodReceipt', GoodReceiptSchema);
// mongoose.model('GoodIssue', GoodIssueSchema);

// 1. 入煤数据修改要记录修改历史和原因  生产计划现在只记录修改历史
// 2. 煤耗记录修改历史和原因，工人只能输入一次，jt可以修改多次
// 3. 库存信息只允许初始化和重置，从重置之日起，其后每天的库存都是根据来煤和煤耗实时计算得出。
// 4. 关于煤管班，应该是有个类似【审核】的功能流程
//     煤管班可以输入，景涛再确认
//     确认前的数据只记录，不计算
//     另外就是，在景涛确认数据时，有个时间先后顺序，如果有多个记录等待确认，比如昨天来了一批煤，今天来了一批煤，只确认今天的来煤的话，给出提示应先确认昨天的来煤   

//CoalBuyTransactionSchema: record modify    


//来煤选择流程
//1. 先输入来煤数量，化验员化验审核通过，jt才能能审核通过，才能参与库存计算
//2. 系统初始化矿源时候输入各个矿源的煤直信息，当煤管工输入来煤数量，即使化验员没有输入媒质信息， jt也能审核通过， 并且参与库存媒质计算。计算方法，利用
//   初始估算的煤直信息。化验结果审核通过后，再次修正计算

//库存表每次实时更新（来煤或者用煤审核通过），同时需要记录jt所有的修改
//查看日志: InventoryUnit修改的前后值

//所有的修改都需要记录操作员

//xulong更近报表统计