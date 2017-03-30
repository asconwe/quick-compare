var config = {
    apiKey: "AIzaSyA1ot93Xhw0Iemmof8EeVvGFcDCFaNf4bs",
    authDomain: "stock-compare.firebaseapp.com",
    databaseURL: "https://stock-compare.firebaseio.com",
    storageBucket: "stock-compare.appspot.com",
    messagingSenderId: "384877267053"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  var stockObjectOne;
  var stockObjectTwo;

// Required date format YYYY-MM-DD

// Call this function
function displayResults() {

};


$("#left-button").on("click", function(){  // grabs the values from the left form. 
	var stockNameOne = $("#left-search").val().trim(); 
	var startDateSelectedOne = $("#start-date").val().trim(); 
	var endDateSelectedOne = $("#end-date").val().trim(); 

	    stockObjectOne = { // saves all of those into an object
		stockName: stockNameOne,
		startDateSelected: startDateSelectedOne,
		endDateSelected: endDateSelectedOne
	}

	database.ref().push(stockObjectOne).then(function(snapshot){
		localStorage.setItem("user_key_one", snapshot.key); // saves that data in the database.
	});

});

$("#right-button").on("click", function(){
	var stockNameTwo = $("#right-search").val().trim();
	var startDateSelectedTwo = $("#start-date").val().trim();
	var endDateSelectedTwo = $("#end-date").val().trim();

	 	stockObjectTwo = {
		stockName: stockNameTwo,
		startDateSelected: startDateSelectedTwo,
		endDateSelected: endDateSelectedTwo
	}

	database.ref().push(stockObjectTwo).then(function(snapshot){
		localStorage.setItem("user_key_two", snapshot.key);
	});

});