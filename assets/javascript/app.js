var firstArr = [];
var secondArr = [];
var nameOne = ' ';
var nameTwo = ' ';


var makeQueryURLOne = function(stockObjectOne) {

	var startDate = stockObjectOne.startDateSelected;
	var endDate = stockObjectOne.endDateSelected;
	var exchangeOne = stockObjectOne.exchange;
	var tickerSymbolOne = stockObjectOne.tickerOne;
	var queryURLOne = "https://www.quandl.com/api/v3/datasets/GOOG/" + exchangeOne + "_"+ tickerSymbolOne + ".json?" + "column_index=1&start_date=" + startDate + "&end_date=" + endDate + "&api_key=JNYYRNrxvRMk1fGkoMUp";
	return queryURLOne; 

}

var makeQueryURLTwo = function(stockObjectTwo) {
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
		},
		animationEnabled: true,
		axisX: {
			gridColor: "Silver",
			tickColor: "silver",
			valueFormatString: "MM/DD/YYYY",
			
		},
		toolTip: {
			shared: true,
			content: "{name} <br> {x}: ${y}"  
		},
		theme: "theme1",
		axisY: {
			gridColor: "Silver",
			tickColor: "silver",
			prefix: "$" 
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

var displayStockOne = function(stockObjectOne) {
	console.log(makeQueryURLOne(stockObjectOne));
	$.ajax({
		url: makeQueryURLOne(stockObjectOne),
		method: "GET"
	}).done(function(response){
		var stockResultOne= {} // creates an object that will give FE the name, date array, starte date, end date
		var data = response.dataset;
		stockResultOne.name = stockObjectOne.stockName; //user dot notation to create the object.
		stockResultOne.ticker = stockObjectOne.tickerOne;
		stockResultOne.exchange = stockObjectOne.exchange;
		stockResultOne.dateArray = data.data;
		stockResultOne.startDate = startSender(data.data);
		stockResultOne.endDate = endSender(data.data);
		displayResult(stockResultOne, "left");
		
	})
}


var displayStockTwo = function(stockObjectTwo) {
	console.log(makeQueryURLTwo(stockObjectTwo));
	$.ajax({
		url: makeQueryURLTwo(stockObjectTwo),
		method: "GET"
	}).done(function(response){
		var stockResultTwo= {} // creates an object that will give FE the name, date array, starte date, end date
		var data = response.dataset;
		stockResultTwo.name = stockObjectTwo.stockName //users dot notation to create the object.
		stockResultTwo.ticker = stockObjectTwo.tickerTwo;
		stockResultTwo.exchange = stockObjectTwo.exchange;
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


