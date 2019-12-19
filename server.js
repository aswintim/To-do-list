var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

var parser = require('body-parser');
var mongo = require('mongodb');

app.use(parser.urlencoded({extended: true}));

app.use(express.static("public"));

// mongo.connect("mongodb://<dbuser>:<dbpassword>@ds013222.mlab.com:13222/heroku_pxhmf7d0");

var mongoClient = mongo.MongoClient;

var url = 'mongodb://<dbuser>:<dbpassword>@ds013222.mlab.com:13222/heroku_pxhmf7d0';

mongoClient.connect(url, function(err, db){
    if(err){console.log("Connection Error", err)}
    else{console.log("Connection Established!", url);
db.close();
}
})

app.set("view-engine", "ejs");

var schem = new mongo.Schema({
    name:String
});

var mod = mongo.model("name", schem);

app.get('/', function(req, res){
    mod.find({}, function(err, val){
        if(err){console.log(err)}
        else{res.render("index.ejs", {a:val})}
    })
});

app.post('/action', function(req, res){
    var user = new mod({
        name: req.body.todo
    });
    mod.create(user, function(err, val){
        if(err){console.log(err)}
        else{
            console.log('New item: '+ val.name);
        }
    })
    res.redirect('/');
})

app.listen(port, function(){
    console.log("Listening at port 8080");
});