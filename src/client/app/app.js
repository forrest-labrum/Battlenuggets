angular.module('battle', [
  'battle.services',
  'battle.auth',
  'battle.chatRoom',
  'battle.game',
  'betboard',
  'luegg.directives',
  'ngMessages',
  'ui.router',
  'ui.bootstrap',
  'battle.store'
])

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');
  // the main state
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'index.html',
      // the left, gameview and right are nested states of the home
      views: {
        'left': {
          templateUrl: 'app/betboard/betboard.html'
        },
        'gameview': {
          templateUrl: 'app/game/game.html',
          controller: 'GameCtrl'
        },
        'right': {
          templateUrl: 'app/chat/chat.html',
          controller: 'ChatCtrl'
        }
      }
    })
    .state('store', {
      url: '/store',
      templateUrl: 'app/store/store.html',
      controller: 'StoreController'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    });

  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function ($window) {
  var attach = {
    // the following attaches the token stored in local storage
    // to any outgoing requests so that the server has a means of
    // securely identifying the logged-in user
    request: function (object) {
      var jwt = $window.localStorage.getItem('nuggets');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function ($rootScope, $location, Auth, Bets, socket, $state) {
  $rootScope.$state = $state;
  $rootScope.$on('$stateChangeStart', function (e, next) {
    socket.removeAllListeners();
  });
});
