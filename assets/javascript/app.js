var makeQueryURLOne = function() {
	var startDate = stockObjectOne.startDateSelectedOne;
	var endDate = stockObjectOne.endDateSelectedOne;
	var tickerSymbolOne = stockObjectOne.tickerOne;
	var queryURLOne = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbolOne + ".json?" + "column_index=1&start_date=" + startDate + "&end_date=" + endDate + "&api_key=JNYYRNrxvRMk1fGkoMUp";
	return queryURLOne; 

 }

var makeQueryURLTwo = function() {
	var tickerSymbolTwo = stockObjectTwo.tickerTwo;
	var startDate = stockObjectOne.startDateSelectedOne;
	var endDate = stockObjectOne.endDateSelectedOne;
	var queryURLTwo = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbolTwo + ".json?" + "column_index=1&start_date=" + startDate + "&end_date=" + endDate + "&api_key=JNYYRNrxvRMk1fGkoMUp";
	return queryURLTwo;
}

var displayStockOne = function() {
	$.ajax({
		url: makeQueryURLOne(),
		method: "GET"
	}).done(function(response){
		var stockResultOne= {} // creates an object that will give FE the name, date array, starte date, end date
		var data = response.dataset;
		stockResultOne.name = data.name; //users dot notation to create the object.
		stockResultOne.dateArray = data.data;
		stockResultOne.startDate = startSender(data.data);
		stockResultOne.endDate = endSender(data.data);
		displayResult(stockResultTwo, "left");
		
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
		url: makeQueryURLTwo(),
		method: "GET"
	}).done(function(response){
		var stockResultTwo= {} // creates an object that will give FE the name, date array, starte date, end date
		var data = response.dataset;
		stockResultTwo.name = data.name; //users dot notation to create the object.
		stockResultTwo.dateArray = data.data;
		stockResultTwo.startDate = startSender(data.data);
		stockResultTwo.endDate = endSender(data.data);
		displayResult(stockResultTwo, "right");

		
	})
}

// displayStockOne();
// displayStockTwo();


