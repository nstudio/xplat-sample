require('source-map-support').install();

// TODO: use this when we need to fun a job as a firebase function
// NOTE: to make this a function you will need to:
//    1) change /backend/firebase.json to /backend/firebase.api.json and add a firebase.jobs.json
//    2) change /backend/package.json script to copy the appropriate JSON file to firebase.json
//    3) have the package.json script also modify the /backend/functions/package.json main key so it points to the right file
