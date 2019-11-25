'use strict';

exports.validateSpot = (spot) => {
  console.log('validating spot: ' + JSON.stringify(spot));

  // Validate the GeoJson. Since the dynamo-db geo library that
  // is used stores the type as POINT in all uppercase,
  // we cannot use a normal geo json validator
  if (spot.geoJson == null|| !typeof spot.geoJson === 'string') {
    console.log('invalid geoJson');
    return false;
  }
  try {
    const parsedGeoJson = JSON.parse(spot.geoJson);
    if (parsedGeoJson.type == null|| !parsedGeoJson.type === 'POINT') {
      console.log('invalid type field!');
      return false;
    }
    if (parsedGeoJson.coordinates == null || !typeof parsedGeoJson.coordinates === 'object') {
      console.log('invalid coordinate array!');
      return false;
    }
  } catch (error) {
    console.log('error parsing geoJson: ' + error);
    return false;
  }

  if (spot.spotName == null || !typeof spot.spotName === 'string') {
    console.log('invalid spot name');
    return false;
  }

  if (spot.submittedBy == null|| !typeof spot.submittedBy === 'string') {
    console.log('invalid submitter field');
    return false;
  }

  if (spot.isPrivate == null || !typeof spot.isPrivate === 'boolean') {
    console.log('invalid isPrivate field');
    return false;
  }

  if (spot.rating == null || !typeof spot.rating === 'number') {
    console.log('invalid rating');
    return false;
  }

  return true;
};
