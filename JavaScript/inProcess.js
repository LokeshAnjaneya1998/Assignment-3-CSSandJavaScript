const inProcessrequest = window.indexedDB.open("inpricessbullsData", 1);
const offersrequest = window.indexedDB.open("offersbullsData", 1);
const eventrequest = window.indexedDB.open("eventsbullsData", 1);
// create an object store to store job records

inProcessrequest.onerror = function (event) {
  console.log("Error opening IN PROCESS database.");
};

inProcessrequest.onsuccess = function (event) {
  const db = event.target.result;
  console.log("Connected to the IN PROCESS database.");
};

inProcessrequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('inprocessjobs', { keyPath: 'id', autoIncrement: true });
  console.log("Started in IN PROCESS database.");
};

offersrequest.onerror = function (event) {
  console.log("Error opening offers database.");
};

offersrequest.onsuccess = function (event) {
  const db = event.target.result;
  console.log("Connected to the offers database.");
};

offersrequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('offersjobs', { keyPath: 'id', autoIncrement: true });
  console.log("Started in offers database.");
};

eventrequest.onerror = function (event) {
  console.log("Error opening IN PROCESS database.");
};

eventrequest.onsuccess = function (event) {
  const db = event.target.result;
  console.log("Connected to the IN PROCESS database.");
};

eventrequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('eventjobs', { keyPath: 'id', autoIncrement: true });
  console.log("Started in IN PROCESS database.");
};


// delete a job record from the database and the table
document.getElementById('inProcessDataTableBody').addEventListener('click', (event) => {
  if (event.target.classList.contains('rejected-button')) {
    const db = inProcessrequest.result;
    const transaction = db.transaction('inprocessjobs', 'readwrite');
    const store = transaction.objectStore('inprocessjobs');

    const id = Number(event.target.getAttribute('data-id'));

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => {
      event.target.parentNode.parentNode.remove();
      console.log("Deleted Successfully");
    };

    inProcessrequest.onerror = (event) => {
      console.error('Error deleting job from database', event.target.error);
    };
  }
});

document.getElementById('inProcessDataTableBody').addEventListener('click', (event) => {

  if (event.target.classList.contains('offer-button')) {
    const db = inProcessrequest.result;
    const jobtransaction = db.transaction('inprocessjobs', 'readwrite'); // fix: use db.transaction instead of request.result.transaction
    const jobStore = jobtransaction.objectStore('inprocessjobs');
    // fix: use Number() to convert data-id to a number
    const jobId = Number(event.target.getAttribute('data-id'));
    const getRequest = jobStore.get(jobId); // fix: use jobStore.get to get the job with the given ID
    getRequest.onsuccess = (event) => {
      const offersjob = event.target.result;

      const offerstransaction = offersrequest.result.transaction('offersjobs', 'readwrite'); // fix: use db.transaction instead of inProcessrequest.result.transaction
      const offersStore = offerstransaction.objectStore('offersjobs');

      const moveRequest = offersStore.add(offersjob);

      moveRequest.onsuccess = () => {
        console.log('Success adding offersjob to database');
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

document.getElementById('inProcessDataTableBody').addEventListener('click', (event) => {

  if (event.target.classList.contains('events-button')) {
    alert("Job added to Events!!")
    const db = inProcessrequest.result;
    const jobtransaction = db.transaction('inprocessjobs', 'readwrite'); // fix: use db.transaction instead of request.result.transaction
    const jobStore = jobtransaction.objectStore('inprocessjobs');
    // fix: use Number() to convert data-id to a number
    const jobId = Number(event.target.getAttribute('data-id'));
    const getRequest = jobStore.get(jobId);
    
    getRequest.onsuccess = (event) => {
      const eventsjob = event.target.result;
      const eventscompanyname = eventsjob.Companyname;
      const eventsjobRole = eventsjob.jobRole;
      const eventType =  "";  
      const dueDate = "";
      const completeMark = "No";

      const eventstransaction = eventrequest.result.transaction('eventjobs', 'readwrite'); // fix: use db.transaction instead of inProcessrequest.result.transaction
      const eventsStore = eventstransaction.objectStore('eventjobs');

      const job = { eventscompanyname, eventsjobRole, eventType, dueDate, completeMark };

      const moveRequest = eventsStore.add(job);

      moveRequest.onsuccess = () => {
        console.log('Success adding eventsjob to database');
      };

      moveRequest.onerror = (event) => {
        console.error('Error adding job to database', event.target.error);
      };

    };
  }
});

// load the existing jobs from the database and display them in the table
inProcessrequest.onsuccess = () => {
  const transaction = inProcessrequest.result.transaction('inprocessjobs', 'readonly');
  const store = transaction.objectStore('inprocessjobs');
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = () => {
    const jobs = getAllRequest.result;
    const tbody = document.getElementById('inProcessDataTableBody');

    for (const job of jobs) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${job.Companyname}</td>
          <td>${job.jobRole}</td>
          <td>${job.jobType}</td>
          <td>${job.appliedDate}</td>
          <td>${job.location}</td>
          <td>${job.salary}</td>
          <td><button class="offer-button" id="offer-button" data-id="${job.id}">Offer</button></td>
          <td><button class="events-button" id="events-button" data-id="${job.id}">Events</button></td>
          <td><button class="rejected-button" id="delete-button" data-id="${job.id}">Rejected</button></td>
        `;
      tbody.appendChild(tr);
    }
  };

  getAllRequest.onerror = (event) => {
    console.error('Error getting jobs from database', event.target.error);
  };
};
