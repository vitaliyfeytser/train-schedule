// CONNECT FIREBASE //////////

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDlrrFn3DljUQSE9N69j2Olgec_5_erguQ",
    authDomain: "train-schedule-d6eac.firebaseapp.com",
    databaseURL: "https://train-schedule-d6eac.firebaseio.com",
    projectId: "train-schedule-d6eac",
    storageBucket: "train-schedule-d6eac.appspot.com",
    messagingSenderId: "653281352895"
};
firebase.initializeApp(config);

var database = firebase.database();

/////////////////////////////

// variables for handling saved train info
var trainName = '';
var destination = '';
var firstTrainTime = '';
var frequency = '';

// variables for storing calculations
var nextArrival = '';
var minutesAway = '';

// get current time with javascipt or moment-js
var now = Date.now();
console.log('now: ', now);
// optional current time
var now2 = moment().valueOf();
console.log('now2: ', now2);

// on-click event listener for new-train submit button
$('#submit-button').click(function () {
    event.preventDefault();

    // grab input from new-train entry fields
    trainName = $('#train-name').val();
    destination = $('#destination').val();
    firstTrainTime = $('#first-train-time').val();
    frequency = $('#frequency').val();

    console.log('newTrainName: ', trainName);
    console.log('newDestination: ', destination);
    console.log('newFirstTrainTime: ', firstTrainTime);
    console.log('newFrequency: ', frequency);

    // create a train-object for push to Firebase database
    trainObject = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    }

    // Uploads train data to the database
    database.ref().push(trainObject);

    // Clear the new-train entry fields on-click of submit button
    $('#train-name').val('');
    $('#destination').val('');
    $('#first-train-time').val('');
    $('#frequency').val('');
});

var trainCount = 0;

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log('childSnapshot.val(): ', childSnapshot.val());

    // Store everything into a variable.
    trainName = childSnapshot.val().trainName;
    destination = childSnapshot.val().destination;
    firstTrainTime = childSnapshot.val().firstTrainTime;
    frequency = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    // take first train time .. of the day
    // take current time and subtract first time - product is in milliseconds
    var firstCurrentDiff = (moment().diff(moment(firstTrainTime, 'LT')));
    console.log('firstCurrentDiff: ', firstCurrentDiff);

    // verifying that this value is in milliseconds
    var firstCurrentDiff_divided = firstCurrentDiff / 1000 / 60 / 60;
    console.log('firstCurrentDiff_divided: ', firstCurrentDiff_divided);

    // set frequency to milliseconds
    var frequencyMilSec = frequency * 60 * 1000;
    console.log('frequencyMilSec: ', frequencyMilSec);

    // find number of 'frequency' intervals that already occured today
    var numOfTrainsToday = '';
    if (firstCurrentDiff / frequencyMilSec <= 0) {
        numOfTrainsToday = 0;
    } else {
        numOfTrainsToday = firstCurrentDiff / frequencyMilSec;
        console.log('numOfTrainsToday: ', numOfTrainsToday);
    }

    // round up to the next 'frequency' interval
    var nextTrain = Math.ceil(numOfTrainsToday);
    console.log('nextTrain: ', nextTrain);

    // set first train time to milliseconds
    var firstTrainTimeMilSec = moment(firstTrainTime, 'LT').valueOf();
    console.log('firstTrainTimeMilSec: ', firstTrainTimeMilSec);

    // get total time that will pass at next occurrence of 'frequency' in milliseconds
    var nextTrainIntervalMilSec = nextTrain * frequencyMilSec;
    console.log('nextTrainIntervalMilSec: ', nextTrainIntervalMilSec);

    // add next train interval to first train time to get a unix millisecond time of next train
    var nextTrainTimeMilSec = Number(nextTrainIntervalMilSec) + Number(firstTrainTimeMilSec);
    console.log('nextTrainTimeMilSec: ', nextTrainTimeMilSec);
    console.log('now2---------------: ', now2);

    // convert unix timestamp to readable time today
    var readableNextTrainTime = moment(nextTrainTimeMilSec).format("H:mm");
    console.log('readableNextTrainTime: ', readableNextTrainTime);

    // set next arrival time to variable that creates table rows
    nextArrival = readableNextTrainTime;
    console.log('nextArrival: ', nextArrival);

    // find the difference between now and the next train
    var minutesAwayMilSec = Number(nextTrainTimeMilSec) - Number(moment().valueOf());
    console.log('minutesAwayMilSec: ', minutesAwayMilSec);

    // set minutes away in readable format to the variable that is used to create table rows
    minutesAway = Math.ceil(minutesAwayMilSec / 1000 / 60);
    console.log('minutesAway: ', minutesAway);

    // Creates the new train schedule row
    function tableRowCreator() {
        $('<tr>', {
            // unique id setter for each <tr> html row elemnent
            id: 'train-num-' + trainCount
        }).append(
            $('<th>', {
                scope: 'row',
                text: trainName,
                id: 'train-name-' + trainCount
            }),
            $('<td>', {
                text: destination,
                id: 'destination-' + trainCount
            }),
            $('<td>', {
                text: firstTrainTime,
                id: 'first-train-time-' + trainCount
            }),
            $('<td>', {
                text: frequency,
                id: 'frequency-' + trainCount
            }),
            $('<td>', {
                text: nextArrival
            }),
            $('<td>', {
                text: minutesAway
            }),
            $('<td>', {
                class: 'button-column text-xs-right text-right'
            }).append(
                $('<button>', {
                    type: "button",
                    class: "btn btn-outline-secondary btn-sm remove-button",
                    text: 'Remove',
                    // train-schedule row marker that is same as train-mun-* in the <tr> html element 
                    // that allows deletetion of correct html element upon click of the Remove button
                    'data-train': trainCount,
                    // Firebase key for addressing this object in the firebase database
                    'data-key': childSnapshot.key
                })
            )
        ).appendTo('#train-table');
    }
    tableRowCreator();

    trainCount++
});

// event listener for the train schedule row Remove button
$(document.body).on("click", ".remove-button", function () {

    // select and remove the matching info in Firebase database
    var ref = database.ref("/" + $(this).attr("data-key"));
    console.log(ref);
    ref.remove();

    // Select and Remove the specific <tr> element that holds the specific train info.
    $("#train-num-" + $(this).attr("data-train")).remove();

});