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


// TODO: write integration tests for save, delete, radial, bounding box, and user spot endponits.

describe('Test get all spot function ', () => {
  it('should return a json object with all the valid spot data', (done) => {
    axios.get('http://127.0.0.1:3000/spot').then((result) => {
      assert.isObject(result);
      assert.equal(200, result.status);
      _.forEach(result.data.Items, (spot) => {
        assert.equal(validator.validateSpot(spot), true);
      });
      done();
    }).catch((error) => {
      done(error);
    });
  });
});
