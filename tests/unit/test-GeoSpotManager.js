'use strict';
// eslint-disable-next-line max-len
const spotQueryManager = require('../../LayerDependencies/SpotDependencies/nodejs/QueryManagers/GeoSpotManager');
const chai = require('chai');
const assert = chai.assert;

const testSpot = {
  'geoJson': {
    'type': 'POINT',
    'coordinates': [-117.199236, 32.834245],
  },
  'spotName': 'Strawberry Rock',
  'submittedBy': 'unit-tester',
  'isPrivate': false,
  'rating': 0,
  'spotType': 'spot',
};

describe('Manage crud operations for spots ', () => {
  it('should return a json object with spots', async () => {
    const result = await spotQueryManager.getAllPublicSpots();
    assert.isNotNull(result);
    assert.isObject(result);
    assert.isTrue(result.Items.length > 0);
  });

  it('should save the spot, retreive it by its id, and then delete it. This tests the lifecycle of a spot ', async () => {
    const savedSpot = await spotQueryManager.saveSpot(testSpot);

    const result = await spotQueryManager.getAllPublicSpots();
    assert.isNotNull(result);
    assert.isObject(result);
    assert.isTrue(result.Items.length > 0);

    let foundSpot;
    result.Items.forEach((item) => {
      if (item.spotName === testSpot.spotName) {
        foundSpot = item;
      }
    });
    assert.isNotNull(foundSpot);
    assert.isObject(foundSpot);
    console.log(foundSpot);

    const detailedSpot = await spotQueryManager.getUserSpots(foundSpot.submittedBy);
    assert.isNotNull(detailedSpot);
    assert.isObject(detailedSpot);
    console.log(detailedSpot);
  });
});
