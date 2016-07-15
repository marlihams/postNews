var express = require('express');
var mongoose=require("mongoose");
var Post=mongoose.model("Post");
var Comment=mongoose.model("Comment");
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



router.get('/posts', function(req, res, next) {
	Post.find(function(err,posts){
		if (err) return next(err);
		res.json(posts); // return all the posts present on the database
	});

});



router.post('/posts', function(req, res, next) {
	console.log(req.body);
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});


/* using middleware to preoload a post */
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});


/* getting a specific post with the id giving  */
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});
/* upvote a post  */

router.put('/posts/:post/upvote', function(req, res, next) {
	
  req.post.upvote(function(err, post){
    if (err) { return next(err); }
	console.log( "the result  "+post);
    res.json(post);
  });
});

router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});


module.exports = router;