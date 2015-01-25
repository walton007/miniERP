/* jshint -W079 */ 
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	mongoose = require('mongoose'),
  User = mongoose.model('User'),

  Warehouse = mongoose.model('Warehouse'),
  Binlocation = mongoose.model('Binlocation');
 
 
/**
 * Globals
 */
var user;
var warehouse;
var bin;
var gChemicalAttrs =  { //new Schema({
  Mar: 11,
  Mad: 12,
  Aad: 2,
  Ad: 3,
  Vad: 4,
  Vdaf: 5.5,
  FCad: 6,
  St_ad: 7,
  Qb_ad: 8,
  Qgr_d: 1,
  Qnet_v_ar: 12,
  Qnet_v_ar_cal: 3,

  power: 23,
  nitrogen: 54
};
var newVal;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model Binlocation:', function() {
    before(function(done) {

      console.log('before;');
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      user.save(function() {
        warehouse = new Warehouse({
          creator: user,
          creatorName: user.name,
          name: '一期东',
          comment: '品质好'
        });

        warehouse.save(function() {
          bin = new Binlocation({
            creator: user,
            creatorName: user.name,
            name: '一期东陕煤',
            weight: 12.3,
            chemicalAttrs: gChemicalAttrs,
            warehouse : warehouse,
            warehouseName: warehouse.name,
            parentBin: null
          });
          done();
        });

        
      });

    });

    describe('Method Save', function() {
      it('should be able to create without problems', function(done) {
        return bin.save(function(err) {
           // console.log('it1:', err);
          expect(err).to.be(null);
          done();
        });
      });

      it('should be able to findOne without problems', function(done) {
        Binlocation.findOne({warehouse: warehouse}).populate('creator').populate('warehouse').exec(function(err, qbin){
          // console.log('qbin.warehouse:', qbin.warehouse, ' qbin:', qbin);
          expect(err).to.be(null);
          expect(qbin.weight).to.equal(bin.weight);
          expect(qbin.creator.name).to.equal(user.name);
          expect(qbin.warehouseName).to.equal(warehouse.name);
          expect(qbin.chemicalAttrs.Mad).to.equal(gChemicalAttrs.Mad);
          done();
        });
        return ;
      });

      it('should be able to findOne populate Warehouse', function(done) {
        Binlocation.findOne({}).populate('warehouse', 'name').exec(function(err, qbin){
          // console.log('=qbin:', qbin);
          // console.log('=qbin.warehouse:', qbin.warehouse)
          expect(err).to.be(null);
          expect(qbin.warehouse.name).to.equal(warehouse.name);
          // expect(qbin.creator).to.equal(warehouse.name);
          done();
        });
        return ;
      });

    });

    describe('Static Method', function() {
      it('should be able to updateBinManually', function(done) {
        Binlocation.findOne({status: 'new'}).exec(function(err, oldBin) {
          newVal = {
            creator: user,
            creatorName: user.name,
            weight: 15.3,
            chemicalAttrs: gChemicalAttrs,
          };

          var q = Binlocation.updateBinManually(oldBin, newVal);
          q.then(function(newBin) {
            console.log('finish updateBinManually');
            expect(newBin).property('weight', newVal.weight);
            expect(oldBin.status).to.equal('historyPre');
            done();

          }, function(err)  {
            console.log('3222');
            expect({}).fail(err);
            done();
          });

        });
        
      });

      it('check data generated by updateBinManually', function(done) {
        console.log('check data generated by updateBin');
        var query = Binlocation.find({}).or([{status:'historyPre'}, {status:'historyPost'}]).populate('prevBin').sort('status');
             
            query.exec(function(err, historyBins) {
              // console.log('err:', err);
              // console.log('historyBins:', historyBins);
              expect(err).to.be(null);
              expect(historyBins).length(2);
              var historyPostBin = historyBins[0];
              var historyPreBin = historyBins[1];
              expect(historyPostBin.prevBin._id).to.eql(historyPreBin._id);
              expect(historyPostBin.weight).to.equal(newVal.weight);
              expect(historyPreBin.weight).to.equal(bin.weight);
              done();
            });
      });
    });



    after(function(done) {
      console.log('after');
      Binlocation.remove({}, function(){
          warehouse.remove(function () {
            user.remove(done);
          });
        });
    });
  });
});
