const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

// Request targeting all articles
app.route("/articles")  // chained route handlers. Chained methods. For all requests targetting our articles route, we check if it's a get, post, or delete request. Then call what's inside the parenthesis correspondingly.

.get(function(req, res){

  Article.find(function(err, foundArticles){
    if(err){
      res.send(err);  // Sending it back to the client
    }else{
      res.send(foundArticles);  // Sending it back to the client
    }
  });

})

.post(function(req, res){   // Sending data to server to create/update

  const newArticle = new Article({   // Adding to mongoDB database
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Successfully added article.")
    }
  });

})

.delete(function(req, res){

  Article.deleteMany(function(err){  // Deleting all the articles
    if(err){
      res.send(err);
    }else{
      res.send("Successfully deleted all articles.");
    }
  });

});


// Request targeting a specific article
app.route("/articles/:articleName")

.get(function(req, res){

  const articleName = req.params.articleName;

  Article.findOne({title: articleName}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No articles found");
    }
  });

})

.put(function(req, res){   // Updating article. A put request is meant to replace the entire resource.

  Article.updateOne(
    {title: req.params.articleName},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Sucessfully updated");
      }
    }
  );

})

.patch(function(req, res){   // Used when we want to update a specific field in a specific document

  Article.updateOne(
    {title: req.params.articleName},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated.");
      }
    }
  );

})

.delete(function(req, res){   // deleting specific article

  Article.deleteOne(
    {title: req.params.articleName},
    function(err){
      if(!err){
        res.send("Successfully deleted article.");
      }
    }
  );

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
