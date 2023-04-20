const signuprequest = window.indexedDB.open("signupbullsData", 1);
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



signuprequest.onsuccess = () => {
    const transaction = signuprequest.result.transaction('signupids', 'readonly');
    const store = transaction.objectStore('signupids');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        const jobs = getAllRequest.result.reverse();
        const thead = document.getElementById('profileDataTableBody');
        for (const job of jobs) {
            var storedValue = localStorage.getItem('usernameVerify');
            console.log('Stored Value:', storedValue);
            const tbody = document.createElement('tbody');
            if(storedValue == job.username){
            tbody.innerHTML = `
        <tr><td></td><td></td></tr>
        <tr><td> Name:</td>
        <td>${job.firstname + " " + job.lastname} </td></tr>
        <tr> <td> School:</td>
        <td>${job.school}</tr> </td></tr>
        <tr> <td> City:</td>
        <td> ${job.city}</tr></td></tr>
        <tr><td>State:</td>
        <td>${job.state}</tr></td></tr>
        <tr><td> Email: </td>
        <td>${job.email}</tr></td></tr>
        <tr><td>UserName:</td>
        <td>${job.username}</tr></td></tr>
        <tr><td>Password:</td>
        <td>${job.password}</tr></td></tr>
        `;

            }
            thead.appendChild(tbody);
        
        }
    };
    getAllRequest.onerror = (event) => {
        console.error('Error getting jobs from database', event.target.error);
    };
};

function preventBack() {
    window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload = function () { null };
