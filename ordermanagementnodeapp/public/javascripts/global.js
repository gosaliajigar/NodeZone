
// Orderlist data array for filling in info box
var orderListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // OrderNo link click
    $('#orderList table tbody').on('click', 'td a.linkshoworder', showOrderInfo);

    // Add Order button click
    $('#btnAddOrder').on('click', addOrder);

    // Delete Order link click
    $('#orderList table tbody').on('click', 'td a.linkdeleteorder', deleteOrder);

    // Populate the user table on initial page load
    populateTable();
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/orders/orderlist', function( data ) {

    // Stick our user data array into a userlist variable in the global object
    orderListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshoworder" rel="' + this.orderno + '">' + this.orderno + '</a></td>';
            tableContent += '<td>' + this.status + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteorder" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#orderList table tbody').html(tableContent);
    });
};

// Show Order Info
function showOrderInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve orderNo from link rel attribute
    var thisOrderNo = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = orderListData.map(function(arrayItem) { return arrayItem.orderno; }).indexOf(thisOrderNo);

    // Get our Order Object
    var thisOrderObject = orderListData[arrayPosition];

    //Populate Info Box
    $('#orderNo').text(thisOrderObject.orderno);
    $('#orderFirstName').text(thisOrderObject.fname);
    $('#orderLastName').text(thisOrderObject.lname);
    $('#orderCompany').text(thisOrderObject.company);
    $('#orderEmail').text(thisOrderObject.email);
    $('#orderPhone').text(thisOrderObject.phone);
    $('#orderAddress').text(thisOrderObject.address);
    $('#orderDetails').text(thisOrderObject.details);
    $('#orderStatus').text(thisOrderObject.status);
};

// Add Order
function addOrder(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addOrder input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newOrder = {
            'orderno': $('#addOrder fieldset input#inputOrderNo').val(),
            'fname': $('#addOrder fieldset input#inputOrderFirstName').val(),
            'lname': $('#addOrder fieldset input#inputOrderLastName').val(),
            'company': $('#addOrder fieldset input#inputOrderCompany').val(),
            'email': $('#addOrder fieldset input#inputOrderEmail').val(),
            'phone': $('#addOrder fieldset input#inputOrderPhone').val(),
            'address': $('#addOrder fieldset input#inputOrderAddress').val(),
            'details': $('#addOrder fieldset input#inputOrderDetails').val(),
            'status': $('#addOrder fieldset input#inputOrderStatus').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newOrder,
            url: '/orders/addorder',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addOrder fieldset input').val('');

                // Update the table
                populateTable();

            } else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    } else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Order
function deleteOrder(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this order?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/orders/deleteorder/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    } else {

        // If they said no to the confirm, do nothing
        return false;
    }
};
