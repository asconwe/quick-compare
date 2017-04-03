var makeQueryURLOne = function() {
	var startDate = stockObjectOne.startDateSelected;
	var endDate = stockObjectOne.endDateSelected;
	var tickerSymbolOne = stockObjectOne.tickerOne;
	var queryURLOne = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbolOne + ".json?" + "column_index=1&start_date=" + startDate + "&end_date=" + endDate + "&api_key=JNYYRNrxvRMk1fGkoMUp";
	return queryURLOne; 

 }

var makeQueryURLTwo = function() {
	var tickerSymbolTwo = stockObjectTwo.tickerTwo;
	var startDate = stockObjectTwo.startDateSelected;
	var endDate = stockObjectTwo.endDateSelected;
	var queryURLTwo = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbolTwo + ".json?" + "column_index=1&start_date=" + startDate + "&end_date=" + endDate + "&api_key=JNYYRNrxvRMk1fGkoMUp";
	return queryURLTwo;
}

var startSender = function(arr) { // cute little function that grab the last item in an array and returns it.
	var startDate = arr[arr.length - 1];
	return startDate;
}

var endSender = function(arr) { // cute little function that grabs the first item in an array an returns it. 
	var endDate = arr[0];
	return endDate;
}

var displayStockOne = function() {
	console.log(makeQueryURLOne());
	$.ajax({
		url: makeQueryURLOne(),
		method: "GET"
	}).done(function(response){
		var stockResultOne= {} // creates an object that will give FE the name, date array, starte date, end date
		var data = response.dataset;
		stockResultOne.name = stockNameOne; //user dot notation to create the object.
		stockResultOne.ticker = tickerOne;
		stockResultOne.dateArray = data.data;
		stockResultOne.startDate = startSender(data.data);
		stockResultOne.endDate = endSender(data.data);
		displayResult(stockResultOne, "left");
		
	})
}


var displayStockTwo = function() {
	console.log(makeQueryURLTwo());
	$.ajax({
		url: makeQueryURLTwo(),
		method: "GET"
	}).done(function(response){
		var stockResultTwo= {} // creates an object that will give FE the name, date array, starte date, end date
		var data = response.dataset;
		stockResultTwo.name = stockNameTwo //users dot notation to create the object.
		stockResultTwo.ticker = tickerTwo;
		stockResultTwo.dateArray = data.data;
		stockResultTwo.startDate = startSender(data.data);
		stockResultTwo.endDate = endSender(data.data);
		displayResult(stockResultTwo, "right");
	})
}

// Called at .done of Quandl API AJAX request
// Display the stock object in the specified column
function displayResult(stockObject, column) {
	console.log(stockObject, column);
	var panelTicker = $('#' + column + '-stock-ticker');
	var panelName = $('#' + column + '-stock-name');
	var panelValues = $('#' + column + '-stock-values');
	var ticker = stockObject.ticker;
	var name = stockObject.name;
	var valueArray = stockObject.dateArray;
	// if (name.length > 20) {
	// 	name = name.slice(0, 18) + '...';
	// } 

	panelTicker.html(ticker);
	panelName.html(name)
	valueArray.forEach(function(value){
		console.log(value);
		panelValues.append('<li class="row"><span class="liDate">' + value[0] + '</span><span class="liValue">$' + value[1] + '</span></li>')
	});
}


