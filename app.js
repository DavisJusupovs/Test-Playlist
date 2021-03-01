//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require('ejs');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-davis:Test123@cluster0.tzgvp.mongodb.net/playlist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});


const itemsSchema = {
  artist: String,
  title: String,
  album: String,
  releaseYear: Number,
  duration: Number
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  artist: "Imagine Dragons",
  title: "Warriors",
  album: "Single",
  releaseYear: 2014,
  duration: 3.14
});
const item2 = new Item({
  artist: "Eminem",
  title: "8 Miles",
  album: "Single",
  releaseYear: 2004,
  duration: 4.14
});

const exampleItem = [item1, item2];

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(exampleItem, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved example items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("playlist", {
        newListItems: foundItems
      });
    }
  });
});

app.post("/", function(req, res) {
  const itemArtist = req.body.newArtist
  const itemTitle = req.body.newTitle
  const itemAlbum = req.body.newAlbum
  const itemReleaseYear = req.body.newReleaseYear
  const itemDuration = req.body.newDuration

  const item = new Item({
    artist: itemArtist,
    title: itemTitle,
    album: itemAlbum,
    releaseYear: itemReleaseYear,
    duration: itemDuration
  });
  item.save();
  res.redirect("/")
});

app.post("/delete",function(req,res){
  const itemId = req.body.newItemId;
  Item.findByIdAndRemove(itemId, function(err) {
    if(!err){
      console.log("deleted it");
      res.redirect("/");
    }else{
      console.log(err);
    }
});
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started");
});
