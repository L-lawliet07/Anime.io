
const login = (email, password) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/user/login', true);
    xhr.onload = function () {
        const responseObject = JSON.parse(this.responseText);
        console.log(typeof responseObject);
        if (responseObject.status === 'success') {
            window.location.assign('/crew');
        } else {
            alert('Invalid Username and Password');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ email, password }));
}


const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});