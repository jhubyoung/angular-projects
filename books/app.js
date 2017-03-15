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
	 var srvReadBooks;
	 
    service.getBooks = function(){
      var endpoint1=endpoint+"unreadbooks";
      var promise = $http({
        url: endpoint1
      });
      promise.then(function (result){
        var items = result.data;
		  console.log("service: getBooks");
		  console.log("service: service.srvReadBooks: ",service.srvReadBooks);
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
		  console.log("service: addBook");
		  console.log("service: service.srvReadBooks: ",service.srvReadBooks);
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
		  console.log("service: deleteBook");
		  console.log("service: service.srvReadBooks: ",service.srvReadBooks);
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
		  console.log("service: readBook");
		  console.log("service: service.srvReadBooks: ",service.srvReadBooks);
		  console.log("service: readBook.items (unread): ",items);
		  //service.srvReadBooks.splice(0, service.srvReadBooks.length);
		  //console.log("service: service.srvReadBooks: ",service.srvReadBooks);
		  //console.log("service: readBook.items (unread): ",items);
		  service.srvReadBooks=service.getReadBooks();
		  console.log("service: service.srvReadBooks: ",service.srvReadBooks);
		  console.log("----------------------");
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
		  service.srvReadBooks = result.data;
		  console.log("service: getReadBooks");
		  console.log("service: service.srvReadBooks: ",service.srvReadBooks);
		  console.log("service: items (read): ",items);
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

  BookListController.$inject = ['BookListService','$scope','$rootScope'];
  function BookListController(BookListService,$scope,$rootScope){
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
		  //$rootScope.$broadcast('bookListEvent', bookList);
        console.log("ctrl, book read, bookList.books: ",bookList.books);
      });
    }
  }
  
	ReadBooksController.$inject = ['BookListService','$scope','$rootScope'];
  function ReadBooksController(BookListService,$scope,$rootScope){
    //$scope.source = BookListService;
    var readBooks = this;
	 //$scope.$on('bookList', function(event, ) {
		 var promise = BookListService.getReadBooks();
		 //$scope.$on('bookListEvent', function(event, promise) {
			 //console.log("ReadBooksController, caught bookListEvent");
			 promise.then(function(response){
				//$scope.$digest();
				readBooks.books = response.data;
				console.log("ctrl, readBooks.books: ",readBooks.books);
				console.log("ctrl, BookListService.srvReadBooks: ",BookListService.srvReadBooks);
			 });
			 
		(function () {
            $scope.$watch(function () {
					console.log("ctrl:watch");
					console.log("ctrl:watch, BookListService.srvReadBooks: ",BookListService.srvReadBooks);
					console.log("ctrl:watch, readBooks.books: ",readBooks.books);
                return BookListService.srvReadBooks;
            }, function (newVal, oldVal) {
                if ( newVal !== oldVal ) {
						 console.log("ctrl:watch. oldVal: ",oldVal," newVal: ",newVal);
                }
                else {
						 console.log("ctrl:watch (else). oldVal: ",oldVal," newVal: ",newVal);
                }
            });
        }());
		  
		 //});
		 //$scope.$on('bookListEvent', function(event, promise) {
			 //console.log("ReadBooksController, caught bookListEvent");
		 //}
	 //},true);
  }

})();
