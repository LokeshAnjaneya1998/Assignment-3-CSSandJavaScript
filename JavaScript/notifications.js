eventrequest.onsuccess = () => {
    const transaction = eventrequest.result.transaction('eventjobs', 'readonly');
    const store = transaction.objectStore('eventjobs');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        const jobs = getAllRequest.result;
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
        try{
        var numberOfRows = document.getElementById('notificationsDataTableBody').rows[0];
        var noOftd = numberOfRows.getElementsByTagName('td').length;
        console.log(noOftd);
        if (noOftd == 0) {
            const msgString = document.getElementById('emptymsg');
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td><h1>You have no notifications!! Notifications appear when you have events due today/tomorrow.</h1></td>
            `
            msgString.appendChild(tr);
        }
    } catch (error){
        const msgString = document.getElementById('emptymsg');
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td><h1>You have no notifications!! Notifications appear when you have events due today/tomorrow.</h1></td>
        `
        msgString.appendChild(tr);
    }
    };
    getAllRequest.onerror = (event) => {
        console.error('Error getting jobs from database', event.target.error);
        localStorage.setItem('reloaded', '');
    };
};

