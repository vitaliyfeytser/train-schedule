// CONNECT FIREBASE


// local object for handling saved train info
var trainObject = [
    {
        trainName: 'Midnight Express',
        destination: 'San Francisco',
        firstTrainTime: '3:45',
        frequency: '90'
        // nextArrival: 'nextArrival()',
        // minutesAway: ''
    },
    {
        trainName: 'Lazy Noon',
        destination: 'San Diego',
        firstTrainTime: '1:55',
        frequency: '380'
        // nextArrival: 'nextArrival()',
        // minutesAway: ''
    }
]
console.log('trainObject at start: ', trainObject);

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
// var now = moment();
console.log('now: ', now);
// var now2 = moment().hours();

var now2 = moment().valueOf();
console.log('now2: ', now2);


// Sample code to use momentJS to default to 'today' with hours and minutes specified
// moment({hour: 5, minute: 10});  // today, 5:10.00.000

// $(document).ready(function () {


function firstRun() {
    // empty the train table before appending with new info
    $('#train-table').empty();

    for (var i = 0; i < trainObject.length; i++) {

        trainName = trainObject.trainName;
        destination = trainObject.destination;
        firstTrainTime = trainObject.firstTrainTime;
        frequency = trainObject.frequency;


        // take first train time .. of the day
        // take current time and subtract first time - product is in milliseconds
        var firstCurrentDiff = (moment().diff(moment(trainObject[i].firstTrainTime, 'LT')));
        console.log('firstCurrentDiff: ', firstCurrentDiff);

        // verifying that this value is in milliseconds
        var firstCurrentDiff_divided = firstCurrentDiff / 1000 / 60 / 60;
        console.log('firstCurrentDiff_divided: ', firstCurrentDiff_divided);

        // set frequency to milliseconds
        var frequencyMilSec = trainObject[i].frequency * 60 * 1000;
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
        var firstTrainTimeMilSec = moment(trainObject[i].firstTrainTime, 'LT').valueOf();
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
        var minutesAwayMilSec2 = Number(nextTrainTimeMilSec) - now2;
        console.log('minutesAwayMilSec: ', minutesAwayMilSec);
        console.log('minutesAwayMilSec2: ', minutesAwayMilSec2);

        // set minutes away in readable format to the variable that is used to create table rows

        minutesAway = Math.ceil(minutesAwayMilSec / 1000 / 60);
        // minutesAway = moment(minutesAwayMilSec).format("Y M d H:mm");
        // minutesAway2 = moment(minutesAwayMilSec).format("H:mm");
        console.log('minutesAway: ', minutesAway);
        // console.log('minutesAway2: ', minutesAway2);


        // divide difference by frequency
        // var frequencySum = firstCurrentDiff / moment(trainObject[i].frequency, 'x');
        // console.log('frequencySum: ', frequencySum);
        // // get result with remainder
        // var remainder = firstCurrentDiff % trainObject[i].frequency;
        // console.log('remainder: ', remainder);
        // var noRemainder = frequencySum - remainder;
        // console.log('noRemainder: ', noRemainder);
        // multiply frequency by whole numbers of result and add 1-frequency to get next train time

        function tableRowCreator() {
            $('<tr>').append(
                $('<th>', {
                    scope: 'row',
                    text: trainObject[i].trainName
                }),
                $('<td>', {
                    text: trainObject[i].destination
                }),
                $('<td>', {
                    text: trainObject[i].firstTrainTime
                }),
                $('<td>', {
                    text: trainObject[i].frequency
                }),
                $('<td>', {
                    text: nextArrival
                }),
                $('<td>', {
                    text: minutesAway
                }),
            ).appendTo('#train-table');
        }
        tableRowCreator();

    }

}
firstRun();

function minutesAway() {
    // multiply frequency by remainder and subtract from frequency to get minutes-away time

}

$('#submit-button').click(function () {
    event.preventDefault();

    trainName = $('#train-name').val();
    destination = $('#destination').val();
    firstTrainTime = $('#first-train-time').val();
    frequency = $('#frequency').val();

    console.log('newTrainName: ', trainName);
    console.log('newDestination: ', destination);
    console.log('newFirstTrainTime: ', firstTrainTime);
    console.log('newFrequency: ', frequency);

    trainObject.push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        nextArrival: 'funciton nextArrival()',
        minutesAway: 'function minutesAway()'
    })

    console.log('trainObject: ', trainObject);

    firstRun();
});



// });