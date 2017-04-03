var firstArr = [];
var secondArr = [];
var nameOne = ' ';
var nameTwo = ' ';
var minimum = 99999999;
// var maximum = 0;


var makeQueryURLOne = function() {

	var startDate = stockObjectOne.startDateSelected;
	var endDate = stockObjectOne.endDateSelected;
	var exchangeOne = stockObjectOne.exchange;
	var tickerSymbolOne = stockObjectOne.tickerOne;
	var queryURLOne = "https://www.quandl.com/api/v3/datasets/GOOG/" + exchangeOne + "_"+ tickerSymbolOne + ".json?" + "column_index=1&start_date=" + startDate + "&end_date=" + endDate + "&api_key=JNYYRNrxvRMk1fGkoMUp";
	return queryURLOne; 

}

var makeQueryURLTwo = function() {
	var startDate = stockObjectTwo.startDateSelected;
	var endDate = stockObjectTwo.endDateSelected;
	var tickerSymbolTwo = stockObjectTwo.tickerTwo;
	var exchangeTwo = stockObjectTwo.exchange;
	var queryURLTwo = "https://www.quandl.com/api/v3/datasets/GOOG/"+ exchangeTwo + "_" + tickerSymbolTwo + ".json?" + "column_index=1&start_date=" + startDate + "&end_date=" + endDate + "&api_key=JNYYRNrxvRMk1fGkoMUp";

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

function createChart(stock, column) {
	stock.dateArray.forEach(function(value, index){
		console.log(value[1]<minimum);
		if (value[1] < minimum) {
			minimum = value[1];
		}

		if (column === 'left') {
			firstArr[index] = {x: new Date(value[0]), y: value[1]};
			nameOne = stock.name;
		} else {
			secondArr[index] = {x: new Date(value[0]), y: value[1]};
			nameTwo = stock.name;
		}
	});
	var chart = new CanvasJS.Chart("chartContainer", {
		title: {
			text: 'Stock values over time',
			fontSize: 10
		},
		animationEnabled: true,
		axisX: {
			gridColor: "Silver",
			tickColor: "silver",
			valueFormatString: "DD/MMM"
		},
		toolTip: {
			shared: true
		},
		theme: "theme1",
		axisY: {
			gridColor: "Silver",
			tickColor: "silver",
			minimum: minimum
		},
		legend: {
			verticalAlign: "center",
			horizontalAlign: "right"
		},
		data: [
		{
			type: "line",
			showInLegend: true,
			lineThickness: 1,
			name: nameOne,
			markerType: "none",
			color: "#F08080",
			dataPoints: firstArr
		},
		{
			type: "line",
			showInLegend: true,
			name: nameTwo,
			markerType: 'none',
			color: "#20B2AA",
			lineThickness: 1,

			dataPoints: secondArr
		}
		],
		legend: {
			cursor: "pointer",
			itemclick: function (e) {
				if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				}
				else {
					e.dataSeries.visible = true;
				}
				chart.render();
			}
		}
	});

	chart.render();
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
	var panelExchange = $('#' + column + '-stock-exchange');
	var panelValues = $('#' + column + '-stock-values');
	var ticker = stockObject.ticker;
	var exchange = stockObject.exchange;
	var valueArray = stockObject.dateArray;

	createChart(stockObject, column);
	
	panelTicker.html(ticker);
	panelExchange.html(exchange);
	// valueArray.forEach(function(value){
	// 	console.log(value);
	// 	panelValues.append('<li class="row"><span class="liDate">' + value[0] + '</span><span class="liValue">$' + value[1] + '</span></li>')
	// });
}


