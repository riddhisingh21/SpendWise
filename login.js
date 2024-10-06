document.addEventListener('DOMContentLoaded', function () {
    const captchaQuestion = document.getElementById('question');
    const captchaAnswer = document.getElementById('answer');
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');

    let captchaValue;

    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        captchaValue = num1 + num2;
        captchaQuestion.textContent = `What is ${num1} + ${num2}?`;
    }

    generateCaptcha();

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (parseInt(captchaAnswer.value) !== captchaValue) {
            message.textContent = 'CAPTCHA answer is incorrect. Please try again.';
            generateCaptcha(); 
            captchaAnswer.value = ''; 
        } else {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'user' && password === 'pass') {
                window.location.href = 'index.html';
            } else {
                message.textContent = 'Invalid username or password';
            }
        }
    });
});
