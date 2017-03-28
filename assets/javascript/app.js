var queryURL;
var globalStartDate = "2014-01-01";
var globalEndDate = "2014-01-10";
var tickerSymbol = "fb";

var queryURL = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbol + ".json?" + "column_index=1&start_date=" + globalStartDate + "&end_date=" + globalEndDate + "&api_key=JNYYRNrxvRMk1fGkoMUp"; //Sets up the Query URL to give us the date and the price on that date. 


// var makeQueryURL = function() {

// }

var displayStocks = function() {
	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response){
		var stockObjectOne= {} // creates an object that will give FE the name, date array, starte date, end date
		var data = response.dataset;
		stockObjectOne.name = data.name; //users dot notation to create the object.
		stockObjectOne.dateArray = data.data;
		stockObjectOne.startDate = startSender(data.data);
		stockObjectOne.endDate = endSender(data.data);
		console.log(stockObjectOne);
		
	})
}

var startSender = function(arr) { // cute little function that grab the last item in an array and returns it.
	var startDate = arr[arr.length - 1];
	return startDate;
}

var endSender = function(arr) { // cute little function that grabs the first item in an array an returns it. 
	var endDate = arr[0];
	return endDate;
}

displayStocks();

