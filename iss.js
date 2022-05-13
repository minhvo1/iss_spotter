const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    const data = JSON.parse(body);
    // if error encountered
    if (error) return callback(error, null);
    // if status code is other than 200 (other errors)
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, data.ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://api.ipbase.com/v2/info?apikey=A7KjEk6KjEgYluhH88GykGZFhhz2tMbjX3fk2gED&ip=${ip}`, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const obj = JSON.parse(body);
    const data = {
      latitude: obj.data.location.latitude,
      longitude: obj.data.location.longitude
    };
    callback(null, data);

  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Fly Over Times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  // fetch IP address
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
    console.log('It worked! Returned IP:' , ip);

    // fetch coordinates by IP
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        console.log("Failed while fetching coordinates by IP", error);
        return;
      }
      console.log("Fetched coordinates by IP", coordinates);

      // fetch fly over times
      fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
        if (error) {
          console.log("Failed while fetching Fly Over Times", error);
          return;
        }
        console.log("Fetched Fly Over Times", passTimes);

        // execute callback to retrieve pass times
        callback(error, passTimes);
      });
    });
  });
};


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };