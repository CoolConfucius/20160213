'use strict';

var app = angular.module('someApp', ['ui.router']); 

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', { url: '/', templateUrl: '/html/home/home.html', controller: 'homeCtrl' })
    .state('register', { url: '/register', templateUrl: '/html/user/register.html', controller: 'userCtrl' })
    .state('login', { url: '/login', templateUrl: '/html/user/login.html', controller: 'userCtrl' })
    .state('profile', { url: '/profile', templateUrl: '/html/user/profile.html', controller: 'profileCtrl' })
    .state('otters', { url: '/otters', templateUrl: '/html/home/otterslist.html', controller: 'otterCtrl' })

  $urlRouterProvider.otherwise('/'); 
});

app.service('User', function($http) {
  

  this.user = function() {
    return $http.get('/users').then(res => {
      this.data = res.data; 
    });  
  }

  this.register = function(userObj) {
    return $http.post('/users/register', userObj)
  };

  this.login = function(userObj) {
    console.log("SERVICE LOGIN");
    return $http.post('/users/login', userObj); 
  };

  this.getProfile = function() {
    return $http.get('/users/profile').then(res => {
      this.profile = res.data; 
    });  
  }

  this.editProfile = function(profileObj) {
    return $http.put('/users/profile', profileObj)
  }

  this.getOtters = function() {
    return $http.get('/otters').then(res => {
      this.otters = res.data; 
    });  
  }

})

app.run(function(User){
  User.user(); 
  User.getOtters(); 
})
app.controller('homeCtrl', function($rootScope, $scope, $state, User) {
  console.log('homeCtrl');
  $rootScope.user = User.data; 
  $scope.user = $rootScope.user;
  console.log($rootScope.user, "scope dot user");
});
app.controller('otterCtrl', function($rootScope, $scope, $state, User) {
  console.log('otterCtrl');
  $rootScope.user = User.data; 
  $scope.user = $rootScope.user;
  // User.getOtters(); 
  console.log($rootScope.user, "scope dot user");
  $scope.otters = User.otters; 

  $scope.likeOtter = function(otterid) {
    User.likeOtter(); 
  }
});
app.controller('profileCtrl', function($rootScope, $scope, $state, User) {
  console.log('profileCtrl');
  $rootScope.user = User.data; 
  $scope.user = $rootScope.user;  



  $scope.editProfile = function() {
    var profileObj = $scope.profileObj;
    var id = $scope.user._id; 
    console.log($scope.profileObj, $scope.user._id);
    User.editProfile(profileObj).then(res => {
      $scope.profile = res.data; 
    }); ; 
    console.log("swal here");
  }

});
app.controller('userCtrl', function($rootScope, $scope, $state, User) {
  console.log('userCtrl');
  $rootScope.user = User.data; 
  $scope.user = $rootScope.user;  

  $scope.register = function() {
    var userObj = $scope.userObj;
    console.log($scope.userObj);
    User.register(userObj); 
    $state.go('login');
  }

  $scope.login = function() {
    var userObj = $scope.userObj;
    console.log($scope.userObj);
    User.login(userObj).then(res => {
      $rootScope.user = res.data; 
    }); 
    $state.go('home');
  }

});
