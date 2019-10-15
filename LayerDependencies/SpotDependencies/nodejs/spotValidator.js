exports.validateSpot = (spot) => {
  if (!spot.latitude || !typeof spot.latitude === 'number') {
    console.log('invalid latitude');
    return false;
  }
  if (!spot.longitude || !typeof spot.longitude === 'number') {
    console.log('invalid longitude');
    return false;
  }
  if (!spot.spotName || !typeof spot.spotName === 'string') {
    console.log('invalid spot name');
    return false;
  }
  if (!spot.submittedBy || !typeof spot.submittedBy === 'string') {
    console.log('invalid submitter field');
    return false;
  }
  if (spot.isPrivate == null || !(typeof spot.isPrivate === 'boolean')) {
    console.log('invalid isPrivate field');
    return false;
  }
  return true;
};
