import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

// https://github.com/apvarun/toastify-js/blob/master/README.md
export const toast = {
  info(message) {
    // duration 5s
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'left', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
      },
    }).showToast()
  },
  success(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'left', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'linear-gradient(to right, #CCFF66, #CCFF33)',
      },
    }).showToast()
  },
  error(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'left', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'linear-gradient(to right, #3399CC, #339999)',
      },
    }).showToast()
  },
}
