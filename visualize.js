// Create an empty sensor object as a global 
var sensor = {};

// Where the sensor data is stored
var mSensorDataURL = 'http://backup.evothings.com:8082/output/';

// A subscriber's key (Five other keys also availble at http://smartspaces.r1.kth.se:8082)
sensor.key = "BQa4EqqbgxfMgpBQ8XwNhvP82Dj";

// A bitmap image describing where the sensor is located
sensor.image = "https://evothings.com/demos/dome_pics/IMG_1758.JPG";
var go = "";

// Function to retrieve data, placing it in a "response" object
function getJSON() {
    $.ajax({
            url: mSensorDataURL + sensor.key + ".json?gt[timestamp]=now- 2day",
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
                        console.log(response)
                        shallIGo();
                        printData();
                        minimize(response);
                       
                    }
                }
        });
    }
function printData(){
    if (sensor && sensor.data) {
    // Display the info.
        html = '<h1>Sensor Data</h1>'
        + '<br /><div id="time">Time  ' + sensor.data.timestamp + '</div>'
        + '<div id="hum"><img src="images/humidity.png" width="40px" height="40px">'+ sensor.data.h + ' % (rel)</div>'
        +'<p>Temperature ' + sensor.data.t + '</p>'
        + '<span class="thermometer">'+sensor.data.t+'&' + 'deg;C' +'</span>'
        +'<p>'+ go +'</p>'
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

function minimize(response){
var co2response1 = [];
var co2response2 = [];
for (i = 0; i < 2000; i++) {
    co2response1.push(response[i].c);
    
};
for (i = 2001; i < response.length; i++){
    co2response2.push(response[i].c)
}
co2chart(co2response1, co2response2);

}

function co2chart(co2response1, co2response2){
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["08:00","08:30","09:00", "09:30","10:00","10:30","11:00","11:30", "12:00","12:30", "13:00","13:30" ,"14:00", "14:30", "15:00","15:30"],
        datasets: [{
            label: 'CO2',
            data: co2response1,
            fill: false,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",

        },
        {
            label: 'Yeasterday',
            data: co2response2,
            fill: false,
            backgroundColor: "rgba(255,99,132,0.4)",
            borderColor: "rgba(255,99,132,1)"

        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:false
                }
            }]
        }
    }
});
}




