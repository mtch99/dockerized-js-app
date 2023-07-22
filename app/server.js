let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
const { EventEmitter } = require('stream');
let app = express();

let databaseUrl = constructDatabaseUrl();

console.warn("Databaseurl: " + databaseUrl)
// pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const databaseName = "user-account";
const collectionName = "users";


app.use(express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(bodyParser.json())


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/style', function (req, res) {
  res.end("../app/style.css")
})

app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "static/images/profile-1.jpg"));
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});




app.get('/get-profile', function (req, res) {
  let response = {};
  // Connect to the db using local application or docker compose variable in connection properties
  try {
    MongoClient.connect(databaseUrl, mongoClientOptions, function (err, client) {
      if (err) throw err;
  
      let db = client.db(databaseName);
  
      let myquery = { userid: 1 };
  
      db.collection(collectionName).findOne(myquery, function (err, result) {
        if (err) throw err;
        response = result;
        client.close();
  
        // Send response
        res.send(response ? response : {});
      });
    });
  } catch(err) {
    console.log("sojsojsosj")
    res.status('500').send("Could not connect to the server");
  }

});

app.post('/update-profile', function (req, res) {

  let userObj = req.body;
  // Connect to the db using local application or docker compose variable in connection properties
  try {
    MongoClient.connect(databaseUrl, mongoClientOptions, function (err, client) {
      if (err) throw err;
      let db = client.db(databaseName);
      userObj['userid'] = 1;
  
      let myquery = { userid: 1 };
      let newvalues = { $set: userObj };
  
      db.collection(collectionName).updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
        if (err) throw err;
        client.close();
      });
  
    });
    // Send response
    res.send(userObj);
  }  catch (err) {
    res.status("500").send("Could not connect to the server")
  }
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});




function constructDatabaseUrl(){
  const baseUrl = "mongodb://admin:password@"
  const commandOption = getCommandOption()
  let databaseUrl = baseUrl
  if(commandOption == "localhost"){
    databaseUrl += "localhost:27017"
  } else {
    databaseUrl += "mongodb"
  }

  return databaseUrl
}

function getCommandOption(){
  const commandArguments = process.argv.slice(2)
  const isArgumentsEmpty = commandArguments.length == 0

  if(isArgumentsEmpty){
    return null
  }

  const firstArgument = commandArguments[0]
  console.warn("first argument: " + firstArgument)
  
  if(!isOptionArgument(firstArgument)){
    return null
  }
  console.warn("Is option argument: " + true)


  return firstArgument.slice(2)
}


/**
 * 
 * @param {string} argument 
 * @returns {boolean}
 */
function isOptionArgument(argument){
  const regExp = "^--[a-z]+$"
  const isOption = argument.match(regExp)

  return isOption
}


/**
 * If an option matches a given string
 * @param {string} str 
 * @returns {boolean}
 */
function isOptionMatch(str, option){
  const regExp = `^--${str}$`
  const isMatch = option.match(regExp)

  return isMatch
}