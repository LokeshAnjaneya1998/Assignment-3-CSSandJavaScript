// open a connection to the IndexedDB database
const request = window.indexedDB.open("wishlistbullsData", 1);
const inProcessrequest = window.indexedDB.open("inpricessbullsData", 1);
// create an object store to store job records
request.onerror = function(event) {
    console.log("Error opening JOBS database.");
  };
  
  request.onsuccess = function(event) {
    const db = event.target.result;
    console.log("Connected to the JOBS database.");
  };
  
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('jobs', { keyPath: 'id', autoIncrement: true });
  console.log("Started in JOBS database.");
};

inProcessrequest.onerror = function(event) {
  console.log("Error opening IN PROCESS database.");
};

inProcessrequest.onsuccess = function(event) {
  const db = event.target.result;
  console.log("Connected to the IN PROCESS database.");
};

inProcessrequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('inprocessjobs', { keyPath: 'id', autoIncrement: true });
  console.log("Started in IN PROCESS database.");
};


// add a new job record to the database and display it in the table
document.getElementById('addJobButton').addEventListener('click', (event) => {
  event.preventDefault();
  
  const Companyname  = document.getElementById('wishlistCompanyName').value;
  const jobRole = document.getElementById('wishlistJobRole').value;
  const jobType  = document.getElementById('wishlistJobType').value;
  const appliedDate = document.getElementById('wishlistAppliedDate').value;
  const location  = document.getElementById('wishlistLocation').value;
  const salary = document.getElementById('wishlistSalary').value;

  if (Companyname && jobRole && jobType && appliedDate && location && salary) {
    const transaction = request.result.transaction('jobs', 'readwrite');
    const store = transaction.objectStore('jobs');

    const job = { Companyname, jobRole, jobType, appliedDate, location, salary };

    const addRequest = store.add(job);

    addRequest.onsuccess = () => {
      
      window.location.reload();
    };

    addRequest.onerror = (event) => {
      console.error('Error adding job to database', event.target.error);
    };
  }
});

// delete a job record from the database and the table
// add event listener to "delete" button
document.getElementById('wishlistDataTableBody').addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-button')) {
    const db = request.result;
    const transaction = db.transaction('jobs', 'readwrite');
    const store = transaction.objectStore('jobs');

    const id = Number(event.target.getAttribute('data-id'));

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => {
      event.target.parentNode.parentNode.remove();
      console.log("Deleted Successfully");
    };

    deleteRequest.onerror = (event) => { // fix: use deleteRequest.onerror instead of request.onerror
      console.error('Error deleting job from database', event.target.error);
    };
  }
});

// add event listener to "inprocess" button
document.getElementById('wishlistDataTableBody').addEventListener('click', (event) => {
  if (event.target.classList.contains('inProcess-button')) {
    const db = request.result;
    const jobtransaction = db.transaction('jobs', 'readwrite'); // fix: use db.transaction instead of request.result.transaction
    const jobStore = jobtransaction.objectStore('jobs');
    const jobId = Number(event.target.getAttribute('data-id')); 
     // fix: use Number() to convert data-id to a number

    const getRequest = jobStore.get(jobId); // fix: use jobStore.get to get the job with the given ID
    getRequest.onsuccess = (event) => {
      const inprocessjob = event.target.result;

      const inProcesstransaction = inProcessrequest.result.transaction('inprocessjobs', 'readwrite'); // fix: use db.transaction instead of inProcessrequest.result.transaction
      const inProcessStore = inProcesstransaction.objectStore('inprocessjobs');

      const moveRequest = inProcessStore.add(inprocessjob);

      moveRequest.onsuccess = () => {
        console.log('Success adding inprocessjob to database');
      };

      moveRequest.onerror = (event) => {
        console.error('Error adding job to database', event.target.error);
      };
    
    }
    const deleteRequest = jobStore.delete(jobId);
    deleteRequest.onsuccess = () => {
      event.target.parentNode.parentNode.remove();
      console.log("Deleted Successfully");
    };

    deleteRequest.onerror = (event) => { // fix: use deleteRequest.onerror instead of request.onerror
      console.error('Error deleting job from database', event.target.error);
    };
  }
});



// load the existing jobs from the database and display them in the table
request.onsuccess = () => {
    const transaction = request.result.transaction('jobs', 'readonly');
    const store = transaction.objectStore('jobs');
    const getAllRequest = store.getAll();
  
    getAllRequest.onsuccess = () => {
      const jobs = getAllRequest.result;
      const tbody = document.getElementById('wishlistDataTableBody');
  
      for (const job of jobs) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${job.Companyname}</td>
          <td>${job.jobRole}</td>
          <td>${job.jobType}</td>
          <td>${job.appliedDate}</td>
          <td>${job.location}</td>
          <td>${job.salary}</td>
          <td><button class="inProcess-button" id="inProcess-button" data-id="${job.id}">In Process</button></td>
          <td><button href="#" title="Edit" class="edit-button" id="edit-button" >&#9998;</button></td>
          <td><button href="#" title="Delete" class="delete-button" id="delete-button" data-id="${job.id}">&#128465;</button></td>
        `;
        tbody.appendChild(tr);
      }
    };
  
    getAllRequest.onerror = (event) => {
      console.error('Error getting jobs from database', event.target.error);
    };
  };
