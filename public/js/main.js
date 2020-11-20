let mydata;
const onArr = [];
let totalSum = 0;
const offArr = [];
async function getChartData() {
    const response = await fetch("https://statemonitor.herokuapp.com/getData")
    return response.json();
}
async function assignData() {
    mydata = await getChartData();
    console.log(mydata);
    Chart.defaults.global.defaultFontFamily = 'Alegreya';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';
    Chart.defaults.global.defaultFontStyle = 'Bold'

    mydata.forEach(data => {
        let d = data.date.split('.');
        if(data.ontime && data.offtime) {
            let onData = `${d[1]} ${d[0]} ${d[2]} ${data.ontime}`;
            let offData = `${d[1]} ${d[0]} ${d[2]} ${data.offtime}`;
            onArr.push(onData);
            offArr.push(offData);
        } else {
            let onData = `${d[1]} ${d[0]} ${d[2]} ${data.ontime}`;
            console.log(onData);
            showDiff(onData);
        }
    });
    console.log(onArr);
    console.log(offArr);
    lineChart();
    barChart();
    loadLastDiv();
}

assignData();

function showDiff(formattedOn) {
    let onDate = new Date(formattedOn);
    let currDate = new Date();

    let diff = (currDate - onDate)/1000;
    diff = Math.abs(Math.floor(diff));
    
    let days = Math.floor(diff/(24*60*60));
    let leftSec = diff - days * 24*60*60;
    
    let hrs = Math.floor(leftSec/(60*60));
    leftSec = leftSec - hrs * 60*60;
    let min = Math.floor(leftSec/(60));
    leftSec = leftSec - min * 60;
    $("#activediv").empty()
    const active_div = document.getElementById('activediv');
    active_div.classList.add("active");
    const h3 = document.createElement('h3');
    h3.innerHTML = "The device has been active for " + days + " days " + hrs + " hours " + min + " minutes and " + leftSec + " seconds.";
    h3.classList.add('active-time');
    active_div.appendChild(h3);
    setTimeout(() => {
        showDiff(onDate);
    },1000);
}

function lineChart() {    
    const xOnData = chartData(onArr);
    const xOffData = chartData(offArr);

    function chartData(array) {
        const result = [];
        array.forEach((data, index) => {
            result.push({
                t: new Date(data),
                y: index+1
            });
        });
        return result;        
    }
    console.log(xOnData);
    console.log(xOffData);

    let dataFirst = {
        label: 'OnTime',
        data: xOnData,
        pointRadius: 5,
        fill: false,
        backgroundColor: 
            'rgba(22, 165, 150, 1)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(255, 206, 86, 0.2)',
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(255, 159, 64, 0.2)'
        
        borderColor: [
            'rgba(22, 165, 150,1)'
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    };

    let dataSecond = {
        label: 'OffTime',
        data: xOffData,
        pointRadius: 5,
        fill: false,
        backgroundColor: 'rgba(240,84,84,1)',
        borderColor: [
            'rgba(240,84,84,1)'
            // 'rgba(54, 162, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    };

    let speedData = {
    datasets: [dataFirst, dataSecond]
    };

    let ctx1 = document.getElementById("examChart1").getContext("2d");
    let myChart = new Chart(ctx1, {
    type: 'line',
    data: speedData,
    options: {
        scales: {
        xAxes: [{
            type: 'time'
        }],
        yAxes: [
            {
            ticks: {
                precision: 0,
            },
            },
        ],
        },
        title:{
            display:true,
            text:'Device On and Off Status - Line Graph',
            fontSize:25,
            fontColor: "#111"
            },
            legend:{
            display:true,
            position:'right',
            labels:{
                fontColor:'#111'
            }
            },
            layout:{
            padding:{
                left:50,
                right:0,
                bottom:0,
                top:0
            }
            },
            tooltips:{
            enabled:true
            }
    }
    });
}

function barChart() {
    const minuteGraph = [];
    for(let i=0; i<onArr.length; i++) {
        const start = new Date(onArr[i]);
        const stop = new Date(offArr[i]);
        const data = Math.round((stop.getTime() - start.getTime())/1000/60);
        minuteGraph.push({
            startHour: start.getHours(),
            stopHour: stop.getHours(),
            duration: data
        });
    }


    let time = 0;
    const finalArr = [];
    const labels = [];
    let start = parseInt(onArr[0].split(" ")[3].split(":")[0]);
    let stop = parseInt(onArr[onArr.length - 1].split(" ")[3].split(":")[0]);
    for(let i=start; i<= stop; i++) {
    minuteGraph
        .filter((data) => data.startHour === i)
        .forEach(data => {
        console.log(data);
        time +=data.duration; 
        });
    console.log(time);
    finalArr.push(time);
    time = 0;
    let startLabel = getLabel(i);
    let stopLabel = getLabel(i+1);
    labels.push(`${startLabel} - ${stopLabel}`);
    }
    finalArr.forEach(data => {
        totalSum += data;
    });
    function getLabel(hr) {
    let label;
    console.log(hr);
    if(hr >= 12 && hr<= 23) {
        if(hr > 12)
        hr -= 12;
        label = `${hr} PM`;
    } else {
        label = `${hr} AM`;
    }
    return label;
    }
    console.log(labels);
    console.log(finalArr);

    let data = {
        labels: labels,
        datasets: [
          {
            label: "Active Time (in Minutes)",
            data: finalArr,
            backgroundColor: 
              'rgba(32,178,170,0.7)',
            borderWidth: 1
          },
        ]
      };
      
      //options
      var options = {
        responsive: true,
        title: {
          display: true,
          position: "top",
          text: "Active State - Bar Graph",
          fontSize: 25,
          fontColor: "#111"
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#333",
            fontSize: 16
          }
        },
        
        scales: {
          yAxes: [{
            ticks: {
              min: 0
            }
          }]
        }
      };
      
      //create Chart class object
      let ctx2 = document.getElementById("examChart2").getContext("2d");
      let chart = new Chart(ctx2, {
        type: "bar",
        data: data,
        options: options
      });
}
function loadLastDiv() {
    const closing_div1 = document.getElementById('closing1');
    const closing_div2 = document.getElementById('closing2');
    console.log('THE END!');
    //closing_div.classList.add("active");
    const last = document.createElement('h3');
    const last1 = document.createElement('h3');
    last.innerHTML = "No. of active Instances : ";
    const h11 = document.createElement('h1');
    h11.classList.add('active-stat');
    h11.innerHTML = mydata.length;
    last1.innerHTML =  "Total no. of minutes : ";
    const h12 = document.createElement('h1');
    h12.classList.add('active-stat');
    h12.innerHTML = totalSum;
    closing_div1.append(last);
    closing_div2.append(last1);
    closing_div1.append(h11);
    closing_div2.append(h12);
}