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

});

function displayOffersData(tableNmae){
offersrequest.onsuccess = () => {
  const transaction = offersrequest.result.transaction('offersjobs', 'readonly');
  const store = transaction.objectStore('offersjobs');
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = () => {
    const jobs = getAllRequest.result;
    const tbody = document.getElementById(tableNmae);
     console.log(jobs.length);
      if(jobs.length == 0){
        const msgString = document.getElementById('emptymsg');
        console.log(jobs.length);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><h1>You have no offers yet!!</h1></td>
          `
          msgString.appendChild(tr);
      }
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
            <td><button class="undo-button" id="undo-button" data-id="${job.id}">Undo</button></td>
        `;
      } else {
        tr.innerHTML += `
              <td><button class="accept-button" id="accept-button" data-id="${job.id}">Accept</button></td>
              <td><button onclick="moveToPages('offersDataTableBody', ${'offersrequest'}, 'offersjobs', ${'inProcessrequest'}, 'inprocessjobs')"
              class="inprocess-button" id="inprocess-button" data-id="${job.id}">In Process</button></td>
            `;
      }
      if (job.acceptMark == 'Yes') {
        tr.innerHTML += `
          <td><button onclick="deleteButton(${'offersrequest'}, 'offersjobs')" class="reject-button" id="delete-button" data-id="${job.id}">Delete</button></td>
        `;
      } else {
        tr.innerHTML += `
          <td><button onclick="deleteButton(${'offersrequest'}, 'offersjobs')" class="reject-button" id="delete-button" data-id="${job.id}">Reject</button></td>
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
displayOffersData('offersDataTableBody');

