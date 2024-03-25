// $('.button').click(function(){
//   var buttonId = $(this).attr('id');
//   $('#modal-container').removeAttr('class').addClass(buttonId);
//   $('body').addClass('modal-active');
// })

// $('#modal-container').click(function(){
//   $(this).addClass('out');
//   $('body').removeClass('modal-active');
// });


// Function to open the popup
function openPopup() {
    $('#modal-container').removeAttr('class').addClass("one");
    $('body').addClass('modal-active');

    // Set a timeout to close the popup after 15 seconds
    setTimeout(function() {
        closePopup();
    }, 5000);
}

// Function to close the popup
function closePopup() {
   $('#modal-container').addClass('out');
   $('body').removeClass('modal-active');
}

// Set a timeout to open the popup after 5 seconds
setTimeout(function() {
    openPopup();
}, 2000000);