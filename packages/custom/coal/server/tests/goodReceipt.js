/* jshint -W079 */ 
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	mongoose = require('mongoose'),
  User = mongoose.model('User'),

  GoodReceipt = mongoose.model('GoodReceipt'),
  Counter = mongoose.model('Counter');

/**
 * Globals
 */
var user;

var chemicalAttrDict = {  
  Mar: 11,
  Mad: 12,
  Aad: 3,
  Ad: 2,
  Vad: 3,
  Vdaf: 4,
  FCad: 5,
  St_ad: 5,
  Qb_ad: 3,
  Qgr_d: 4,
  Qnet_v_ar: 3,
  Qnet_v_ar_cal: 1,

  power: 12,
  nitrogen: 13
}; 

var goodReceiptDict = {
  receiveDate: new Date(),
  mineral: null,

  binName:'一期东优质煤',
  mineralName: 'able2',

  bin: null,

  weight: 12.3,

  receiptChecked: true,

  inputChemicalAttrs: chemicalAttrDict,

  actualChemicalAttrs: chemicalAttrDict,
  chemicalChecked: false,
  
};

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model GoodReceipt:', function() {
    before(function(done) {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      user.save(function() {
        goodReceiptDict.creator = user;
        goodReceiptDict.creatorName = user.name;

        done();
      });

    })

    describe('Check Sequence', function() {
      it('should be able to save without problems', function(done) {
        var goodReceipt = new GoodReceipt(goodReceiptDict);
        goodReceipt.save(function(err, savedQuality, numberAffected) {
          // console.log('err:',err);
          // console.log('savedQuality:',savedQuality);
          // console.log('numberAffected:',numberAffected);
          expect(err).to.be(null);
          done();
        });
        return;
      });

      it('check last saved Sequence', function(done) {
        GoodReceipt.findOne({}).exec(function(err, obj){
          // console.log('[[[]]]]obj:', obj);
          expect(err).to.be(null);
          // expect(obj.weight).to.equal(goodReceiptDict.seq);
          expect(obj.sequence).to.below(5000);
          done();
        });
        return ;
      });

      it('check save another Sequence', function(done) {
        var goodReceipt = new GoodReceipt(goodReceiptDict);
        goodReceipt.save(function(err, savedQuality, numberAffected) {
          expect(err).to.be(null);
          expect(savedQuality.sequence).to.below(5000);
          done();
        });
        return ;
      });

    });



    after(function(done) {
      GoodReceipt.remove(function(){
          Counter.remove(function () {
            user.remove(done);
          });
        });
    });
  });
});
