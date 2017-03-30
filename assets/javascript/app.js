var queryURL;
var globalStartDate = stockObjectOne.startDateSelectedOne;
var globalEndDate = stockObjectOne.endDateSelectedOne;
var tickerSymbolOne = tickerOne;
var tickerSymbolTwo = tickerTwo;

var queryURLOne = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbol + ".json?" + "column_index=1&start_date=" + globalStartDate + "&end_date=" + globalEndDate + "&api_key=JNYYRNrxvRMk1fGkoMUp"; //Sets up the Query URL to give us the date and the price on that date. 

var queryURLTwo = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbolTwo + ".json?" + "column_index=1&start_date=" + globalStartDate + "&end_date=" + globalEndDate + "&api_key=JNYYRNrxvRMk1fGkoMUp";


// var makeQueryURL = function() {

// }

var displayStockOne = function() {
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

var displayStockTwo = function() {
	$.ajax({
		url: queryURLTwo,
		method: "GET"
	}).done(function(response){
		var stockObjectTwo= {} // creates an object that will give FE the name, date array, starte date, end date
		var data = response.dataset;
		stockObjectTwo.name = data.name; //users dot notation to create the object.
		stockObjectTwo.dateArray = data.data;
		stockObjectTwo.startDate = startSender(data.data);
		stockObjectTwo.endDate = endSender(data.data);
		console.log(stockObjectTwo);
		
	})
}

displayStocks();

