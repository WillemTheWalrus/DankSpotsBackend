'use strict';
// eslint-disable-next-line max-len
const validator = require('../../LayerDependencies/SpotDependencies/nodejs/spotValidator');
const chai = require('chai');
const assert = chai.assert;

const invalidJson = {
  testField: 'fake',
};

const invalidSpotJson = {
  latitude: 'hello',
  longitue: 4,
  spotName: 83,
  submittedBy: 'dale',
  isPrivate: 'false',
};

const validSpotJson = {
  geoJson: '{"type":"POINT","coordinates":[-117.199236,32.834245]}',
  spotName: 'Strawberry Rock',
  submittedBy: 'will',
  isPrivate: false,
  rating: 0,
  spotType: 'spot',
};

describe('Spot validating ', () => {
  it('should return false for the invalid json', () => {
    const result = validator.validateSpot(invalidJson);
    assert.isNotNull(result);
    assert.isBoolean(result);
    assert.isFalse(result);
  });

  it('should return false for invalid spot json', () => {
    const result = validator.validateSpot(invalidSpotJson);
    assert.isNotNull(result);
    assert.isBoolean(result);
    assert.isFalse(result);
  });

  it('should return true for valid spot json', () => {
    const result = validator.validateSpot(validSpotJson);
    assert.isNotNull(result);
    assert.isBoolean(result);
    assert.isTrue(result);
  });
});
