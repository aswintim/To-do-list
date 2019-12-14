var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

var parser = require('body-parser');
var mongo = require('mongoose');

app.use(parser.urlencoded({extended: true}));

app.use(express.static("public"));

mongo.connect("mongodb://localhost/toDoList");

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