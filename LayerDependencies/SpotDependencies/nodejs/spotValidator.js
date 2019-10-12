exports.validateSpot = (spot) => {
  if (!spot.latitude || !typeof(spot.latitude) === 'number') return false;
  if (!spot.longitude || !typeof(spot.longitude) === 'number') return false;
  if (!spot.spotName || !typeof(spot.spotName) === 'string') return false;
  if (!spot.submittedBy || !typeof(spot.submittedBy) === 'string') return false;
  if (!spot.isPrivate || !typeof(spot.isPrivate) === 'boolean') return false;
  return true;
};
