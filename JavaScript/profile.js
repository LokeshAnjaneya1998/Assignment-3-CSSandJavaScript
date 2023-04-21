
signuprequest.onsuccess = () => {
    const transaction = signuprequest.result.transaction('signupids', 'readonly');
    const store = transaction.objectStore('signupids');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        const jobs = getAllRequest.result.reverse();
        const thead = document.getElementById('left-table');
        for (const job of jobs) {
            var storedValue = localStorage.getItem('usernameVerify');
            console.log('Stored Value:', storedValue);
            const tbody = document.createElement('tbody');
            if (storedValue == job.username) {
                tbody.innerHTML = `
        
        <tr><td> Name:</td>
        <td>${job.firstname + " " + job.lastname} </td></tr>
        <tr> <td> School:</td>
        <td>${job.school}</tr> </td></tr>
        <tr> <td> City:</td>
        <td> ${job.city}</tr></td></tr>
        <tr><td>State:</td>
        <td>${job.state}</tr></td></tr>
        <tr><td> Email: </td>
        <td>${job.email}</tr></td></tr>
        <tr><td>UserName:</td>
        <td>${job.username}</tr></td></tr>
        <tr><td>Password:</td>
        <td>************</tr></td></tr>
        `;

            }
            thead.appendChild(tbody);

        }
    };
    getAllRequest.onerror = (event) => {
        console.error('Error getting jobs from database', event.target.error);
    };
};

request.onsuccess = () => {
    const transaction = request.result.transaction('jobs', 'readonly');
    const store = transaction.objectStore('jobs');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        const jobs = getAllRequest.result;
        const tbody = document.getElementById('right-table');

        for (const job of jobs) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${job.Companyname}</td>
            <td>${job.jobRole}</td>
            <td>${job.jobType}</td>
            <td>${job.appliedDate}</td>
            <td>${job.location}</td>
            <td>${job.salary}</td>
            <td><a href="../pages/wishList.html">Wishlist>></a></td>
          `;
            tbody.appendChild(tr);
        }
    };

    getAllRequest.onerror = (event) => {
        console.error('Error getting jobs from database', event.target.error);
    };
};
inProcessrequest.onsuccess = () => {
    const transaction = inProcessrequest.result.transaction('inprocessjobs', 'readonly');
    const store = transaction.objectStore('inprocessjobs');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        const jobs = getAllRequest.result;
        const tbody = document.getElementById('right-table');

        for (const job of jobs) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${job.Companyname}</td>
            <td>${job.jobRole}</td>
            <td>${job.jobType}</td>
            <td>${job.appliedDate}</td>
            <td>${job.location}</td>
            <td>${job.salary}</td>
            <td><a href="../pages/inProcess.html">In Process>></a></td>
          `;
            tbody.appendChild(tr);
        }
    };

    getAllRequest.onerror = (event) => {
        console.error('Error getting jobs from database', event.target.error);
    };
};
offersrequest.onsuccess = () => {
    const transaction = offersrequest.result.transaction('offersjobs', 'readonly');
    const store = transaction.objectStore('offersjobs');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        const jobs = getAllRequest.result;
        const tbody = document.getElementById('right-table');

        for (const job of jobs) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${job.Companyname}</td>
            <td>${job.jobRole}</td>
            <td>${job.jobType}</td>
            <td>${job.appliedDate}</td>
            <td>${job.location}</td>
            <td>${job.salary}</td>
            <td><a href="../pages/offers.html">Offer>></a></td>

            `;

            tbody.appendChild(tr);
        }
    };

    getAllRequest.onerror = (event) => {
        console.error('Error getting jobs from database', event.target.error);
    };
};
