
/*
To do: Enter key should behave the same as click
To do: On submit, if there is no data-symbol attribute, then search markitondemand api for one before submitting to quandl api
To do: Divide between left and right searches
To do: Make arrow key navigation format consistent with hover
To do: Prevent -1 from pointing to the end of the list
To do: Improve ajax error handling / find out about current errors
*/

$( document ).ready(function() {
	
	// Declare variables
	var waitingInterval;
	var ajaxInterval;
	var ajaxRequests = [];
	var counter = 0;
	var lIndex = -1;
	var arr = [];
	var field;
	
	// !! assign sybmol to this variable from dropdown & click, dropdown & enter, and submit search
	var symbolToSubmit;

	// On form submit, do this
	$('#left-input-form').submit(function(event) {
		// Clear the typeahead results
		$('#type-result').html('');
		console.log('submitted');
		// Stop the waiting animation interval
		clearInterval(waitingInterval);
		// Rest the text of the search button
		$('#left-button').val('search');
		// Prevent default submit behavior
		event.preventDefault();
	});
	
	// Create a new click handler for the dropdown typeahead results
	function setResultClickHandler() {
		// On reult click, do this
		$('.result-li').mousedown(function(){
			console.log('click');
			// Get stock company name from the data-name attribute of the result clicked and populate the search field with it
			field.val($(this).data('name'));
			// Set the #left-search data-symbol attribute as the result's data-symbol attribute
			$('#left-search').data('symbol', $(this).data('symbol'));
			// Submit the form
			$('#left-input-form').submit();
		})
	}

	// Type-ahead functionality (ajax success callback function)
	function typeAhead(response) {
		// save the response in the parent scope
		arr = response;
		// Reset result list index to -1 (nothing selected)
		lIndex = -1;
		// Stop the waiting animation 
		clearInterval(waitingInterval);
		// Reset the text in search button
		$('#left-button').val('search');
		// Clear previous typeahead results
		$('#type-result').html('');
		console.log('starts here', arr);
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
				// Truncate the displaye dsymbol if it is longer than 5 characters
				if (value.Symbol.length < 6) {
					symbol = value.Symbol;
				} else {
					symbol = value.Symbol.slice(0, 4) + '...';
				}
				// Add it to the result dropdown list
				$('#type-result').append('<li class="result-li" data-name="' + value.Name + '" data-symbol="' + value.Symbol + '"><span class="full-name">' + name + '</span><span class="ticker">' + symbol + '</span><br></li>');
			})
			// Set a click handler for the results
			setResultClickHandler();
		}
	}


	// Handle errors from the ajax request !! Needs improvement
	function handleError(error) {
		console.log('error', error);
		clearInterval(waitingInterval);
		$('#left-button').val('search');
	}

	// On search field blur, do this
	$('#left-search').blur(function() {
		// Stop displaying the results
		$('#type-result').html('');
	});



	// Save jQuery search field object in 'field'
	field = $('#left-search');
	
	// Highlight the result list item at a given index
	function highlightFromList(index) {
		console.log(index);
		$('.result-li').css({ 'background':'#311' });
		$('.result-li').eq(index).css({ 'background': '#422'});
	}
	

	// When a user types in the search field (key down), do this
	field.keydown(function(e) {
		console.log(e.key);
		// If the key is not an up or down arrow key
		if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
			// Don't run the previously initiated ajax request
			clearInterval(ajaxInterval);
		// If the key is an up or down arrow key
	} else {
			// Prevent default arrow key behavior (moving the cursor)
			e.preventDefault();
			// If up key pressed and the Index to highlight is within range
			if (e.key === 'ArrowUp' && lIndex >= 0) {
				lIndex--;
			// If down key pressed and the Index to highlight is within range
		} else if (e.key === 'ArrowDown' && lIndex < arr.length) {
			lIndex++;
		}
			// Highlight the item in the list at the selected index
			highlightFromList(lIndex);
			
		}
	});
	
	// !! Double check that focus is necessary
  // field.focus(function() {
		// When the user types in the search field (key up), do this
		field.keyup(function(e) {

			// !! change this to be if the key is a letter or number
			// If the key is not an up or dow narrow
			if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
				
				// Add to the ajax request counter !! Should this be moved to the end of this function?
				counter++;
				// Abort any pending ajax request
				if (ajaxRequests[counter - 1] !== undefined) {
					ajaxRequests[counter - 1].abort();
				}
				
				// Clear the results list
				$('#type-result').html('');
				// Stop the animation before adding a new interval (otherwise the animation would be running twice)
				clearInterval(waitingInterval)
				// Run a waiting/loading animation
				waitingInterval = setInterval(function(){
					// !! Make a better, prettier animation
					if ($('#left-button').val() !== '-') {
						$('#left-button').val('-');
					} else {
						$('#left-button').val(' ');
					}
				}, 100);
				
				// Save the user input to the search variable
				var search = field.val();
				console.log('search', search);
				console.log('counter', counter);
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
					}, 500 )
				// If the search is empty (if the user deleted their search term), do this
			} else {
					// Stop the animation
					clearInterval(waitingInterval);
					// Stop any ajax requests that have not yet been sent
					clearInterval(ajaxInterval);
					// Stop any ajax requets that have already been sent
					if (ajaxRequests[counter] !== undefined) {
						ajaxRequests[counter].abort();
					}
					// Reset the button value
					$('#left-button').val('search');
					// Clear the results list
					$('#type-result').html('');
				}
			}
		});
  // });


});
