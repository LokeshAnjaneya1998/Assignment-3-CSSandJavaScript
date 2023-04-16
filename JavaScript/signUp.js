const signuprequest = window.indexedDB.open("signupbullsData", 1);
// create an object store to store job records
signuprequest.onerror = function (event) {
  console.log("Error opening signup database.");
};

signuprequest.onsuccess = function (event) {
  const db = event.target.result;
  console.log("Connected to the signup database.");
};

signuprequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('signupids', { keyPath: 'id', autoIncrement: true });
  console.log("Started in signup database.");
};


document.getElementById('signupbutton').addEventListener('click', (event) => {
    event.preventDefault();
  
    const firstname = document.getElementById('signinFirstName').value.trim();
    const lastname = document.getElementById('signinLastName').value.trim();
    const school = document.getElementById('signinSchool').value.trim();
    const city = document.getElementById('signinCity').value.trim();
    const state = document.getElementById('signinState').value.trim();
    const email = document.getElementById('signinEmail').value.trim();
    const username = document.getElementById('signinUserName').value.trim();
    const password = document.getElementById('signinPassword').value.trim();

    if(firstname == ""){alert('Please Enter your First Name');}
    else if(lastname == ""){alert('Please Enter your Last Name');}
    else if(school == ""){alert('Please Enter your School Name');}
    else if(city == ""){alert('Please Enter your City Name');}
    else if(state == ""){alert('Please Enter your State Name');}
    else if(email == ""){alert('Please Enter your Email id');}
    else if(username == ""){alert('Please Enter your User Name');}
    else if(password == ""){alert('Please Enter your Password');}
    
    if (firstname && lastname && school && city && state && email && username && password) {

    const transaction = signuprequest.result.transaction('signupids', 'readwrite');
    const store = transaction.objectStore('signupids');

    const inputdata = {firstname, lastname, school, city, state, email, username, password};

    const addRequest = store.add(inputdata);

    addRequest.onsuccess = () => {
      alert('SignUp successful!! Please login')
      window.location.href = "../index.html";
    };

    addRequest.onerror = (event) => {
      console.error('Error adding job to database', event.target.error);
    };
    }
});