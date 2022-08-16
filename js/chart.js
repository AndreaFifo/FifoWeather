//Adding a plugin of chartJS
Chart.register(ChartDataLabels);

//Creating and defining chart
const canvas = document.getElementById('chart').getContext('2d');

let gradient = canvas.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(130, 184, 255, 0.8)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

//Defining labels for every point of the chart
const labels = [
    'Night',
    'Morning',
    'Afternoon',
    'Evening'
];

//Defining data of chart; initialized with 0-0-0-0 
let data = {
    labels,
    datasets: [{
        data: [0, 0, 0, 0],
        fill: true,
        backgroundColor: gradient,
        borderColor: '#496994',
        pointBackgroundColor: '#72a4e6',
        pointBorderColor: '#72a4e6',
        tension: 0.4
    }]
};

//Defining chart options
const config = {
    type: 'line',
    data: data,
    options: {
        radius: 5,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#2D4059',
                    font: {
                        size: 14,
                        family: 'Lexend-SemiBold'
                    }
                }
            }, 
            y: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    display: false,
                    stepSize: 55
                },
                min: 15,
            }
        },
        legend: {
            display: false
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                anchor: 'end',
                align: 'top',
                color: '#2D4059',
                    font: {
                        size: 14,
                        family: 'Lexend-SemiBold'
                    }
            }
        }
    }
};

//Creating the chart
const myChart = new Chart(canvas, config);

//Updating data of chart when a city is searched
function drawChart(dayTemps){
    data.datasets[0].data = dayTemps;

    myChart.update();
}