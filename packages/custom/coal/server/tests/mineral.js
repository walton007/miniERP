/* jshint -W079 */ 
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	mongoose = require('mongoose'),
  User = mongoose.model('User'),

  Quality = mongoose.model('Quality'),
  Mineral = mongoose.model('Mineral');
 
/**
 * Globals
 */
var user;
var quality;
var mineral;

/**
 * Test Suites
 */
describe('<Mineral Test>', function() {
   
  before(function(done) {
    user = new User({
      name: 'Full name',
      email: 'test@test.com',
      username: 'user',
      password: 'password'
    });

    user.save(function() {
      quality = new Quality({
        creator: user,
        creatorName: user.name,
        name: '陕煤',
        comment: '品质好'
      });

      quality.save(function() {
        mineral = new Mineral({
          creator: user,
          creatorName: user.name,
          name: '张家煤矿',
          comment: '品质好',
          quality: quality,
          qualityName: quality.name,
        });
        done();
      });

      
    });
 

    describe('Save Actions', function() {
      it('should be able to create without problems', function(done) {
        return mineral.save(function(err) {
           // console.log('it1:', err);
          expect(err).to.be(null);
          expect(mineral.name).to.equal('张家煤矿');
          expect(mineral.creator.length).to.not.equal(0);
          expect(mineral.creatorName).to.equal(user.name);
          expect(mineral.created.length).to.not.equal(0);
          expect(mineral.modified.length).to.not.equal(0);
          expect(mineral.quality.length).to.not.equal(0);
          done();
        });
      });

    });

    after(function(done) {
      Mineral.remove({}, function(){
          quality.remove(function () {
          user.remove(done);
        });
      });
    });
  });
});
