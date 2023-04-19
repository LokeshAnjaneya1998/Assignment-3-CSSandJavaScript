const eventrequest = window.indexedDB.open("eventsbullsData", 1);


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

var currentTimestamp = new Date();

var hours = currentTimestamp.getHours().toString().padStart(2, '0');
var minutes = currentTimestamp.getMinutes().toString().padStart(2, '0');
var month = (currentTimestamp.getMonth() + 1).toString().padStart(2, '0');
var day = currentTimestamp.getDate().toString().padStart(2, '0');
var year = currentTimestamp.getFullYear();

var todayDate = month + '/' + day + '/' + year;
let intDay = parseInt(day)-1
var tday = intDay.toString()
var tomorrowDate = month + '/' + tday + '/' + year;

console.log(todayDate);

eventrequest.onsuccess = () => {
    console.log('debug1');
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
        `;
            if (job.dueDate == todayDate) {
                tr.innerHTML += `
        <td>Alert!! You have this event due today</td>
        `;
        if (job.dueDate == todayDate) {
            tr.innerHTML += `
        <td>Reminder!! You have this event due tomorrow</td>
        `;
        }
            }
            tbody.appendChild(tr);
        }
    };

    getAllRequest.onerror = (event) => {
        console.error('Error getting jobs from database', event.target.error);
    };
};