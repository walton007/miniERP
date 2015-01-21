'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
 // crypto = require('crypto'),
 // _ = require('lodash'),
  Q = require('q'),
  extend = require('mongoose-schema-extend');

 
// var db = mongoose.connect('mongodb://localhost/erptest2');
console.log('hello');

// var autoinc = require('mongoose-id-autoinc');
// autoinc.init(db);

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
});

var ChemicalAttrSchemaDef = { //new Schema({
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
}; //);



var QualitySchema = BaseSchema.extend({
  name: String,
  comment: String,
});

var Quality = mongoose.model('Quality', QualitySchema);
console.log('In model define Quality:', Quality);

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
 
  chemicalAttrs: ChemicalAttrSchemaDef,
  warehouseName: String,
  warehouse: {
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

  origchemicalAttrs: ChemicalAttrSchemaDef,

  chemicalAttrs: ChemicalAttrSchemaDef,
  chemicalChecked: {
    type: Boolean,
    required: true
  },
  
}, {
  _id: false
});

// autoinc.plugin(GoodReceiptSchema, {model: 'GoodReceipt', field: '_id'});
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

  bin: {
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
 