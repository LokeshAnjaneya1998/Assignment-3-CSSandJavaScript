document.getElementById('addEventButton').addEventListener('click', (event) => {
    event.preventDefault();
    const transaction = eventrequest.result.transaction('eventjobs', 'readwrite');
    const store = transaction.objectStore('eventjobs');
    const eventscompanyname = document.getElementById('events-company-name').value.trim();
    const eventsjobRole = document.getElementById('events-job-role').value.trim();
    const eventType = document.getElementById('eventDropDown').value.trim();
    const dueDate = document.getElementById('due-date').value.trim();
    const completeMark = "No";
    if (eventscompanyname == "") { alert('Please Enter Company Name') }
    else if (eventsjobRole == "") { alert('Please Enter Job Role') }
    else if (eventType == "") { alert('Please select Event Type') }
    else if (dueDate == "") { alert('Please Enter Due Date') }
    if (eventscompanyname && eventsjobRole && eventType && dueDate) {
        const job = { eventscompanyname, eventsjobRole, eventType, dueDate, completeMark };

        const addRequest = store.add(job);

        addRequest.onsuccess = () => {
            window.location.reload();
        };

        addRequest.onerror = (event) => {
            console.error('Error adding job to database', event.target.error);
        };
    }

});
document.getElementById('eventsDataTableBody').addEventListener('click', (event) => {

    const transaction = eventrequest.result.transaction('eventjobs', 'readwrite');
    const store = transaction.objectStore('eventjobs');
    if (event.target.classList.contains('update-event-button')) {
        const evecompanyname = document.getElementById('update-events-company-name').value.trim();
        const evejobRole = document.getElementById('update-events-job-role').value.trim();
        const eveType = document.getElementById('update-eventDropDown').value.trim();
        const evedueDate = document.getElementById('update-due-date').value.trim();
        if (evecompanyname == "") { alert('Please Enter Company Name') }
        else if (evejobRole == "") { alert('Please Enter Job Role') }
        else if (eveType == "") { alert('Please select Event Type') }
        else if (evedueDate == "") { alert('Please Enter Due Date') }
        if (evecompanyname && evejobRole && eveType && evedueDate) {
            const id = Number(event.target.getAttribute('data-id'));
            const getAllRequest = store.get(id);
            console.log(getAllRequest);
            getAllRequest.onsuccess = function (event) {
                const data = event.target.result;
                data.eventscompanyname = evecompanyname;
                data.eventsjobRole = evejobRole;
                data.eventType = eveType;
                data.dueDate = evedueDate;
                store.put(data);
                window.location.reload();
            };

            addRequest.onerror = (event) => {
                console.error('Error adding job to database', event.target.error);
            };
        }
    }


    if (event.target.classList.contains('edit-event-button')) {
        disableButtons();
        const row = event.target.parentNode.parentNode;
        const id = Number(event.target.getAttribute('data-id'));
        const getAllRequest = store.get(id);
        console.log(getAllRequest);
        getAllRequest.onsuccess = function (event) {
            const data = event.target.result;
            console.log(data.eventscompanyname);
            const evcompname = data.eventscompanyname;
            const evejobrole = data.eventsjobRole;
            const eveevent = data.eventType;
            const eveduedate = data.dueDate;
            while (row && row.nodeName !== 'TR') {
                row = row.parentNode;
            }
            if (!row) {
                return;
            }

            row.innerHTML = `
      <td><input type="text" id="update-events-company-name" name="events-company-name" placeholder="Enter Company Name" value="${evcompname}" required></td>
      <td><input type="text" id="update-events-job-role" name="events-job-role" placeholder="Enter Job Role" value="${evejobrole}" required></td>
      <td>
        <select id="update-eventDropDown" name="eventDropDown" required>
          <option value="${eveevent}" disabled selected hidden>${eveevent}</option>
          <option value="Technical-Interview">Technical Interview</option>
          <option value="HR-Interview">HR Interview</option>
          <option value="Coding-Test">Coding Test</option>
        </select>
      </td>
      <td><input type="date" id="update-due-date" name="due-date" value="${eveduedate}" required></td>
      <td></td>
      <td><button class="update-event-button" id="edit-button" data-id="${data.id}">Update</button></td>
      <td><button onclick="cancelButton()" class="cancel-event-button" id="cancel-button" data-id="${data.id}">Cancel</button></td>
    `;
        };
        getAllRequest.onerror = (event) => {
            console.error('Error getting jobs from database', event.target.error);
        };

    }

    if (event.target.classList.contains('complete-event-button')) {
        const id = Number(event.target.getAttribute('data-id'));
        console.log(id)
        const getAllRequest = store.get(id);
        console.log(getAllRequest);
        getAllRequest.onsuccess = function (event) {
            const data = event.target.result;
            data.completeMark = 'Yes';
            store.put(data);
            window.location.reload();
        };
        getAllRequest.onerror = (event) => {
            console.error('Error adding job to database', event.target.error);
        };
    }



    if (event.target.classList.contains('unmark-event-button')) {
        const id = Number(event.target.getAttribute('data-id'));
        const getAllRequest = store.get(id);
        event.target.parentNode.parentNode.remove();
        console.log(getAllRequest);
        getAllRequest.onsuccess = function (event) {
            const data = event.target.result;
            data.completeMark = 'No';
            store.put(data);
            window.location.reload();
        };
        getAllRequest.onerror = (event) => {
            console.error('Error adding job to database', event.target.error);
        };
    }
});

function displayEventsData(tableName) {
    eventrequest.onsuccess = () => {
        const transaction = eventrequest.result.transaction('eventjobs', 'readonly');
        const store = transaction.objectStore('eventjobs');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            const jobs = getAllRequest.result;
            const tbody = document.getElementById(tableName);
            console.log(jobs.length);
            if (jobs.length == 0) {
                const msgString = document.getElementById('emptymsg');
                console.log(jobs.length);
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td><h1>You have no events here!! Please go to InProcess or add an event.</h1></td>
                `
                msgString.appendChild(tr);
            }
            for (const job of jobs) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
        <td>${job.eventscompanyname}</td>
        <td>${job.eventsjobRole}</td>
        <td>${job.eventType}</td>
        <td>${job.dueDate}</td>
        `;
                if (job.completeMark == 'No') {
                    tr.innerHTML += `
        <td><button class="edit-event-button" id="edit-button" data-id="${job.id}">Edit Event</button></td>
        `;
                } else {
                    tr.innerHTML += `
        <td class="complete-text">Marked as<br>Completed!!</button></td>
        `;
                }
                if (job.completeMark == 'No') {
                    tr.innerHTML += `
        <td><button class="complete-event-button" id="complete-button" data-id="${job.id}">completed</button></td>
        `;
                } else {
                    tr.innerHTML += `
            <td><button class="unmark-event-button" id="delete-button" data-id="${job.id}">Undo Mark</button></td>
            `;
                }
                tr.innerHTML += `
        <td><button onclick="deleteButton(${'eventrequest'}, 'eventjobs')" class="delete-event-button" id="delete-button" data-id="${job.id}">Delete Event</button></td>
        `;
                tbody.appendChild(tr);
            }
        };

        getAllRequest.onerror = (event) => {
            console.error('Error getting jobs from database', event.target.error);
        };
    };
};
displayEventsData('eventsDataTableBody');

localStorage.setItem('chartreload', '');
localStorage.setItem('wishlistreload', '');
localStorage.setItem('profilereload', '');
localStorage.setItem('offersreload', '');
localStorage.setItem('notificatonsreload', '');
localStorage.setItem('inprocesreload', '');


