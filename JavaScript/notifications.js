eventrequest.onsuccess = () => {
    const transaction = eventrequest.result.transaction('eventjobs', 'readonly');
    const store = transaction.objectStore('eventjobs');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        const jobs = getAllRequest.result.reverse();
        const tbody = document.getElementById('notificationsDataTableBody');
        for (const job of jobs) {
            const tr = document.createElement('tr');
            if (job.dueDate == todayDate || job.dueDate == tomorrowDate) {
            tr.innerHTML = `
        <td>${job.eventscompanyname}</td>
        <td>${job.eventsjobRole}</td>
        <td>${job.eventType}</td>
        <td>${job.dueDate}</td>
        `;
            if (job.dueDate == todayDate) {
                tr.innerHTML += `
        <td class="alert-text">Alert!! You have this event due today</td>
        `;
            }
        if (job.dueDate == tomorrowDate) {
            tr.innerHTML += `
        <td class="reminder-text">Reminder!! You have this event due tomorrow</td>
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

