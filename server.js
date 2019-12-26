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

mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});

app.set("view-engine", "ejs");

var schem = new mongoose.Schema({
    name:String
});

//names model
var mod = mongoose.model("name", schem);

//dones model
var done = mongoose.model("done", schem);

//failed model
var failed1 = mongoose.model("fail", schem);



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
    mod.find({'name': req.body.todo}, function(err, value){
        if(value!=''){console.log('Already exists!')}
        else if(err){console.log(err)}
        else{
            mod.create(user, function(err, val){
                if(err){console.log(err)}
                else{
                    console.log('New item: '+ val.name);
                }
            })
        }
    })
    res.redirect('/');
    
})

app.post('/failed', (req, res)=>{
    var request = req.body.failed;
    var query = {name:request};
    var fail = new failed1({
        name: request
    })
    failed1.create(fail, (err, val)=>{
        if(err){console.log(err)}
        else{
            mod.deleteOne(query, (err, val1)=>{
                if(err){console.log(err)}
                    else{
                        console.log("New item added in fails and item removed from todos"+val1.name);
                    }   
                    })
        }
    })
    res.redirect('/');
})

app.post('/edit', (req, res)=>{
    var edit = req.body.edited;
    // mod.find()
    res.send(edit);
})

app.post('/done', function(req, res){
    var request= req.body.done;
    var query = {name: request
    }

    var done1 = new done({
        name: request
    })

    done.create(done1, (err, val) => {
        if(err){console.log(err)}
        else{
            mod.deleteOne(query, (err, obj)=>{
                if(err){console.log(err)}
                else{console.log("New Item added in dones and Document removed from main:"+obj.name)}
            })
        }
    })
    console.log(req.body.done);
    res.redirect('/');
})

app.listen(port, function(){
    console.log("Listening at port 8080");
});