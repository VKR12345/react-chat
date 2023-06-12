const commonPasswords = require('utils/10m most common.json')
function generation() {
  const length = 20;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+`|}{[]\:;?><,./-=';
  let password = '';

  while (true) {
    password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random()*characters.length);
      const randomChar = characters.charAt(randomIndex);
      password += randomChar;
    }

    if (!commonPasswords.includes(password) &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*()_+~`|}{[\]:;?><,.\/-=]/.test(password)) {
      break;
    }
  }

  return password;
}


export function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }