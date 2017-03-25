// Required date format YYYY-MM-DD
{
	abbr: "fb",
	priceAtStart: "$5.32"
	priceAtEnd: "$6.15"
	startDate: "2017-01-13"
	endDate: "2017-03-25"
}

function initializeComparisonDisplay() {
	var fullDisplay = $("full-display");

	var comparisonLeft = $('<div id="comparison-left">');
	var comparisonRight = $('<div id="comparison-right>');

	fullDisplay.html();
	fullDisplay.append(comparisonLeft);
	fullDisplay.append(comparisonRight);
}

// Call this function
function displayResult(result, displayId) {
	// display results in to the fullDisplay div
	// 	grab the div
	// Format some html
	// Make a stock abbreviation header
	var stockAbbr = $('<h2 id="abbr">');
	stockAbbr.html(result.abbr);
	
	var priceAtStart = $('<h3 id="price1">');
	priceAtStart.html(result.priceAtStart);

	var priceAtEnd = $('<h3 id="price2">');
	priceAtEnd.html(result.priceAtEnd);

	var startDate = $('<h3 id="start-date">');
	startDate.html(result.startDate);

	var endDate = $('<h3 id="end-date">');
	endDate.html(result.endDate);



	// Add to the DOM
 	$(displayId).html();
 	$(displayId).append(stockAbbr);
 	$(displayId).append(priceAtStart);
 	$(displayId).append(priceAtEnd);
  
};


initializeComparisonDisplay();
displayResult(resultObject, '#comparison-left');
displayResult(resultObject, '#comparison-right');
