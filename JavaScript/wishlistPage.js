const request = window.indexedDB.open("wishlistbullsData", 1);
const inProcessrequest = window.indexedDB.open("inpricessbullsData", 1);
request.onerror = function (event) {
  console.log("Error opening JOBS database.");
};

request.onsuccess = function (event) {
  const db = event.target.result;
  console.log("Connected to the JOBS database.");
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('jobs', { keyPath: 'id', autoIncrement: true });
  console.log("Started in JOBS database.");
};

inProcessrequest.onerror = function (event) {
  console.log("Error opening IN PROCESS database.");
};

inProcessrequest.onsuccess = function (event) {
  const db = event.target.result;
  console.log("Connected to the IN PROCESS database.");
};

inProcessrequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('inprocessjobs', { keyPath: 'id', autoIncrement: true });
  console.log("Started in IN PROCESS database.");
};

document.getElementById('addJobButton').addEventListener('click', (event) => {
  event.preventDefault();

  const Companyname = document.getElementById('wishlistCompanyName').value.trim();
  const jobRole = document.getElementById('wishlistJobRole').value.trim();
  const jobType = document.getElementById('wishlistJobType').value.trim();
  const appliedDate = document.getElementById('wishlistAppliedDate').value.trim();
  const location = document.getElementById('wishlistLocation').value.trim();
  const salary = document.getElementById('wishlistSalary').value.trim();
  const acceptMark = "No";
  if (Companyname == "") { alert('Please Enter Company Name') }
  else if (jobRole == "") { alert('Please Enter Job Role') }
  else if (jobType == "") { alert('Please Enter Job Type') }
  else if (appliedDate == "") { alert('Please Enter Applied Date') }
  else if (location == "") { alert('Please Enter Location') }
  else if (salary == "") { alert('Please Enter Salary') }

  if (Companyname && jobRole && jobType && appliedDate && location && salary && acceptMark) {
    const transaction = request.result.transaction('jobs', 'readwrite');
    const store = transaction.objectStore('jobs');

    const job = { Companyname, jobRole, jobType, appliedDate, location, salary, acceptMark };

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
  if (event.target.classList.contains('delete-button')) {
    const db = request.result;
    const transaction = db.transaction('jobs', 'readwrite');
    const store = transaction.objectStore('jobs');

    const id = Number(event.target.getAttribute('data-id'));

    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = () => {
      event.target.parentNode.parentNode.remove();
      console.log("Deleted Successfully");
    };

    deleteRequest.onerror = (event) => {
      console.error('Error deleting job from database', event.target.error);
    };
  }
});


document.getElementById('wishlistDataTableBody').addEventListener('click', (event) => {
  if (event.target.classList.contains('inProcess-button')) {
    const db = request.result;
    const jobtransaction = db.transaction('jobs', 'readwrite');
    const jobStore = jobtransaction.objectStore('jobs');
    const jobId = Number(event.target.getAttribute('data-id'));

    const getRequest = jobStore.get(jobId);
    getRequest.onsuccess = (event) => {
      const inprocessjob = event.target.result;

      const inProcesstransaction = inProcessrequest.result.transaction('inprocessjobs', 'readwrite');
      const inProcessStore = inProcesstransaction.objectStore('inprocessjobs');

      const moveRequest = inProcessStore.add(inprocessjob);

      moveRequest.onsuccess = () => {
        console.log('Success adding inprocessjob to database');
      };

      moveRequest.onerror = (event) => {
        console.error('Error adding job to database', event.target.error);
      };

    }
    const deleteRequest = jobStore.delete(jobId);
    deleteRequest.onsuccess = () => {
      event.target.parentNode.parentNode.remove();
      console.log("Deleted Successfully");
    };

    deleteRequest.onerror = (event) => {
      console.error('Error deleting job from database', event.target.error);
    };
  }
});

request.onsuccess = () => {
  const transaction = request.result.transaction('jobs', 'readonly');
  const store = transaction.objectStore('jobs');
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = () => {
    const jobs = getAllRequest.result;
    const tbody = document.getElementById('wishlistDataTableBody');

    for (const job of jobs) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${job.Companyname}</td>
          <td>${job.jobRole}</td>
          <td>${job.jobType}</td>
          <td>${job.appliedDate}</td>
          <td>${job.location}</td>
          <td>${job.salary}</td>
          <td><button class="edit-button" id="edit-button" data-id="${job.id}">Edit Job</button></td>
          <td><button class="inProcess-button" id="inProcess-button" data-id="${job.id}">In Process</button></td>
          <td><button class="delete-button" id="delete-button" data-id="${job.id}">Delete</button></td>
        `;
      tbody.appendChild(tr);
    }
  };

  getAllRequest.onerror = (event) => {
    console.error('Error getting jobs from database', event.target.error);
  };
};
let id1;
document.getElementById('wishlistDataTableBody').addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-button')) {
    const buttons = document.querySelectorAll('.edit-button, .addJob-button');
    let activeButton = null;
    buttons.forEach(button => {
      console.log('debug1');
      buttons.forEach(btn => {
        if (btn !== button) {
          console.log('debug3');
          btn.disabled = (btn !== activeButton);

        }
      });
    });
    const row = event.target.parentNode.parentNode;
    const transaction = request.result.transaction('jobs', 'readwrite');
    const store = transaction.objectStore('jobs');
    id1 = Number(event.target.getAttribute('data-id'));
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
                <input type="text" id="wishlistTableJobType" name="wishlistTableJobType" placeholder="Enter Job Type" required value="${wishjobType}">
                </td>
                <td>
                <input type="date" id="wishlistTableAppliedDate" name="wishlistTableAppliedDate" placeholder="Enter Applied Dtae" required value="${wishappliedDate}">
                </td>
                <td>
                <input type="text" id="wishlistTableLocation" name="wishlistTableLocation" placeholder="Enter Job Location" required value="${wishlocation}">
                </td>
                <td>
                <input type="text" id="wishlistTableSalary" name="wishlistTableSalary" placeholder="Enter Salary" required value="${wishsalary}">
                </td>
                <td></td>
                <td><button class="update-button" id="update-button" data-id="${data.id}">Update</button></td>
                <td><button class="cancel-button" id="delete-button" data-id="${data.id}">cancel</button></td>
                `;

    };
    getAllRequest.onerror = (event) => {
      console.error('Error getting jobs from database', event.target.error);
    };

  }
});

document.getElementById('wishlistDataTableBody').addEventListener('click', (event) => {
  if (event.target.classList.contains('update-button')) {
    const wishCompanyname = document.getElementById('wishlistTableCompanyName').value;
    const wishjobRole = document.getElementById('wishlistTableJobRole').value;
    const wishjobType = document.getElementById('wishlistTableJobType').value;
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
      const transaction = request.result.transaction('jobs', 'readwrite');
      const store = transaction.objectStore('jobs');
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

document.getElementById('wishlistDataTableBody').addEventListener('click', (event) => {
  if (event.target.classList.contains('cancel-button')) {
    window.location.reload();
  }
});


function preventBack() {
  window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload = function () { null };
