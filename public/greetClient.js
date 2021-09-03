document.addEventListener('DOMContentLoaded', function () {
    let errorMessageElem = document.querySelector('.error');
    let infoElem = document.querySelector('.info')
    if (errorMessageElem.innerHTML !== '' || infoElem) {
        setTimeout(() => {
            errorMessageElem.innerHTML = '';
            infoElem.innerHTML = '';
            
        }, 3000);
    }

});

