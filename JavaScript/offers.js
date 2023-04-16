const offersrequest = window.indexedDB.open("offersbullsData", 1);
// create an object store to store job records

offersrequest.onerror = function(event) {
  console.log("Error opening offers database.");
};

offersrequest.onsuccess = function(event) {
  const db = event.target.result;
  console.log("Connected to the offers database.");
};

offersrequest.onupgradeneeded = (event) => {
const db = event.target.result;
db.createObjectStore('offersjobs', { keyPath: 'id', autoIncrement: true });
console.log("Started in offers database.");
};




// delete a job record from the database and the table
document.getElementById('offersDataTableBody').addEventListener('click', (event) => {
  if (event.target.classList.contains('reject-button')) {
    const db = offersrequest.result;
    const transaction = db.transaction('offersjobs', 'readwrite');
    const store = transaction.objectStore('offersjobs');

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
});

document.getElementById('offersDataTableBody').addEventListener('click', (event) => {
  if (event.target.classList.contains('accept-button')) {
    const db = offersrequest.result;
    const transaction = db.transaction('offersjobs', 'readwrite');
    const store = transaction.objectStore('offersjobs');

    const id = Number(event.target.getAttribute('data-id'));

    const getAllRequest = store.get(id);

    console.log(getAllRequest);
        getAllRequest.onsuccess = function (event) {
            const data = event.target.result;
            data.acceptMark = 'Yes';
            store.put(data);
            window.location.reload();
        };
        getAllRequest.onerror = (event) => {
            console.error('Error adding job to database', event.target.error);
        };
  }
});

// load the existing jobs from the database and display them in the table
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
          `;
          if (job.acceptMark == 'Yes') {
            tr.innerHTML += `
            <td class="complete-text">Accepted!!</button></td>
        `;
            } else{
              tr.innerHTML += `
              <td><button class="accept-button" id="accept-button" data-id="${job.id}">Accept</button></td>
            `;
            }
            if (job.acceptMark == 'Yes') {
            tr.innerHTML += `
          <td><button class="reject-button" id="delete-button" data-id="${job.id}">Delete</button></td>
        `;
            } else{
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
  function preventBack(){
    window.history.forward();
  }
  setTimeout("preventBack()", 0);
  window.onunload=function(){null};
  