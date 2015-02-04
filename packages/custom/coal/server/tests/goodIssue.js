/* jshint -W079 */ 
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	mongoose = require('mongoose'),
  User = mongoose.model('User'),

  GoodIssue = mongoose.model('GoodIssue'),
  Binlocation= mongoose.model('Binlocation'),
  Counter = mongoose.model('Counter');
var Q = require('q');
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

var goodIssueDict = {
  issueDate: new Date(),
  mineral: null,
 
  mineralName: 'able2',
 
  weight: 10,
  oldWeight: 0,

  receiptChecked: true,
};

/**
 * Test Suites
 */
 
  describe.only('Model GoodIssue:', function() {
    before(function(done) {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      user.save(function() {
        goodIssueDict.creator = user;
        goodIssueDict.creatorName = user.name;

        var bin = new Binlocation({
            creator: user,
            creatorName: user.name,
            name: '一期东陕煤',
            weight: 100,
            chemicalAttrs: chemicalAttrDict,
            warehouse: null,
            warehouseName: '一期',
            parentBin: null
          });

        bin.save(function(err, binObj) {
          goodIssueDict.bin = binObj;
          goodIssueDict.binName = binObj.name;
          done();
        });
        
      });

    });

    describe('Check Save GoodIssue', function() {
      it('should be able to save without problems', function(done) {
        var goodIssue = new GoodIssue(goodIssueDict);
        goodIssue.save(function(err, savedObj, numberAffected) {
          // console.log('savedQuality:',savedQuality);
          // console.log('numberAffected:',numberAffected);
          expect(err).to.be(null);
          expect(savedObj.status).to.be('new');
          
          done();
        });
        return;
      });

      it('check modifyWeight', function(done) {
        GoodIssue.findOne({status: 'new'}).exec(function(err, obj){
          // console.log('[[[]]]] err:', err, ' obj:' , obj);
          expect(err).to.be(null);

          obj.modifyWeight(15).then(function(updateObj) {
            // console.log('updateObj:', updateObj);
            expect(updateObj.status).to.be('revised');
            done();
          });
        });
        return ;
      });

      it('check cant modify again', function(done) {
        GoodIssue.findOne({status: 'revised'}).exec(function(err, obj){
          // console.log('[[[]]]]obj:', obj);
          expect(err).to.be(null);

          Q(obj.modifyWeight(25)).then(function(updateObj) {
            expect(updateObj.status).to.be('revised');
            expect(updateObj.weight).to.be(15);
            expect(updateObj.oldWeight).to.be(10);
            done();
          });
        });
      });

      it('check can revertWeight', function(done) {
        GoodIssue.findOne({status: 'revised'}).exec(function(err, obj){
          // console.log('[[[]]]]obj:', obj);
          expect(err).to.be(null);

          Q(obj.revertWeight()).then(function(updateObj) {
            // console.log('[[[ revertWeight ]]]]obj:', updateObj);
            expect(updateObj.status).to.be('reviseback');
            expect(updateObj.weight).to.be(10);
            // expect(updateObj.oldWeight).to.be(10);
            done();
          });
        });
      });

      it('check can checkPass', function(done) {
        GoodIssue.findOne({status: 'reviseback'}).exec(function(err, obj){
          // console.log('[[[]]]]obj:', obj);
          expect(err).to.be(null);

          Q(obj.checkPass()).then(function(updateObj) {
            expect(updateObj.status).to.be('checked');
            done();
          });
        });
      });

      it('check bin again', function(done) {
        Binlocation.findOne({status: 'new'}).exec(function(err, obj){
          // console.log('[[[]]]]obj:', obj);
          expect(err).to.be(null);

          expect(obj.weight).to.be(90);

          done();
        });
      });

      

    });



    after(function(done) {
      console.log('after goodissue');
      GoodIssue.remove(function(){
          Binlocation.remove(function () {
            user.remove(done);
          });
        });
    });
  });
 
