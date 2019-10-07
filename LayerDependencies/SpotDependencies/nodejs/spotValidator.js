exports.validateSpot = (spot) => {
  if (!spot.latitude || !typeof(spot.latitude) === 'number') return false;
  if (!spot.longitude || !typeof(spot.longitude) === 'number') return false;
  
};
