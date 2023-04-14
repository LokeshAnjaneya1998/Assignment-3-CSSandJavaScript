let id1;
const eventrequest = window.indexedDB.open("eventsbullsData", 1);
// create an object store to store job records

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

document.getElementById('addEventButton').addEventListener('click', (event) => {
    event.preventDefault();

    const eventscompanyname = document.getElementById('events-company-name').value;
    const eventsjobRole = document.getElementById('events-job-role').value;
    const eventType = document.getElementById('eventDropDown').value;
    const dueDate = document.getElementById('due-date').value;

    if (eventscompanyname && eventsjobRole && eventType && dueDate) {
        const transaction = eventrequest.result.transaction('eventjobs', 'readwrite');
        const store = transaction.objectStore('eventjobs');

        const job = { eventscompanyname, eventsjobRole, eventType, dueDate };

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
    if (event.target.classList.contains('update-event-button')) {
        const eventscompanyname = document.getElementById('update-events-company-name').value;
        const eventsjobRole = document.getElementById('update-events-job-role').value;
        const eventType = document.getElementById('update-eventDropDown').value;
        const dueDate = document.getElementById('update-due-date').value;
        if (eventscompanyname && eventsjobRole && eventType && dueDate) {
            const transaction = eventrequest.result.transaction('eventjobs', 'readwrite');
            const store = transaction.objectStore('eventjobs');
            console.log('this is my id',id1)
            store.delete(id1);
            const job = { eventscompanyname, eventsjobRole, eventType, dueDate };

            const addRequest = store.add(job);

            addRequest.onsuccess = () => {
               window.location.reload();
            };

            addRequest.onerror = (event) => {
                console.error('Error adding job to database', event.target.error);
            };
        }
    }
});

document.getElementById('eventsDataTableBody').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-event-button')) {
        const db = eventrequest.result;
        const transaction = db.transaction('eventjobs', 'readwrite');
        const store = transaction.objectStore('eventjobs');

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

eventrequest.onsuccess = () => {
    const transaction = eventrequest.result.transaction('eventjobs', 'readonly');
    const store = transaction.objectStore('eventjobs');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        const jobs = getAllRequest.result.reverse();
        const tbody = document.getElementById('eventsDataTableBody');

        for (const job of jobs) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${job.eventscompanyname}</td>
        <td>${job.eventsjobRole}</td>
        <td>${job.eventType}</td>
        <td>${job.dueDate}</td>
        <td><button class="edit-event-button" id="edit-button" data-id="${job.id}">Edit Event</button></td>
        <td><button class="delete-event-button" id="delete-button" data-id="${job.id}">Delete Event</button></td>
        <td><button class="complete-event-button" id="complete-button">completed</button></td>
        `;
            tbody.appendChild(tr);
        }
    };

    getAllRequest.onerror = (event) => {
        console.error('Error getting jobs from database', event.target.error);
    };
};

document.getElementById('eventsDataTableBody').addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-event-button')) {

        const transaction = eventrequest.result.transaction('eventjobs', 'readwrite');
        const store = transaction.objectStore('eventjobs');

        id1 = Number(event.target.getAttribute('data-id'));

        const getAllRequest = store.get(id1);
        
            
       
    
        event.target.parentNode.parentNode.remove();

        console.log(getAllRequest);
        getAllRequest.onsuccess = function (event) {

            const data = event.target.result;
            console.log(data.eventscompanyname);
            const evcompname = data.eventscompanyname;
            const evejobrole = data.eventsjobRole;
            const eveevent = data.eventType;
            const eveduedate = data.dueDate;
            const tbody = document.getElementById('eventsDataTableBody');

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td><input type="text" id="update-events-company-name" name="events-company-name" required="" value="${evcompname}"></td>
                <td><input type="text" id="update-events-job-role" name="events-job-role" required="" value="${evejobrole}"></td>
                <td><select id="update-eventDropDown" name="eventDropDown">
                <option value="${eveevent}" disabled selected hidden>${eveevent}</option>
                <option value="Technical-Interview">Technical Interview</option>
                <option value="HR-Interview">HR Interview</option>
                <option value="Coding-Test">Coding Test</option>
              </select></td>
                <td><input type="date" id="update-due-date" name="due-date" value="${eveduedate}" required></td>
                <td><button href="#" title="Edit" class="update-event-button" id="edit-button" >Update</button></td>
                <td><button href="#" title="Delete" class="delete-event-button" id="delete-button" data-id="${data.id}">Delete Event</button></td>
                `;
            tbody.appendChild(tr);

        };
        getAllRequest.onerror = (event) => {
            console.error('Error getting jobs from database', event.target.error);
        };

    }
});

