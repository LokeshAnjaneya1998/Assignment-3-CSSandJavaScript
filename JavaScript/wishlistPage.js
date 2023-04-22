document.getElementById('addJobButton').addEventListener('click', (event) => {
  event.preventDefault();

  const Companyname = document.getElementById('wishlistCompanyName').value.trim();
  const jobRole = document.getElementById('wishlistJobRole').value.trim();
  const jobType = document.getElementById('wishlistJobType').value.trim();
  const appliedDate = document.getElementById('wishlistAppliedDate').value.trim();
  const location = document.getElementById('wishlistLocation').value.trim();
  const salary = document.getElementById('wishlistSalary').value.trim();
  const acceptMark = "No";
  const status = "Not yet responded"
  if (Companyname == "") { alert('Please Enter Company Name') }
  else if (jobRole == "") { alert('Please Enter Job Role') }
  else if (jobType == "") { alert('Please Enter Job Type') }
  else if (appliedDate == "") { alert('Please Enter Applied Date') }
  else if (location == "") { alert('Please Enter Location') }
  else if (salary == "") { alert('Please Enter Salary') }

  if (Companyname && jobRole && jobType && appliedDate && location && salary) {
    const transaction = request.result.transaction('jobs', 'readwrite');
    const store = transaction.objectStore('jobs');

    const job = { Companyname, jobRole, jobType, appliedDate, location, salary, acceptMark, status };

    const addRequest = store.add(job);

    addRequest.onsuccess = () => {

      window.location.reload();
    };

    addRequest.onerror = (event) => {
      console.error('Error adding job to database', event.target.error);
    };
  }
});



document.getElementById('wishlistDataTableBody').addEventListener('click', (event) => {

  const db = request.result;
    const jobtransaction = db.transaction('jobs', 'readwrite');
    const store = jobtransaction.objectStore('jobs');

  if (event.target.classList.contains('edit-button')) {
    disableButtons();
    const row = event.target.parentNode.parentNode;
    let id1 = Number(event.target.getAttribute('data-id'));
    console.log('this is my id', id1)
    const getAllRequest = store.get(id1);
    console.log(getAllRequest);

    getAllRequest.onsuccess = function (event) {

      const data = event.target.result;
      console.log(data.Companyname);
      const wishCompanyname = data.Companyname;
      const wishjobRole = data.jobRole;
      const wishjobType = data.jobType;
      const wishappliedDate = data.appliedDate;
      const wishlocation = data.location;
      const wishsalary = data.salary;

      while (row && row.nodeName !== 'TR') {
        row = row.parentNode;
      }
      if (!row) {
        return;
      }

      row.innerHTML = `
                <td>
                <input type="text" id="wishlistTableCompanyName" name="wishlistTableCompanyName" placeholder="Enter Company Name" required value="${wishCompanyname}">
                </td>
                <td>
                <input type="text" id="wishlistTableJobRole" name="wishlistTableJobRole" placeholder="Enter Job Role" required value="${wishjobRole}">
                </td>
                <td>
                <select type="text" class="jobTypeOption" id="wishlistJobTypeDD" name="wishlistJobTypeDD" placeholder="Enter Job Type" required>
                  <option value="${wishjobType}" disabled selected hidden >${wishjobType}</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Full-Time (Remote)">Full-Time (Remote)</option>
                  <option value="Full-Time (Hybrid)">Full-Time (Hybrid)</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                </select>
                </td>
                <td>
                <input type="date" id="wishlistTableAppliedDate" name="wishlistTableAppliedDate" placeholder="Enter Applied Dtae" required value="${wishappliedDate}">
                </td>
                <td>
                <input type="text" id="wishlistTableLocation" name="wishlistTableLocation" placeholder="Enter Job Location" required value="${wishlocation}">
                </td>
                <td>
                <input type="number" id="wishlistTableSalary" name="wishlistTableSalary" placeholder="Enter Salary" required value="${wishsalary}">
                </td>
                <td></td>
                <td><button class="update-button" id="update-button" data-id="${data.id}">Update</button></td>
                <td><button onclick="cancelButton()"class="cancel-button" id="cancel-button" data-id="${data.id}">cancel</button></td>
                `;

    };
    getAllRequest.onerror = (event) => {
      console.error('Error getting jobs from database', event.target.error);
    };

  }

  if (event.target.classList.contains('update-button')) {
    const wishCompanyname = document.getElementById('wishlistTableCompanyName').value;
    const wishjobRole = document.getElementById('wishlistTableJobRole').value;
    const wishjobType = document.getElementById('wishlistJobTypeDD').value;
    const wishappliedDate = document.getElementById('wishlistTableAppliedDate').value;
    const wishlocation = document.getElementById('wishlistTableLocation').value;
    const wishsalary = document.getElementById('wishlistTableSalary').value;
    if (wishCompanyname == "") { alert('Please Enter Company Name') }
    else if (wishjobRole == "") { alert('Please Enter Job Role') }
    else if (wishjobType == "") { alert('Please Enter Job Type') }
    else if (wishappliedDate == "") { alert('Please Enter Applied Date') }
    else if (wishlocation == "") { alert('Please Enter Location') }
    else if (wishsalary == "") { alert('Please Enter Salary') }
    if (wishCompanyname && wishjobRole && wishjobType && wishappliedDate && wishlocation && wishsalary) {
      const id = Number(event.target.getAttribute('data-id'));
      const getAllRequest = store.get(id);
      console.log(getAllRequest);
      getAllRequest.onsuccess = function (event) {
        const data = event.target.result;
        data.Companyname = wishCompanyname;
        data.jobRole = wishjobRole;
        data.jobType = wishjobType;
        data.appliedDate = wishappliedDate;
        data.location = wishlocation;
        data.salary = wishsalary;
        store.put(data);
        window.location.reload();
      };

      request.onerror = (event) => {
        console.error('Error adding job to database', event.target.error);
      };
    }
  }
});

function displayWishlistData(tableNmae){
request.onsuccess = () => {

  const transaction = request.result.transaction('jobs', 'readonly');
  const store = transaction.objectStore('jobs');
  const getAllRequest = store.getAll();
  getAllRequest.onsuccess = () => {
    const alljobs = getAllRequest.result.reverse();
    const tbody = document.getElementById(tableNmae);
    if(alljobs.length == 0){
      const msgString = document.getElementById('emptymsg');
      console.log(alljobs.length);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><h1>You have no Jobs here!! Please add a job.</h1></td>
        `
        msgString.appendChild(tr);
    }
    for (const job of alljobs) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${job.Companyname}</td>
          <td>${job.jobRole}</td>
          <td>${job.jobType}</td>
          <td>${job.appliedDate}</td>
          <td>${job.location}</td>
          <td>${job.salary}</td>
          <td><button class="edit-button" id="edit-button" data-id="${job.id}">Edit Job</button></td>
          <td><button onclick="moveToPages('inProcess-button',${'request'}, 'jobs', ${'inProcessrequest'}, 'inprocessjobs')"
          class="inProcess-button" id="inProcess-button" data-id="${job.id}">In Process</button></td>
          <td><button onclick="deleteButton(${'request'}, 'jobs')" class="delete-button" id="delete-button" data-id="${job.id}">Delete</button></td>
        `;
      tbody.appendChild(tr);
    }
  };

  getAllRequest.onerror = (event) => {
    console.error('Error getting jobs from database', event.target.error);
  };
};
};
displayWishlistData('wishlistDataTableBody');

