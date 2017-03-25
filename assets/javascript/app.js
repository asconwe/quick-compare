var queryURL;
var globalStartDate = "2014-01-01";
var globalEndDate = "2014-01-10";
var tickerSymbol = "fb";

var queryURL = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbol + ".json?" + "column_index=1&start_date=" + globalStartDate + "&end_date=" + globalEndDate + "&api_key=JNYYRNrxvRMk1fGkoMUp";
console.log(queryURL);

// var makeQueryURL = function() {

// }

var displayStocks = function() {
	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(response){
		var stockObjectOne= {}
		var data = response.dataset;
		stockObjectOne.name = data.name;
		stockObjectOne.dateArray = data.data;
		stockObjectOne.startDate = startSender(data.data);
		stockObjectOne.endDate = endSender(data.data);
		console.log(stockObjectOne);
		
	})
}

var startSender = function(arr) {
	var startDate = arr[arr.length - 1];
	return startDate;
}

var endSender = function(arr) {
	var endDate = arr[0];
	return endDate;
}

displayStocks();

