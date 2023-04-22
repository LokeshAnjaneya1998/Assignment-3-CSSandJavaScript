document.getElementById('inProcessDataTableBody').addEventListener('click', (event) => {
  const db = inProcessrequest.result;
  const transaction = db.transaction('inprocessjobs', 'readwrite');
  const store = transaction.objectStore('inprocessjobs');
  if (event.target.classList.contains('rejected-button')) {

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



  if (event.target.classList.contains('events-button')) {
    const jobId = Number(event.target.getAttribute('data-id'));
    const getRequest = store.get(jobId);

    getRequest.onsuccess = (event) => {
      const eventsjob = event.target.result;
      const eventscompanyname = eventsjob.Companyname;
      const eventsjobRole = eventsjob.jobRole;
      const eventType = "";
      const dueDate = "";
      const completeMark = "No";

      const eventstransaction = eventrequest.result.transaction('eventjobs', 'readwrite');
      const eventsStore = eventstransaction.objectStore('eventjobs');
      const getAllRequest = eventsStore.getAll();
      getAllRequest.onsuccess = () => {
        let eventExist = 'False';
        const resultRequest = getAllRequest.result;
        console.log(resultRequest);
        for (event of resultRequest) {
          console.log('debug', eventscompanyname);
          console.log('debug', eventsjobRole);
          console.log(event.eventscompanyname);
          console.log(event.eventsjobRole);
          if (event.eventscompanyname.toLowerCase() == eventscompanyname.toLowerCase() && event.eventsjobRole.toLowerCase() == eventsjobRole.toLowerCase()) {
            eventExist = 'True'
          }
        }
        if (eventExist == 'False') {
          const job = { eventscompanyname, eventsjobRole, eventType, dueDate, completeMark };

          const moveRequest = eventsStore.add(job);
          moveRequest.onsuccess = () => {
            console.log('Success adding eventsjob to database');
            alert("Job added to Events!!");
          };

          moveRequest.onerror = (event) => {
            console.error('Error adding job to database', event.target.error);
          };
        } else {
          alert('A job with same details exist in events');
        }
      };
    };
  }
});

function displayInprocessData(tableNmae) {
  inProcessrequest.onsuccess = () => {
    const transaction = inProcessrequest.result.transaction('inprocessjobs', 'readonly');
    const store = transaction.objectStore('inprocessjobs');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
      const jobs = getAllRequest.result.reverse();
      const tbody = document.getElementById(tableNmae);
      console.log(jobs.length);
      if(jobs.length == 0){
        const msgString = document.getElementById('emptymsg');
        console.log(jobs.length);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><h1>You have no Jobs here!! Please go to wishlist and decide.</h1></td>
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
          <td><button onclick="moveToPages('offer-button',${'inProcessrequest'}, 'inprocessjobs', ${'offersrequest'},'offersjobs')"
          class="offer-button" id="offer-button" data-id="${job.id}">Offer</button></td>
          <td><button class="events-button" id="events-button" data-id="${job.id}">Events</button></td>
          <td><button onclick="deleteButton(${'inProcessrequest'}, 'inprocessjobs')" class="rejected-button" id="delete-button" data-id="${job.id}">Rejected</button></td>
        `;
        tbody.appendChild(tr);
      }
    };

    getAllRequest.onerror = (event) => {
      console.error('Error getting jobs from database', event.target.error);
    };
  };
};
displayInprocessData('inProcessDataTableBody');

