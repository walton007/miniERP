'use strict';
console.log('compile BaseSchema');

require('mongoose-schema-extend');

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  User = mongoose.model('User'),
  Q = require('q');

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
  var self = this;
  if (!this.isNew) {
    // console.log('update modified date');
    this.modified = Date.now();
  } else {
    // console.log('add new object');
    this.created = Date.now();
  }

  // console.log('BaseSchema.pre save creator:', this.creator, ' this.creatorName:', this.creatorName);

  if (this.creator && !this.creatorName) {
    User.findOne({'_id': this.creator}).select('name')
    .exec(function(err, user) {
      // console.log('err: --- ', err, user);
      if (err) {
        next(err);
        return;
      }
      self.creatorName = user.name;
      next();
    });
    return;
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

module.exports = exports = {BaseSchema: BaseSchema,
     ChemicalAttrSchemaDef: ChemicalAttrSchemaDef,
    }; 
