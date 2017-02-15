(function(){
  'use strict';
  angular.module('BookListApp',[])
  // angular.module('BookListApp',['ngResource'])
  .controller('BookListController',BookListController)
  .service('BookListService',BookListService);
  // .factory('BookListFactory',BookListFactory);

  // $http-based REST call
  BookListService.$inject = ['$http'];
  function BookListService($http){
    var service=this;
    var endpoint = "https://shielded-ridge-23814.herokuapp.com/";
    service.getBooks = function(){
      var endpoint1=endpoint+"allbooks";
      var promise = $http({
        url: endpoint1
      });
      promise.then(function (result){
        var items = result.data;
        return items;
      }, function (errorResponse){
        //console.log("error message: ", errorResponse.message);
      });
      return promise;
    };
    service.addBook = function(title){
      var endpoint2=endpoint+"addbook";
      var promise = $http({
        url: endpoint2,
        params: {'title':title}
      });
      promise.then(function (result){
        var items = result.data;
        return items;
      }, function (errorResponse){
        //console.log("error message: ", errorResponse.message);
      });
      return promise;
    };
    service.deleteBook = function(id){
      var endpoint3=endpoint+"deletebook/" + id;
      var promise = $http({
        url: endpoint3
      });
      promise.then(function (result){
        var items = result.data;
        return items;
      }, function (errorResponse){
        //console.log("error message: ", errorResponse.message);
      });
      return promise;
    };
  }

  //$resource-based REST call.  NOT USED
  BookListFactory.$inject = ['$resource'];
  function BookListFactory($resource){
    return $resource("https://shielded-ridge-23814.herokuapp.com/addbook",{},{
      'saveNewBookTitle': {method: 'POST',cache:false,isArray:false}
    });
  }

  BookListController.$inject = ['BookListService','$scope'];
  function BookListController(BookListService,$scope){
    //$scope.source = BookListService;
    var bookList = this;
    var promise = BookListService.getBooks();
    promise.then(function(response){
      bookList.books = response.data;
      //console.log("bookList.books: ",bookList.books);
    });

    bookList.saveNewBookTitle = function(){
      var promise = BookListService.addBook(bookList.newBookTitle);
      promise.then(function(response){
        bookList.books = response.data;
        //console.log("new book added, bookList.books: ",bookList.books);
      });
    }
    bookList.deleteBook = function(id){
      var promise = BookListService.deleteBook(id);
      promise.then(function(response){
        bookList.books = response.data;
        //console.log("book deleted, bookList.books: ",bookList.books);
      });
    }
  }

})();
