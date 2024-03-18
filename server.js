let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
const cors = require('cors');
let app = express();

const corsOptions = {
  origin: 'http://dic-demo-305002325.ap-south-1.elb.amazonaws.com/', // Replace with the origin you want to allow
  methods: 'GET,POST', // Specify the HTTP methods you want to support
};


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static('app'));
app.get('/', function (req, res) {
 
    res.sendFile(path.join(__dirname, "index.html"));
  });

  app.get('/profile-picture', function (req, res) {
    // Read the SVG image file
    const img = fs.readFileSync(path.join(__dirname, 'images/karmayogiLogo.svg'));
  
    // Set the content type to 'image/svg+xml'
    res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
  
    // Send the image as binary data
    res.end(img, 'binary');
  });

// use when starting application locally
let mongoUrlLocal = "mongodb://admin:password@35.154.60.189:27017";

// use when starting application as docker container
let mongoUrlDocker = "mongodb://admin:password@mongodb";

// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// "user-account" in demo with docker. "my-db" in demo with docker-compose
let databaseName = "my-db";

app.post('/update-profile', function (req, res) {
  let userObj = req.body;

  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);
    userObj['userid'] = 1;

    let myquery = { userid: 1 };
    let newvalues = { $set: userObj };

    db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
      if (err) throw err;
      client.close();
    });

  });
  // Send response
  res.send(userObj);
});

app.get('/get-profile', function (req, res) {

  let response = {};
  // Connect to the db
  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
  
      console.log('Connected to MongoDB');
    
    if (err) throw err;

    let db = client.db(databaseName);

    let myquery = { userid: 1 };

    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();

      // Send response
      res.send(response ? response : {});
    });
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
