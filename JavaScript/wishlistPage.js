// open a connection to the IndexedDB database
const request = window.indexedDB.open("bullsData.json", 1);
// create an object store to store job records
request.onerror = function(event) {
    console.log("Error opening IndexedDB database.");
  };
  
  request.onsuccess = function(event) {
    const db = event.target.result;
    console.log("Connected to the IndexedDB database.");
  };
  
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('jobs', { keyPath: 'id', autoIncrement: true });
  console.log("Started in IndexedDB database.");
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
      const tbody = document.getElementById('wishlistDataTableBody');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${job.Companyname}</td>
        <td>${job.jobRole}</td>
        <td>${job.jobType}</td>
        <td>${job.appliedDate}</td>
        <td>${job.location}</td>
        <td>${job.salary}</td>
        <td><button>In Process</button></td>
        <td><button>Archive</button></td>
        <td><button class="delete-button" id="delete-button" data-id="${request.result}">Delete</button></td>
      `;
      tbody.appendChild(tr);
    };

    addRequest.onerror = (event) => {
      console.error('Error adding job to database', event.target.error);
    };
  }
});

// delete a job record from the database and the table
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

    request.onerror = (event) => {
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
          <td><button>In Process</button></td>
          <td><button>Archive</button></td>
          <td><button class="delete-button" id="delete-button" data-id="${job.id}">Delete</button></td>
        `;
        tbody.appendChild(tr);
      }
    };
  
    getAllRequest.onerror = (event) => {
      console.error('Error getting jobs from database', event.target.error);
    };
  };
