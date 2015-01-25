/* jshint -W079 */ 
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Quality = mongoose.model('Quality');
 
/**
 * Globals
 */
var user;
var quality;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model Quality:', function() {
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

        done();
      });
    });

    describe('Method Save', function() {
      it('should be able to create without problems', function(done) {
        return quality.save(function(err) {
           // console.log('it1:', err);
          expect(err).to.be(null);
          expect(quality.name).to.equal('陕煤');
          expect(quality.comment).to.equal('品质好');
          expect(quality.creator.length).to.not.equal(0);
          expect(quality.creatorName).to.equal(user.name);
          expect(quality.created.length).to.not.equal(0);
          expect(quality.modified.length).to.not.equal(0);
          done();
        });
      });
    

      it('should be able to show an error when try to save without name', function(done) {
        quality.name = '';

        return quality.save(function(err) {
          // console.log('it2 err:', err);
          expect(err).to.not.be(undefined);
          done();
        });
      });
     

      it('should be able to show an error when try to save without user', function(done) {
        quality.creator = {};

        return quality.save(function(err) {
          // console.log('it3 err:', err);
          expect(err).to.not.be(undefined);
          done();
        });
      });

    });

    describe('Method Delete', function() {
      it('should be able to mark delete without problems', function(done) {
        quality.markDelete().then(function(savedObj) {
          expect(savedObj.deleteFlag).to.be(true);
        }, function(errValue){
          expect(errValue).to.be(null);

        }).finally(done);
        return;
      });

    });

    after(function(done) {
      quality.remove(function () {
        user.remove(done);
      });
    });
  });
});
