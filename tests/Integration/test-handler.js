/**
 * This class contains integration tests for the handler methods.
 * These tests should only be run while a local instance of the
 *  backend is running.
 */
const axios = require('axios');
const _ = require('lodash');
const chai = require('chai');
const assert = chai.assert;
const validator =
  require('../../LayerDependencies/SpotDependencies/nodejs/spotValidator');

describe('Test get all spot function ', () => {
  it('callback', (done) => {
    try {
      axios.get('http://127.0.0.1:3000/spot').then((result) => {
        assert.isObject(result);
        assert.equal(200, result.status);
        _.forEach(result.Items, (spot) =>{
          assert.equal(validator.validateSpot(spot), true);
        });
        done();
      });
    } catch (err) {
      done(err);
    }
  });
});

