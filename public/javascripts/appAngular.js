var app = angular.module('postNews', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'PostCtrl'
    })
    .state('detail', {
	  url: '/details/{id}',
	  templateUrl: '/details.html',
	  controller: 'CommentCtrl'
	});

  $urlRouterProvider.otherwise('home');
}]);

/* service angular */

app.factory("posts",[function(){

	return {
		posts:[]
	};

}]);


app.controller('PostCtrl', [
'$scope','posts',function($scope,posts){
 
	$scope.posts =posts.posts;

$scope.addPost=function(){
	if ($scope.title && $scope.title !=''){
		$scope.posts.push({
			title:$scope.title,
			link:$scope.link,
			'upvotes':0});

		$scope.title='';
		$scope.link='';
	}

};

$scope.newVotes=function(post){
	++post.upvotes;
}

}]);

app.controller('CommentCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	function($scope, $stateParams, posts){
		$scope.post=posts.posts[$stateParams.id];

		$scope.addComment = function(){
		  if($scope.body === '') { return; }
		  $scope.post.comments.push({
		    body: $scope.body,
		    author: 'user',
		    upvotes: 0
		  });
		  $scope.body = '';
		};


	}]);