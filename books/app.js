(function(){
  'use strict';
  angular.module('BookListApp',['common'])
  //angular.module('BookListApp',[])
  // angular.module('BookListApp',['ngResource'])
  .controller('BookListController',BookListController)
  .controller('ReadBooksController',ReadBooksController)
  .service('BookListService',BookListService);
  // .factory('BookListFactory',BookListFactory);

  // $http-based REST call
  BookListService.$inject = ['$http'];
  function BookListService($http){
    var service=this;
    var endpoint = "https://shielded-ridge-23814.herokuapp.com/";
    service.getBooks = function(){
      //var endpoint1xxx=endpoint+"allbooks";
      var endpoint1=endpoint+"unreadbooks";
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
        console.log("error message: ", errorResponse.message);
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
    service.readBook = function(id){
      var endpoint4=endpoint+"readbook/" + id;
      var promise = $http({
        url: endpoint4
      });
      promise.then(function (result){
        var items = result.data;
        return items;
      }, function (errorResponse){
        //console.log("error message: ", errorResponse.message);
      });
      return promise;
    };
	 service.getReadBooks = function(){
      var endpoint5=endpoint+"readbooks";
      var promise = $http({
        url: endpoint5
      });
      promise.then(function (result){
        var items = result.data;
        return items;
      }, function (errorResponse){
        console.log("error message: ", errorResponse.message);
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
    $scope.source = BookListService;
    var bookList = this;
    var promise = BookListService.getBooks();
    promise.then(function(response){
      bookList.books = response.data;
      //console.log("bookList.books: ",bookList.books);
    });

    bookList.saveNewBookTitle = function(){
      var promise = BookListService.addBook(bookList.newBookTitle);
      bookList.newBookTitle = "";
      promise.then(function(response){
        bookList.books = response.data;
        console.log("new book added, bookList.books: ",bookList.books);
      });
    }
    bookList.deleteBook = function(id){
      var promise = BookListService.deleteBook(id);
      promise.then(function(response){
        bookList.books = response.data;
        //console.log("book deleted, bookList.books: ",bookList.books);
      });
    }
    bookList.readBook = function(id){
      var promise = BookListService.readBook(id);
      promise.then(function(response){
			//$scope.$digest();
        bookList.books = response.data;
        console.log("book read, bookList.books: ",bookList.books);
      });
    }
  }
  
	ReadBooksController.$inject = ['BookListService','$scope'];
  function ReadBooksController(BookListService,$scope){
    //$scope.source = BookListService;
    var readBooks = this;
	 $scope.$watch('bookList', function() {
    var promise = BookListService.getReadBooks();
    promise.then(function(response){
		//$scope.$digest();
      readBooks.books = response.data;
      console.log("readBooks.books: ",readBooks.books);
    });
	 },true);
  }

})();
