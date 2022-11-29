var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var csv = require('ya-csv');

var app = express();
app.use(express.static(path.join(__dirname, "")));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(request, response){
    response.sendFile(path.join(__dirname, "WWW/AsteroidRush.html"));
});

app.post('/score', function(request,response){
    var difficulty = request.body.difficulty;
    var name = request.body.fullName;
    var email = request.body.email;
    var score = request.body.score;


    var database = csv.createCsvFileWriter("scores.csv", {"flags": "a"});
    var data = [difficulty,name, email, score];

    database.writeRecord(data);
    database.writeStream.end();
    response.send(NaN);

});

app.get("/score", function(request, response) {
    var reader = csv.createCsvFileReader("scores.csv");
    reader.setColumnNames(['difficulty','name', 'email', 'score']);

    var scores = [];
    reader.addListener('data', function(data) {
        scores.push(data);
    });

    reader.addListener('end', function(){
        response.send(scores);
    })
});

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Asteroid Rush listening at http://%s:%s", host, port);
});

/*function isEmpty(str) {
    return (!str || 0 === str.length);
   if(isEmpty(name)) {
       response.send("Please make sure you enter your name.");
 }*/