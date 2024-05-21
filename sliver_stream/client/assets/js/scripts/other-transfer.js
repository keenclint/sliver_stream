
document.getElementById('submit-form').addEventListener('submit', function(event) {

    event.preventDefault(); // Prevent the default form submission
    iziToast.error({
      title: 'Error',
      message: 'Transfer cannot be processed, please contact support ',
      position: 'topRight'
    })

})
