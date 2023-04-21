const request = window.indexedDB.open("wishlistbullsData", 1);
const inProcessrequest = window.indexedDB.open("inpricessbullsData", 1);
const offersrequest = window.indexedDB.open("offersbullsData", 1);
const eventrequest = window.indexedDB.open("eventsbullsData", 1);
const signuprequest = window.indexedDB.open("signupbullsData", 1);

signuprequest.onerror = function (event) {
  console.log("Error opening signup database.");
};

signuprequest.onsuccess = function (event) {
  const db = event.target.result;
  console.log("Connected to the signup database.");
};

signuprequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore('signupids', { keyPath: 'id', autoIncrement: true });
  console.log("Started in signup database.");
};
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

offersrequest.onerror = function (event) {
    console.log("Error opening offers database.");
};

offersrequest.onsuccess = function (event) {
    const db = event.target.result;
    console.log("Connected to the offers database.");
};

offersrequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('offersjobs', { keyPath: 'id', autoIncrement: true });
    console.log("Started in offers database.");
};

eventrequest.onerror = function (event) {
    console.log("Error opening events database.");
};

eventrequest.onsuccess = function (event) {
    const db = event.target.result;
    console.log("Connected to the events database.");
};

eventrequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('eventjobs', { keyPath: 'id', autoIncrement: true });
    console.log("Started in events database.");
};

var currentTimestamp = new Date();

var hours = currentTimestamp.getHours().toString().padStart(2, '0');
var minutes = currentTimestamp.getMinutes().toString().padStart(2, '0');
var month = (currentTimestamp.getMonth() + 1).toString().padStart(2, '0');
var day = currentTimestamp.getDate().toString().padStart(2, '0');
var year = currentTimestamp.getFullYear();

const todayDate = year + '-' + month + '-' + day;
let intDay = parseInt(day)+1
var tday = intDay.toString()
const tomorrowDate = year + '-' + month + '-' + tday;

console.log(todayDate);
console.log(tomorrowDate);


function disableButtons(){
    const buttons = document.querySelectorAll('.edit-event-button, .addJob-button, .edit-button, .addJob-button');
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
};

function cancelButton() {
    window.location.reload();
};

function deleteButton(databaseRequest, database) {
    console.log(databaseRequest);
    console.log(database);
    const deleteid = document.getElementById('delete-button');
        deleteid.click();
        deleteid.click();
    deleteid.addEventListener('click', (event) => {
        console.log('debug2');
        const db = databaseRequest.result;
        const transaction = db.transaction(database, 'readwrite');
        const store = transaction.objectStore(database);

        const id = Number(event.target.getAttribute('data-id'));

        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = () => {
            event.target.parentNode.parentNode.remove();
            console.log("Deleted Successfully");
        };

        deleteRequest.onerror = (event) => {
            console.error('Error deleting job from database', event.target.error);
        };

    });
};

function preventBack() {
    window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload = function () { null };