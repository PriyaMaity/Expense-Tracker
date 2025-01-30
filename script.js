const loginForm = document.querySelector('form');
const errorMssg = document.getElementById('loginError'); 

loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); 

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  errorMssg.textContent = ''; 

 
  const storedEmail = localStorage.getItem('userEmail');
  const storedPassword = localStorage.getItem('userPassword');

  console.log('Stored Email:', storedEmail);  
  console.log('Stored Password:', storedPassword);  

  if(email === '' || password === ''){
    alert("Please fill the field.");
    return;
  }

  if (email === storedEmail && password === storedPassword) {
    alert("Login successful! Redirecting to home page...");
    window.location.href = "./HomePage/index.html";  
  } else {
    errorMssg.textContent = "Invalid email or password!";
    errorMssg.style.color = "red"; 
  }

});
