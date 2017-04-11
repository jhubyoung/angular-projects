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
		  //console.log("service: getBooks");
		  //console.log("service: service.srvReadBooks: ",service.srvReadBooks);
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
		  //console.log("service: addBook");
		  //console.log("service: service.srvReadBooks: ",service.srvReadBooks);
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
		  //console.log("service: deleteBook");
		  //console.log("service: service.srvReadBooks: ",service.srvReadBooks);
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
		  var tempItems=service.getReadBooks();
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
      console.log("ctrl, bookList.books: ",bookList.books);
      bookList.books = response.data;
    });

    bookList.saveNewBookTitle = function(){
      var promise = BookListService.addBook(bookList.newBookTitle);
      bookList.newBookTitle = "";
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
    bookList.readBook = function(id){
      var promise = BookListService.readBook(id);
      promise.then(function(response){
        bookList.books = response.data;
        //console.log("ctrl, book read, bookList.books: ",bookList.books);
      });
    }
  }

	ReadBooksController.$inject = ['BookListService','$scope','$rootScope'];
  function ReadBooksController(BookListService,$scope,$rootScope){
		var readBooks = this;
		readBooks.sortType = 'date';
		var promise = BookListService.getReadBooks();
		promise.then(function(response){
			readBooks.books = response.data;
			//console.log("ctrl, readBooks.books: ",readBooks.books);
			console.log("ctrl, BookListService.srvReadBooks: ",BookListService.srvReadBooks);
		});

		readBooks.deleteBook = function(id){
			console.log("book to be deleted, id: ",id);
			var promise = BookListService.deleteBook(id);
			promise.then(function(response){
				console.log("ctrl (read): book deleted");
        console.log("ctrl (read): read books list: ",BookListService.getReadBooks());
				//readBooks.books = response.data;
			});
		};


		(function () {
			$scope.$watch(function(){
				return BookListService.srvReadBooks;
			}, function (newVal, oldVal) {
				console.log("ctrl:watch");
					if ( newVal !== oldVal ) {
						console.log("ctrl:watch. oldVal: ",oldVal," newVal: ",newVal);
						readBooks.books=BookListService.srvReadBooks;
               }
            });
      }());


  }

})();
