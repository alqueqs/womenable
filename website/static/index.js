document.querySelector('.icon-menu').onclick = function (event) {
    document.querySelector('.icon-menu').classList.toggle('active');
    document.querySelector('.menu__body').classList.toggle('active');
    document.querySelector('body').classList.toggle('lock');
};

"use strict"

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);

        if (error === 0) {
            form.submit();
        }
    }

    /**
     * It checks if the input is required, if it's an email, if it's a checkbox, and if it's empty. If
     * it's empty, it adds an error class to the input.
     * @param form - the form you want to validate
     * @returns The number of errors.
     */
    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute("type") === 'checkbox' && input.checked === false) {
                formAddError(input);
                error++;
            } else if (input.classList.contains('_confirm')) {
                if (passwordTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }

    /**
     * It adds the class "_error" to the parent element of the input and the input itself.
     * @param input - The input element that you want to add the error class to.
     */
    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }

    /**
     * It removes the error class from the parent element and the input element.
     * @param input - The input element that you want to remove the error from.
     */
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    /**
     * If the input value does not match the regular expression, return true
     * @param input - The input element that is being tested.
     * @returns A boolean value.
     */
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    function passwordTest(input) {
        password = document.querySelector('._password');

        if (password.value != input.value) {
            return true
        } else {
            return false
        }
    }
});

/**
 * It sends a POST request to the server with the noteId of the note to be deleted
 * @param noteId - The id of the note to delete.
 */
function deleteNote(noteId) {
    fetch('/delete-note', {
        method: 'POST',
        body: JSON.stringify({ noteId: noteId })
    }).then((_res) => {
        window.location.href = '/home';
    })
}

let camera_button = document.querySelector('#webcam-start');
let video = document.querySelector('#webcam');
let click_button = document.querySelector('#webcam-btn');
let canvas = document.querySelector('#canvas');
let image_data_url

camera_button.addEventListener('click', async function() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: {
        width: { ideal: 275 }, 
        height: { ideal: 140 }
    }, audio: false });
    video.srcObject = stream;
    canvas.classList.remove('active');
});

click_button.addEventListener('click', function() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    image_data_url = canvas.toDataURL('image/jpg');
    canvas.classList.add('active');
});


function uploadImage() {
    document.querySelector('#url').textContent = image_data_url;
}

document.querySelector('.form__button').onclick = function() {
    document.querySelector('.sign-up__form').classList.add('active');
    this.style.display = 'none';
};

let form = document.querySelector('.sign-up__form');

form.addEventListener('keydown', function(event) {
    if(event.keyCode == 13) {
       event.preventDefault();
    }
 });