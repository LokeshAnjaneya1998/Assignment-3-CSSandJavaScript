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



document.getElementById('loginButton').addEventListener('click', (event) => {
    event.preventDefault();
  
    const loginusername = document.getElementById('username').value.trim();
    const loginpassword = document.getElementById('password').value.trim();
    if(loginusername == ""){alert('Please Enter your User Name');}
    else if(loginpassword == ""){alert('Please your password!!');}
    
    if (loginusername && loginpassword) {
        const transaction = signuprequest.result.transaction('signupids', 'readonly');
        const store = transaction.objectStore('signupids');
        const getAllRequest = store.getAll();

  getAllRequest.onsuccess = () => {
    let verification = "Fail";
    const jobs = getAllRequest.result;
    for (const job of jobs) {
        if (job.username == loginusername && job.password == loginpassword){
            console.log(job.id);
            verification = "Pass";
           window.location.href = "./pages/wishList.html";
          
        }

    }
    console.log(verification)
    if (verification == "Fail"){
        alert('Username or Password is wrong!! Please try again.');
    }

};
    }
  });