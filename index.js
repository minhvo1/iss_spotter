const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  for (let time of passTimes) {
    let date = new Date(time.risetime);
    console.log(`Next pass at ${date} for ${time.duration} seconds!`);
  }
  
});