angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('TodosCtrl', function($scope, $http, $state, $window, Dados, $ionicScrollDelegate){

  Dados.loadDados().then(function(data){
    $scope.itens = data;

    data = updateFavorito(data);
    Dados.setDados(data);
  });

  $scope.hora = new Date();

  $scope.getCanal = function(id, index){
    // alert('getCanal ' + id + ' ' + index);
    $state.go('tab.canal', {'index': id});
    // $window.location.href = 'http://localhost/programacaotv/www/#/tab/canal/' + id;

  };


  $scope.setFavorito = function(id, index){
    // $scope.itens[index].favorito = !$scope.itens[index].favorito;
    // Dados.setDados($scope.itens);
    
    // pega o index no array
    for( var x = 0, total = $scope.itens.length; x < total; x++) {
      if ($scope.itens[x].IdCanal == id){
        index = x;
        break;
      }
    };

    // pega do cache
    var favoritos = window.localStorage.getItem('favoritos');
    if (favoritos){
      favoritos = JSON.parse(favoritos);
    }else{
      favoritos = [];
    }

    // verifica se ja existe
    var i = favoritos.indexOf(id);
    // adiciona
    if (i === -1){
      favoritos.push(id);
      $scope.itens[index].favorito = true;
    // remove
    }else{
      favoritos.splice(i, 1);
      $scope.itens[index].favorito = false;
    }

    window.localStorage.setItem('favoritos', JSON.stringify(favoritos) );
    Dados.setDados($scope.itens); // atualiza array
  };

  // preenche com os favoritos do cache
  function updateFavorito(dados){

    var favoritos = window.localStorage.getItem('favoritos');
    // se tiver favorito
    if (favoritos){
      favoritos = JSON.parse(favoritos);

      for( var x = 0, total = dados.length; x < total; x++){
        if ( favoritos.indexOf(dados[x].IdCanal) !== -1 ) dados[x].favorito = true;          
      }
    }

    return dados;
  };


  // busca
  $scope.scrollTop = function(){
    $ionicScrollDelegate.scrollTop();
  }

})


.controller('CanalCtrl', function($scope, $stateParams, Dados){

  var hora = new Date();
  hora = hora.getHours() + '00';

  $scope.classe = 'positive';

  $scope.item = Dados.getCanal($stateParams.index);   


  $scope.filtraHora = function(prop){
    return function(item){
      return parseInt(item[prop]) > hora;
    }
  };


  // $scope.dia = '20 de outrubro de 2015';


  // atualizar
 /* $scope.doRefresh = function(){
    
    $http.get('/new-items')
     .success(function(newItems) {
       $scope.items = newItems;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };*/

})


.controller('FavoritosCtrl', function($scope, $http, $state, $window, Dados){

  $scope.shouldShowDelete = false;

  if ( typeof Dados.getDados() !== 'undefined'){
    $scope.itens = Dados.getDados();

  }else{

    Dados.loadDados().then(function(data){
      $scope.itens = data;

      data = updateFavorito(data);
      Dados.setDados(data);
    });
  }


  // preenche com os favoritos do cache
  function updateFavorito(dados){

    var favoritos = window.localStorage.getItem('favoritos');
    // se tiver favorito
    if (favoritos){
      favoritos = JSON.parse(favoritos);

      for( var x = 0, total = dados.length; x < total; x++){
        if ( favoritos.indexOf(dados[x].IdCanal) !== -1 ) dados[x].favorito = true;          
      }
    }

    return dados;
  };

  // $http.get("externos/5.json").success(function(response) {
      // $scope.itens = Dados.getDados();
      // console.log($scope.itens, 1);
  // });
  // setTimeout( function(){ $scope.itens = Dados.all(); }, 2000);
  // exibe apenas os favoritados -------------------------
  /*var favoritos = window.localStorage.getItem('favoritos');
  if (favoritos.length > 2){
    favoritos = JSON.parse(favoritos);

    // filtra
    var ar = data.patrimonios, favoritados = [];
    ar.forEach( function(value, index){
      if ( favoritos.indexOf(value.id) !== -1){
        favoritados.push(value);
      }
    });

    $scope.patrimonios = favoritados;

  }else{
    $scope.patrimonios = null;
  }*/
  // ----------------------------------------------------


  $scope.hora = new Date();

  $scope.getCanal = function(id, index){
    // alert('getCanal ' + id + ' ' + index);
    $state.go('tab.favorito', {'index': id});
    // $window.location.href = 'http://localhost/programacaotv/www/#/tab/favorito/' + id;

  };


  $scope.remover = function(index, id){
    
    // pega o index no array
    for( var x = 0, total = $scope.itens.length; x < total; x++) {
      if ($scope.itens[x].IdCanal == id){
        index = x;
        break;
      }
    };

    // pega do cache
    var favoritos = window.localStorage.getItem('favoritos');
    if (favoritos){
      favoritos = JSON.parse(favoritos);
    }else{
      favoritos = [];
    }

    // verifica se ja existe
    var i = favoritos.indexOf(id);
    // adiciona
    if (i === -1){
      favoritos.push(id);
      $scope.itens[index].favorito = true;
    // remove
    }else{
      favoritos.splice(i, 1);
      $scope.itens[index].favorito = false;
    }

    window.localStorage.setItem('favoritos', JSON.stringify(favoritos) );
    Dados.setDados($scope.itens); // atualiza array

  };


  $scope.expandir = false;

  var data = new Date();
  hora = data.getHours() + '00';
  horaFim = (data.getHours() + 2) + '00';

  $scope.filtraHora = function(prop){
    return function(item){
      return parseInt(item[prop]) > hora;
    }
  };
  $scope.filtraHoraLimit = function(prop){
    return function(item){
      return parseInt(item[prop]) > hora && parseInt(item[prop]) < horaFim;
    }
  };

})


.controller('FavoritoCtrl', function($scope, $stateParams, Dados){

  var hora = new Date();
  hora = hora.getHours() + '00';

  $scope.classe = 'positive';

  $scope.item = Dados.getCanal($stateParams.index);

  $scope.filtraHora = function(prop){
    return function(item){
      return parseInt(item[prop]) > hora;
    }
  };

})


.controller('SobreCtrl', function($scope, $stateParams){

})

;