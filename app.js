//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
// Run main function and catch error
main().catch((err) => console.log(err));
// async function
async function main() {

  const url = 'mongodb+srv://admin-edgar:Test123@cluster0.mymjlk1.mongodb.net';
  const dbPath = "/wikiDB";
  await mongoose.connect(url + dbPath);
  //{useNewUrlParser: true} //(no longer necessary)avoids depreciation warning

const articleSchema = {
  title: String,
  content: String
};
const Article = new mongoose.model("Article", articleSchema);

///////////////////////////////////////Requests Targeting all Articles///////////////////////////

//[app.route]A chainable route handler
app.route("/articles")
//Model.method({route/codition}, function(){})
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }

  });
})

.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles.");
    } else {
      res.send(err);
    }
  });
});

// no longer require these app.get,post,delete
// app.get("/articles", );
//
// app.post("/articles", );
//             //route
// app.delete("/articles", );
//


////////////////////////////////////Requests Targeting A Specific Articles/////////////////////////

// Example --> req.params.articleTitle = "Edgar-R."

app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  });
})

.put(function(req, res){
// Warning: collection.update is deprecated. Use updateOne, updateMany, or bulkWrite instead.
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      }
    }
  );
})

.patch(function(req, res){

  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated selected article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the corresponding article.");
      } else {
        res.send(err);
      }
    }
  );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});




}
