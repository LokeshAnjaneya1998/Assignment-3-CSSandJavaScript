const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database("bullsData.sqlite", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to the database.");
    }
});
// ... other database operations



    db.run('CREATE TABLE IF NOT EXISTS wishlistdata (id INTEGER PRIMARY KEY, companyname TEXT, jobrole TEXT, jobtype TEXT, applieddate TEXT, location TEXT, salary TEXT)');

function deleteRow(btn) {
    // Get the row to be deleted
    var row = btn.parentNode.parentNode;

    // Delete the row
    row.parentNode.removeChild(row);

}


function addData() {

    var msg1 = "My javaScript1";
    console.log(msg1);
    // Get the values of the input fields
    var Companyname = document.getElementById("wishlistCompanyName").value;
    var jobRole = document.getElementById("wishlistJobRole").value;
    var jobType = document.getElementById("wishlistJobType").value;
    var appliedDate = document.getElementById("wishlistAppliedDate").value;
    var location = document.getElementById("wishlistLocation").value;
    var salary = document.getElementById("wishlistSalary").value;

    // Create a new row in the table with the values
    var table = document.getElementById("wishlistDataTable");
    var row = table.insertRow();
    var CompanynameCell = row.insertCell();
    var jobRoleCell = row.insertCell();
    var jobTypeCell = row.insertCell();
    var appliedDateCell = row.insertCell();
    var locationCell = row.insertCell();
    var salaryCell = row.insertCell();
    var inProcessCell = row.insertCell();
    var archiveCell = row.insertCell();
    var deleteCell = row.insertCell();


    CompanynameCell.innerHTML = Companyname;
    jobRoleCell.innerHTML = jobRole;
    jobTypeCell.innerHTML = jobType;
    appliedDateCell.innerHTML = appliedDate;
    locationCell.innerHTML = location;
    salaryCell.innerHTML = salary;
    inProcessCell.innerHTML = '<button>InProcess</button>'
    archiveCell.innerHTML = '<button>Archive</button>'
    deleteCell.innerHTML = '<button id="delete-button" onclick="deleteRow(this)">Delete</button>';
    db.run(`INSERT INTO wishlistdata (companyname, jobrole, jobtype, applieddate, location, salary) VALUES (?, ?, ?, ?, ?, ?)`, [Companyname, jobRole, jobType, appliedDate, location, salary], function (err) {
        if (err) {
            return console.log(err.message);
        }

        console.log('Row inserted: ${companyname} - ${jobrole} - ${jobtype} - ${applieddate} - ${location} - ${salary}');
    });
    db.close();
}




