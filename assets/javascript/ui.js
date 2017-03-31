/*
X: To do: Improve ajax error handling / find out about current errors
X: To do: Make arrow key navigation format consistent with hover
X: To do: Enter key should behave the same as click
X: To do: On submit, if there is no data-symbol attribute, then search markitondemand api for one before submitting to quandl api
	Above: resolved by removing the search button entirely
To do: Divide between left and right searches
To do: Prevent -1 from pointing to the end of the list
To do: Get the dates
*/

var config = {
	apiKey: "AIzaSyA1ot93Xhw0Iemmof8EeVvGFcDCFaNf4bs",
	authDomain: "stock-compare.firebaseapp.com",
	databaseURL: "https://stock-compare.firebaseio.com",
	storageBucket: "stock-compare.appspot.com",
	messagingSenderId: "384877267053"
};

firebase.initializeApp(config);
var database = firebase.database();

// Declare variables
var leftWaitingInterval;
var rightWaitingInterval;
var ajaxInterval;
var ajaxRequests = [];
var counter = 0;
var lIndex = -1;
var arr = [];
var field;
var name;
var symbol;
var exchange;
var tickerOne;
var tickerTwo;
var stockObjectOne = {};
var stockObjectTwo = {};

var submitStockOne = function(){  
	var stockNameOne = $("#left-search").val().trim(); 
	var startDateSelectedOne = $("#start-date").val().trim(); 
	var endDateSelectedOne = $("#end-date").val().trim(); 
	
	console.log(startDateSelectedOne);
	console.log(endDateSelectedOne);

	stockObjectOne = { // saves all of those into an object
		stockName: stockNameOne,
		tickerOne: tickerOne,
		startDateSelected: startDateSelectedOne,
		endDateSelected: endDateSelectedOne
	}

  database.ref().push(stockObjectOne).then(function(snapshot){
		localStorage.setItem("user_key_one", snapshot.key); // saves that data in the database.
	});
	
	displayStockOne();
}

var submitStockTwo = function(){
	var stockNameTwo = $("#right-search").val().trim();
	var startDateSelectedTwo = $("#start-date").val().trim();
	var endDateSelectedTwo = $("#end-date").val().trim();

	stockObjectTwo = {
		stockName: stockNameTwo,
		tickerTwo: tickerTwo,
		startDateSelected: startDateSelectedTwo,
		endDateSelected: endDateSelectedTwo
	}

	database.ref().push(stockObjectTwo).then(function(snapshot){
		localStorage.setItem("user_key_two", snapshot.key);
	});

	displayStockTwo();
};



function resetForm(column) {
	setTimeout(function(){
		// Stop the waiting animation interval
		clearInterval(leftWaitingInterval);
		clearInterval(rightWaitingInterval);
		// Reset the text of the search button
		$('#' + column + '-button').val('search');
		// Clear the typeahead results
		$('#' + column + '-type-result').html('');
		
		console.log('submitted');
	}, 20)
	
}

// On left orm submit, do this
$('#left-input-form').submit(function(event) {
	// Prevent default submit behavior
	event.preventDefault();
	// !! Get the dates
// 	stockObjectOne.startDateSelected = $('#start-date').val();
// 	stockObjectOne.endDateSelected = $('#end-date').val();
	// Submit the left form
	resetForm('left');
	submitStockOne();
});

$('#right-input-form').submit(function(event) {
	console.log('submit', tickerTwo);
	// Prevent default submit behavior
	event.preventDefault();
	// !! Get the dates
// 	stockObjectOne.startDateSelected = $('#start-date').val();
// 	stockObjectOne.endDateSelected = $('#end-date').val();
	// Submit the right form
	resetForm('right');
	submitStockTwo();
});

// Create a new click handler for the dropdown typeahead results
function setResultClickHandler() {
	// On reult click, do this
	$('.' + column + '-result-li').mousedown(function(){
		console.log('click');
		// Get stock company name from the data-name attribute of the result clicked and populate the search field with it
		field.val($(this).data('name'));
		// Set the #left-search data-symbol attribute as the result's data-symbol attribute
		if (column === 'left') {
			tickerOne = $(this).data('symbol');
			console.log(tickerOne);
			// Submit the form
			$('#left-input-form').submit();
		} else {
			tickerTwo = $(this).data(symbol);
			// Submit the form
			$('#right-input-form').submit();
		}
		
	})
}

// Type-ahead functionality (ajax success callback function)
function typeAhead(response) {
	// save the response in the parent scope
	arr = response;
	// Reset result list index to -1 (nothing selected)
	lIndex = -1;
	// Stop the waiting animation 
	clearInterval(leftWaitingInterval);
	clearInterval(rightWaitingInterval);
	// Reset the text in search button
	$('#' + column + '-button').val('search');
	// Clear previous typeahead results
	$('#' + column + '-type-result').html('');
	// !! Make sure this if statement useful
	// If there is something in the response array
	if (arr !== null) {
		// For each result in response array
		arr.forEach(function(value, index) {
			// Truncate the displayed name if it is longer than 21 character
			if (value.Name.length < 22) {
				name = value.Name;
			} else {
				name = value.Name.slice(0, 20) + '...';
			}
			
			exchange = value.Exchange;
			
			// Truncate the displayed symbol if it is longer than 5 characters
			if (value.Symbol.length < 6) {
				symbol = value.Symbol;
			} else {
				symbol = value.Symbol.slice(0, 4) + '...';
			}
			// Add it to the result dropdown list
			$('#' + column + '-type-result').append('<li class="' + column + '-result-li row" data-name="' + value.Name + '" data-symbol="' + value.Symbol + '"><span class="full-name">' + name + '</span><span class="exchange">'  + exchange + ': <span class="ticker">' + symbol + '</span></span></li>');
		})
		
		console.log('CLASS:', $('#left-type-result').attr('class'));
		// Set a click handler for the results
		setResultClickHandler();
	}
}


// Handle errors from the ajax request !! Needs improvement
function handleError(error) {
	console.log('error', error);
	clearInterval(leftWaitingInterval);
	clearInterval(rightWaitingInterval);
	$('#' + column + '-button').val('search');
}

// Highlight the result list item at a given index
function highlightFromList(index) {
	$('.' + column + '-result-li').css({ 'background':'#fff' });
	$('.' + column + '-result-li').eq(index).css({ 'background': '#eee'});
}

function submitAtIndex(index, column) {
	var stockListItem = $('.' + column + '-result-li').eq(index);
	field.val(stockListItem.data('name'));
	if (column === 'left') {
			tickerOne = stockListItem.data('symbol');
			// Submit the form
			$('#left-input-form').submit();
		} else {
			tickerTwo = stockListItem.data('symbol');
			$('#right-input-form').submit();
		}
}

function animateLeftWaiting() {
	// Stop the animation before adding a new interval (otherwise the animation would be running twice)
		clearInterval(leftWaitingInterval);
		// Run a waiting/loading animation
		leftWaitingInterval = setInterval(function(){
			// !! Make a better, prettier animation
			
		}, 100);
}

function animateRightWaiting() {
	// Stop the animation before adding a new interval (otherwise the animation would be running twice)
		clearInterval(rightWaitingInterval);
		// Run a waiting/loading animation
		rightWaitingInterval = setInterval(function(){
			// !! Make a better, prettier animation
			
		}, 100);
}

// Save jQuery search field object in 'field'
fieldClass = $('.search');

// On search field blur, do this
fieldClass.blur(function() {
	// Remove event handlers
	$('#left-search').off('keydown');
	$('#left-search').off('keyup');
	$('#right-search').off('keydown');
	$('#right-search').off('keyup');
	// Stop displaying the results
	$('#' + column + '-type-result').html('');
	// Reset list index;
	lIndex = -1;
});

fieldClass.focusin(function() {
	column = $(this).data('column');
	field = $('#' + column + '-search');
	// When a user types in the search field (key down), do this
	field.on('keydown', function(event) {
		// If the key is not an up or down arrow key
		if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Enter') {
			// Don't run the previously initiated ajax request
			clearInterval(ajaxInterval);
		// If the key is an up or down arrow key
		} else {
			// Prevent default arrow key behavior (moving the cursor)
			event.preventDefault();
			// If up key pressed and the Index to highlight is within range
			if (event.key === 'ArrowUp' && lIndex >= 0) {
				lIndex--;
			// If down key pressed and the Index to highlight is within range
			} else if (event.key === 'ArrowDown' && lIndex < arr.length) {
				lIndex++;
			} else if (event.key === 'Enter' && lIndex >= 0) {
				submitAtIndex(lIndex, column);
			}
			// Highlight the item in the list at the selected index
			highlightFromList(lIndex, column);
		}
	});

	// When the user types in the search field (key up), do this
	field.on('keyup', function(e) {
		// !! change this to be if the key is a letter or number
		// If the key is not an up or dow narrow
		if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 96 && event.keyCode <= 105) {
			// Add to the ajax request counter !! Should this be moved to the end of this function?
			counter++;
			// Abort any pending ajax request
			if (ajaxRequests[counter - 1] !== undefined) {
				ajaxRequests[counter - 1].abort();
			}

			if (column === 'left') {
				animateLeftWaiting();
			} else {
				animateRightWaiting();
			}

			// Save the user input to the search variable
			var search = field.val();
			// If the search is not empty 
			if (search.length > 0) {
				// Run the request stock info from MarkitOnDemand API
				ajaxInterval = setTimeout(function(){
					var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp';
					ajaxRequests[counter] = $.ajax({
						data: { 'input': search },
						url: url,
						dataType: 'jsonp',
						success: typeAhead,
						error: handleError,
						context: this
					})
				}, 700);
			// If the search is empty (if the user deleted their search term), do this
		} else {
				// Stop the animation
				clearInterval(leftWaitingInterval);
				clearInterval(rightWaitingInterval);
				// Stop any ajax requests that have not yet been sent
				clearInterval(ajaxInterval);
				// Stop any ajax requets that have already been sent
				if (ajaxRequests[counter] !== undefined) {
					ajaxRequests[counter].abort();
				}
				// Reset the button value
				$('#' + column + '-button').val('search');
				// Clear the results list
				$('#' + column + '-type-result').html('');
			}
		}
	});
});

