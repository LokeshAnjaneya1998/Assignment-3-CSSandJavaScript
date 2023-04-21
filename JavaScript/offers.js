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
      data.status = 'Accepted on '+todayDate;
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

function displayInprocessData(tableNmae){
offersrequest.onsuccess = () => {
  const transaction = offersrequest.result.transaction('offersjobs', 'readonly');
  const store = transaction.objectStore('offersjobs');
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = () => {
    const jobs = getAllRequest.result;
    const tbody = document.getElementById(tableNmae);

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
};
displayInprocessData('offersDataTableBody');
function preventBack() {
  window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload = function () { null };
