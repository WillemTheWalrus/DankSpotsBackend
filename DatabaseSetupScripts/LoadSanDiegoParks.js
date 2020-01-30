const GoogleCredentials = require('C:\\Users\\William Doudna\\Desktop\\GOOGLE_PLACES_API_KEY.json');
const googleMapsClient = require('@google/maps').createClient({
  key: GoogleCredentials.placesApiKey,
});
const fs = require('fs');
const SanDiegoSpots = require('./SanDiegoSpots.json');
const SanFranciscoSpots = require('./SanFranciscoSpots.json');
const geoSpotManager = require('../LayerDependencies/SpotDependencies/nodejs/QueryManagers/GeoSpotManager');
const uuid = require('uuid/v1');
const rn = require('random-number');


const getGoogleSpots = () => {
  googleMapsClient.placesNearby({
    location: [37.762307, -122.438889],
    radius: 2000000,
    type: 'park',
  },
  (err, response) => {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile('SanFranciscoSpots.json', JSON.stringify(response), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('file written');
        }
      });
    }
  });
};

const uploadSanDiegoSpots = () => {
  SanDiegoSpots.json.results.forEach((spot) => {
    const name = spot.name;
    const latitude = spot.geometry.location.lat;
    const longitude = spot.geometry.location.lng;

    const newSpot = {
      name: name,
      latitude: latitude,
      longitude: longitude,
      submittedBy: 'TESTER',
      isPrivate: false,
      type: 'spot',
    };
    geoSpotManager.saveSpot(newSpot);
  });
};

const uploadSanFranciscoSpots = () => {
  SanFranciscoSpots.json.results.forEach((spot) => {
    const name = spot.name;
    const latitude = spot.geometry.location.lat;
    const longitude = spot.geometry.location.lng;

    const newSpot = {
      name: name,
      latitude: latitude,
      longitude: longitude,
      submittedBy: 'TESTER',
      isPrivate: false,
    };
    geoSpotManager.saveSpot(newSpot);
  });
};

const generateRandomSpotInSanDiego = () => {
  const longitudeOptions = {
    min: -117.247094,
    max: -116.979710,
  };
  const latitudeOptions = {
    min: 32.536398,
    max: 33.107865,
  };

  let latitude = rn(latitudeOptions);
  latitude = Math.round(latitude * 10000000)/ 10000000;
  let longitude = rn(longitudeOptions);
  longitude = Math.round(longitude * 10000000)/ 10000000;

  return {
    spotName: 'RANDOM SPOT',
    geoJson: {
      type: 'POINT',
      coordinates: [latitude, longitude],
    },
    submittedBy: 'TESTER',
    isPrivate: false,
    spotType: 'spot',
  };
};

// let i = 0;
// while (i < 250) {
//   console.log(i);
//   geoSpotManager.saveSpot(generateRandomSpotInSanDiego());
//   i++;
// }
geoSpotManager.saveSpot({
  spotName: 'Columbia Care San Diego Dispensary',
  geoJson: {
    type: 'POINT',
    coordinates: [32.807973, -117.217577],
  },
  submittedBy: 'Will',
  isPrivate: false,
  spotType: 'plug',
});
