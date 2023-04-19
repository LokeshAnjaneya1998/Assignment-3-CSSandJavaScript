const offersrequest = window.indexedDB.open("offersbullsData", 1);
const inProcessrequest = window.indexedDB.open("inpricessbullsData", 1);

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

var currentTimestamp = new Date();

var hours = currentTimestamp.getHours().toString().padStart(2, '0');
var minutes = currentTimestamp.getMinutes().toString().padStart(2, '0');
var month = (currentTimestamp.getMonth() + 1).toString().padStart(2, '0');
var day = currentTimestamp.getDate().toString().padStart(2, '0');
var year = currentTimestamp.getFullYear();

var formattedTimestamp = month + '/' + day + '/' + year;

console.log(formattedTimestamp);

document.getElementById('offersDataTableBody').addEventListener('click', (event) => {
  const db = offersrequest.result;
  const transaction = db.transaction('offersjobs', 'readwrite');
  const store = transaction.objectStore('offersjobs');
  if (event.target.classList.contains('reject-button')) {
    const id = Number(event.target.getAttribute('data-id'));

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => {
      event.target.parentNode.parentNode.remove();
      console.log("Deleted Successfully");
    };

    offersrequest.onerror = (event) => {
      console.error('Error deleting job from database', event.target.error);
    };
  }

  if (event.target.classList.contains('accept-button')) {


    const id = Number(event.target.getAttribute('data-id'));

    const getAllRequest = store.get(id);

    console.log(getAllRequest);
    getAllRequest.onsuccess = function (event) {
      const data = event.target.result;
      data.acceptMark = 'Yes';
      data.status = 'Accepted on '+formattedTimestamp;
      store.put(data);
      window.location.reload();
    };
    getAllRequest.onerror = (event) => {
      console.error('Error adding job to database', event.target.error);
    };
  }

  if (event.target.classList.contains('undo-button')) {
    const id = Number(event.target.getAttribute('data-id'));

    const getAllRequest = store.get(id);

    console.log(getAllRequest);
    getAllRequest.onsuccess = function (event) {
      const data = event.target.result;
      data.acceptMark = 'No';
      data.status = 'Not yet responded';
      store.put(data);
      window.location.reload();
    };
    getAllRequest.onerror = (event) => {
      console.error('Error adding job to database', event.target.error);
    };
  }

  if (event.target.classList.contains('inprocess-button')) {
    const jobId = Number(event.target.getAttribute('data-id'));
    const getRequest = store.get(jobId);
    getRequest.onsuccess = (event) => {
      const db = event.target.result;
      const jobtransaction = inProcessrequest.result.transaction('inprocessjobs', 'readwrite');
      const inProcessjob = jobtransaction.objectStore('inprocessjobs');

      const moveRequest = inProcessjob.add(db);

      moveRequest.onsuccess = () => {
        console.log('Success adding offersjob to database');
      };

      moveRequest.onerror = (event) => {
        console.error('Error adding job to database', event.target.error);
      };

    }
    const deleteRequest = store.delete(jobId);
    deleteRequest.onsuccess = () => {
      event.target.parentNode.parentNode.remove();
      console.log("Deleted Successfully");
    };

    deleteRequest.onerror = (event) => {
      console.error('Error deleting job from database', event.target.error);
    };
  }
});

offersrequest.onsuccess = () => {
  const transaction = offersrequest.result.transaction('offersjobs', 'readonly');
  const store = transaction.objectStore('offersjobs');
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = () => {
    const jobs = getAllRequest.result;
    const tbody = document.getElementById('offersDataTableBody');

    for (const job of jobs) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${job.Companyname}</td>
          <td>${job.jobRole}</td>
          <td>${job.jobType}</td>
          <td>${job.appliedDate}</td>
          <td>${job.location}</td>
          <td>${job.salary}</td>
          <td>${job.status}</td>
          `;
      if (job.acceptMark == 'Yes') {
        tr.innerHTML += `
            <td class="complete-text">PARTY!!</button></td>
            <td><button class="undo-button" id="delete-button" data-id="${job.id}">Undo</button></td>
        `;
      } else {
        tr.innerHTML += `
              <td><button class="accept-button" id="accept-button" data-id="${job.id}">Accept</button></td>
              <td><button class="inprocess-button" id="inprocess-button" data-id="${job.id}">In Process</button></td>
            `;
      }
      if (job.acceptMark == 'Yes') {
        tr.innerHTML += `
          <td><button class="reject-button" id="delete-button" data-id="${job.id}">Delete</button></td>
        `;
      } else {
        tr.innerHTML += `
          <td><button class="reject-button" id="delete-button" data-id="${job.id}">Reject</button></td>
        `;
      }
      tbody.appendChild(tr);
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
