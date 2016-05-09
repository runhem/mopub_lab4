// Create an empty sensor object as a global 
var sensor = {};

// Where the sensor data is stored
var mSensorDataURL = 'http://backup.evothings.com:8082/output/';

// A subscriber's key (Five other keys also availble at http://smartspaces.r1.kth.se:8082)
sensor.key = "BQa4EqqbgxfMgpBQ8XwNhvP82Dj";

// A bitmap image describing where the sensor is located
sensor.image = "https://evothings.com/demos/dome_pics/IMG_1758.JPG";


// Function to retrieve data, placing it in a "response" object
function getJSON() {
    $.ajax({
            url: mSensorDataURL + sensor.key + ".json?gt[timestamp]=now- 1day",
            jsonp: "callback",
            cache: true,
            dataType: "jsonp",
            data: 
                {
                page: 1
                },
                success: function(response) {
                    if (response && response[0]) {
                        sensor.data = response[0];
                        sensor.fullData = response;
                        printData();
                        shallIGo();
                    }
                }
        });
    }

function printData(){
    if (sensor && sensor.data) {
    // Display the info.
        html = '<h1>Sensor Data</h1>'
        + '<br /><div id="time">Time  ' + sensor.data.timestamp + '</div>'
        + '<div id="hum">Humidity ' + sensor.data.h + ' % (rel)</div>'
        + '<div id="temp">Temperature ' + sensor.data.t + ' celcius</div>'
        + '<p>' + sensor.data.c + '</p>'
    } 
    else{
        html = '<h1>Sensor Data</h1>'
         + '<br />Sorry, sensor data not available right now :(</br>'
    }
    document.getElementById("printHere").innerHTML= html;
}


function shallIGo(){
    var co = "Medium";
    var temp = "Medium";
    if(sensor && sensor.data){
        if (sensor.data.c >= 800){
            co = "High";
        }
        if(sensor.data.c <450){
            co = "Low";
        }
        if(sensor.data.t >= 30){
            temp = "Hot";
        }
        if(sensor.data.t < 20){
            temp = "Cold";
        }
    }

    var go = "";
    if(co == "Low" || co == "Medium"){
        if(temp == "Cold"){
        go = "Yes! You should definetily go.";
        }
        if(temp == "Medium"){
            go = "It might be people there, but go! The dome is nice.";
        }
        else{
            go = "No! Don't go!";
        }
    }
    if(co == "High"){
        if(temp == "Cold"){
            go = "It might be people there, but go! The dome is nice.";
        }
        else{
            go = "No! Don't go!";
        }
    }
    console.log(go);
    console.log(co);
    console.log(temp);

}


