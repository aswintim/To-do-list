var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

var parser = require('body-parser');

var mongoose = require('mongoose');

app.use(parser.urlencoded({extended: true}));

app.use(express.static("public"));

var url = process.env.MONGODB_URI || "mongodb://localhost/toDoList";

// var mongoClient = mongo.MongoClient;

// var url = 'mongodb://<dbuser>:<dbpassword>@ds013222.mlab.com:13222/heroku_pxhmf7d0';

mongoose.connect(url, function(err, db){
    if(err){console.log("Connection Error", err)}
    else{console.log("Connection Established!", url)
}
})

app.set("view-engine", "ejs");

var schem = new mongoose.Schema({
    name:String
});

//names model
var mod = mongoose.model("name", schem);

//dones model
var done = mongoose.model("done", schem);


app.get('/', function(req, res){
    mod.find({}, function(err, val){
        if(err){console.log(err)}
        else{res.render("index.ejs", {a:val})}
    })
});

app.post('/submit', function(req, res){
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

app.post('/done', function(req, res){
    var request= req.body.done;
    var query = {name: request
    }
    mod.remove(query, (err, obj)=>{
        if(err){console.log(err)}
        else{console.log("Document removed from main:"+obj)}
    })
    var done1 = new done({
        name: request
    })

    done.create(done1, (err, val) => {
        if(err){console.log(err)}
        else{
            console.log('New item added in dones: ' + val);
        }
    })
    console.log(req.body.done);
    res.redirect('/');
})

app.listen(port, function(){
    console.log("Listening at port 8080");
});