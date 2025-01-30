document.addEventListener('DOMContentLoaded', function () {
  const signUpForm  = document.querySelector('form'); 
  const errorMssg = document.getElementById('signupError');

  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const name = document.getElementById('fullName').value.trim();
    const phnNumber = document.getElementById('phnNum').value.trim(); 
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('signupConfirmPassword').value.trim();

    console.log(name, phnNumber, email, password, confirmPassword);
    errorMssg.textContent = '';

    if (password.length < 5) {
      errorMssg.textContent = 'Password must be at least 5 characters.';
      return;
    }

    if (password !== confirmPassword) {
      errorMssg.textContent = 'Passwords do not match!';
      return;
    }

    localStorage.setItem('fullName', name);
    localStorage.setItem('phnNum', phnNumber); 
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);

    console.log("Data saved to localStorage");
    alert('Signup successful! Redirecting to login page.');
    window.location.href = '../index.html';
  });
});

