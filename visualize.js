
// Where the sensor data is stored
var mSensorDataURL = 'http://backup.evothings.com:8082/output/';


// An empty sensor object and a subscribers key for inside data
var sensor = {};
sensor.key = "BQa4EqqbgxfMgpBQ8XwNhvP82Dj";

// Empty sensor object and subscriberes key for outside temperature
var sensorOut = {};
sensorOut.key = "1yqNobDPGQTAyE4EvePyUoxadLv";

// Function to retrieve data, placing it in a "response" object
function getSensor() {
    $.ajax({
            url: mSensorDataURL + sensor.key + ".json?gt[timestamp]=now-2day",
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
                        console.log("done")
                        getSensorOut();
                        sensor.haverage = getAverage(response, 'humidity');
                        sensor.taverage = getAverage(response, 'temp');
                        sensor.caverage = getAverage(response, 'carbon');

                        document.getElementById('goBtn').style.display="none";
                        document.getElementById('glass').style.display="block";
                    }
                }
    });
};

function getSensorOut() {
    $.ajax({
        url: mSensorDataURL + sensorOut.key + ".json?gt[timestamp]=now-2day",
        jsonp: "callback",
        cache: true,
        dataType: "jsonp",
        data: 
            {
            page: 1
            },
            success: function(response) {
                if (response[0]) {
                sensorOut.data=response[0];   
                sensorOut.fullData = response;
                shallIGo();
                getChart(sensor.fullData)
                minimize(sensor.fullData);
            }
        }
    });
}

// Empty variable to display if or if not to go to the dome based on temeperature/carbondioxide
var go = "";

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
        go = "Yes";
        }
        if(temp == "Medium"){
 /*         go = "It might be people there, but go! The dome is nice.";*/
            go = "Maybe";
        }
        else{
            go = "No";
        }
    }
    if(co == "High"){
        if(temp == "Cold"){
            go = "Maybe";
        }
        else{
            go = "No";
        }
    }
    document.getElementById("shouldIGo").innerHTML= '<p>'+go+'</p>';
}


function minimize(response){
    co2response1 = [];
    co2response2 = [];
    co2label = [];
    half = Math.round(response.length/2)
    console.log(half, response);
for (i = 0; i < half; i+=50) {
    co2response1.push(response[i].c);
    co2label.push(response[i].timestamp.substring(11, 16));
};
for (i = half; i < response.length; i+=50){
    co2response2.push(response[i].c)
}
}


function co2chart(co2response1, co2response2){
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: co2label,
        datasets: [{
            label: 'CO2',
            fill: false,
            borderColor: "rgba(75,192,192,1)",
            pointRadius:0,
            data: co2response1
        },
        {
            label: 'Yesterday',
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            pointRadius:0,
            data: co2response2
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
    },
});
}

function getAverage(data, element){
    sum = 0
    for(i in data){
        if(element=='humidity'){
        console.log(data[i].h)
        sum = sum + Number(data[i].h);
        }
        else if(element=='carbon'){
            sum= sum+Number(data[i].c);
        }
        else if(element=='temp'){
            sum=sum+Number(data[i].t);
        };
    }
    console.log(sum, data.length)
    var average = String(sum/data.length);
    return average

};


// Gör nu bara humidity, går säkert att göra generell med en till input som är bokstav för det 
// en vill charta. Jämför varje värde med medelvärde!

function getChart(response){
    allh = [];
    allav = [];
    lab = [];
    for(i=0; i<response.length; i+=100){
        allh.push(Number(response[i].h));
        allav.push(sensor.haverage);
        lab.push(response[i].timestamp.substring(11, 16));
    };
}

function chartAver(allh, allav, lab){
    var ctx2 = document.getElementById("avChart").getContext('2d');
    var avChart2 = new Chart(ctx2, {
        type:'line',
        data:{
            labels: lab,
            datasets:[{
                label: 'Medelvärde',
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                pointRadius:0,
                data:allav,
            },
            {
                label: 'Alla',
                fill: false,
                borderColor: "rgba(255,99,132,1)",
                pointRadius:0,
                data:allh,
            }]
        },
    })
};

function slideUp() {
    var should = document.getElementById('should');
    var overlay = document.querySelector('.glass');
    var answer = document.getElementById('shouldIGo');
      if (overlay.className === 'glass down') {
        overlay.className = 'glass up';
        should.style.display = 'none';
        answer.style.display = 'none';
        document.querySelector(".myicon").style.transform = "rotate(180deg)";
        } 
    else {
        overlay.className = 'glass down';
        should.style.display = 'block';
        answer.style.display = 'block';
        document.querySelector(".myicon").style.transform = "rotate(0deg)";
        }

        today()
};

function week(){
    var header = document.getElementById('glass-header');
    header.innerHTML = 'Past week/day(?) <i class="myicon glyphicon glyphicon-triangle-left"'+
    'style="position:absolute; left:0" onclick="today()"></i>';

    if (sensor && sensor.data) {
    // Display the info.
        html =
            '<div class="col-xs-12">'+
            '<div class="col-xs-12 contentdiv" id="carbon">'+
            '<span class="myh2">Carbon</span>'+
            '<canvas id="myChart" width="250" height="150"></canvas>'+
            '</div>'+

            '<div class="col-xs-12 contentdiv" id="av">'+
            '<span class="myh2">Humidity</span>'+
            '<canvas id="avChart" width="250" height="150"></canvas>'+
            '</div>'+
            '</div>'

//        + '<span class="thermometer">'+sensor.data.t+'&' + 'deg;C' +'</span>'
    } 
    else{
        html = '<h1>Sensor Data</h1>'
         + '<br />Sorry, sensor data not available right now :(</br>'
    }

    document.getElementById("printHere").innerHTML= html;

    chartAver(allh, allav, lab);
    co2chart(co2response1, co2response2);
}

function today(){
    var header = document.getElementById('glass-header');
    header.innerHTML = 'Right now <i class="myicon glyphicon glyphicon-triangle-right"'+
    'style="position:absolute; right:0" onclick="week()"></i>'

    if (sensor && sensor.data) {
    html =     
    '<div class="col-xs-12 contentdiv" id="temp">'+
        '<span id="myh2">Temperature</span>'+'<div class="col-xs-12">'+
            '<div class="row">'+
                '<div class="col-xs-5 col-xs-offset-2">'+
                    '<p class="number">'+sensor.data.t+'°</p>'+
                    '<p class="text">Inside</p>'+
                '</div>'+
                '<div class="col-xs-4">'+
                    '<p class="number">'+sensorOut.data.et.substring(0,4)+'°</p><p class="text">Outside</p>'+
                '</div></div></div></div>'+
        
        '<div class="col-xs-12 contentdiv" id="humidity">'+
        '<span class="myh2">Humidity</span>'+'<div class="col-xs-12">'+
          '<div class="row">'+
            '<div class="col-xs-5 col-xs-offset-2">'+
              '<p class="number">'+sensor.data.h.substring(0,5)+'%</p>'+
              '<p class="text">Now</p></div>'+
            '<div class="col-xs-4">'+
              '<p class="number">'+sensor.haverage.substring(0,5)+'%</p><p class="text">Average</p>'+
        '</div></div></div></div>'+
        
        '<div class="col-xs-12 contentdiv" id="carbon">'+
        '<span class="myh2">Carbon</span>'+'<div class="col-xs-12">'+
          '<div class="row"><div class="col-xs-5 col-xs-offset-2">'+
              '<p class="number">'+sensor.data.c+'</p>'+
              '<p class="text">Now</p></div>'+
            '<div class="col-xs-4">'+
              '<p class="number">'+sensor.caverage.substring(0,3)+'</p><p class="text">Average</p>'+
        '</div></div></div></div>'
    }
    else{
        html = '<h1>Sensor Data</h1>'
         + '<br />Sorry, sensor data not available right now :(</br>'
    }

    document.getElementById("printHere").innerHTML= html;
}



