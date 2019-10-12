'use strict';
// eslint-disable-next-line max-len
const spotQueryManager = require('../../LayerDependencies/SpotDependencies/nodejs/QueryManagers/GeoSpotManager');
const chai = require('chai');
const assert = chai.assert;
describe('Get Spots ', () => {
  it('should return a json object with spots', async () => {
    const result = await spotQueryManager.getAllPublicSpots();
    assert.isNotNull(result);
    assert.isObject(result);
    assert.isTrue(result.Items.length > 0);
  });
});
