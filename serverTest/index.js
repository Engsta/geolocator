const express = require('express'); // Import Express
const Datastore = require('nedb');

const app = express(); // instantiate Express
app.listen(9999,() => console.log('listening at 9999')); //Spin up the server to listen at port 3000
app.use(express.static('public')); //Serve up static files to our server
app.use(express.json({limit:'1mb'})); // Only take posts with less than 1mb

const database = new Datastore('database.db');
database.loadDatabase();


var fs = require('fs');

//Testing to see if this is on github

app.post('/api', (request,response) => {
    console.log('I got a request!');
    console.log(request.body);
    // Let's write this data to our txt file to persist forever.  This is a gimmicky solution since it exists on our local machine as a txt file

    // writeToFile(request.body.lat,request.body.long);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data)

    response.json({
        status: 'success',
        timestamp: timestamp,
        latitude: request.body.lat,
        longitude: request.body.long,
        name: request.body.fname,
        city: data.city,
        country: data.country,
        temp: data.temp
    });
}); // Setting up the routing for our server; a post request.  The next step is to set up the fetch post on our client side and call this api on the server


app.get('/api', (request,response) => {
    database.find({},(err,data) => {
        response.json(data);
    })
});


// Just a testing function to write to a local txt file.
async function writeToFile(lat,long) {
    fs.appendFile('geolocationHistory.txt',[Date.now().toString(),lat,long].toString().concat('\n'),function(err){
        if(err) throw err;
        console.log('Updated in geolocationHistory.txt!');
    });
};