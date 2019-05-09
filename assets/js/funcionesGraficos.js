//Funcion que genera el grafico
function generarGrafico(mediaPre95, mediaPre98, mediaPreDi, mediaPreDiA) {

    mediaPre95 = parseFloat(mediaPre95);
    mediaPre98 = parseFloat(mediaPre98);
    mediaPreDi = parseFloat(mediaPreDi);
    mediaPreDiA = parseFloat(mediaPreDiA);

    var ctx = document.getElementById('myChart').getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sin plomo 95', 'Sin plomo 98', 'Diesel', 'Diesel R33'],
            datasets: [{
                label: 'Media de los precios actuales',
                data: [mediaPre95.toFixed(3), mediaPre98.toFixed(3), mediaPreDi.toFixed(3), mediaPreDiA.toFixed(3)],
                backgroundColor: [
                    'rgba(206, 42, 29, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(89, 47, 147, 1)',
                    'rgba(255, 103, 99, 1)'
                ]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            "animation": {
                "duration": 1,
                "onComplete": function () {
                    var chartInstance = this.chart,
                        ctx = chartInstance.ctx;

                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            }
        }
    });
}

function generarGrafico2(historial) {

    //Establecemos el tamaño de los puntos del grafico
    Chart.defaults.global.elements.point.radius = 6;

    let array = [];

    for(let i = 0; i >= -30; i--) {
        array.push(obtenerDiasAnteriores(i));
    }

    //Establecemos los colores que tendran las diferentes linias
    window.chartColors = {
        red: 'rgb(195, 19, 15)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(0, 130, 255)',
        purple: 'rgb(70, 22, 131)',
        grey: 'rgb(201, 203, 207)',
        salmon: 'rgb(255, 77, 77)'
    };

    let lineChartData = {
        labels: array,
        datasets: [{
            label: 'Sin Plomo 95',
            borderColor: window.chartColors.red,
            backgroundColor: window.chartColors.red,
            fill: false,
            data: [],
        }, {
            label: 'Sin Plomo 98',
            borderColor: window.chartColors.blue,
            backgroundColor: window.chartColors.blue,
            fill: false,
            data: [],
        }, {
            label: 'Diesel',
            borderColor: window.chartColors.purple,
            backgroundColor: window.chartColors.purple,
            fill: false,
            data: [],
        }, {
            label: 'Diesel R33',
            borderColor: window.chartColors.salmon,
            backgroundColor: window.chartColors.salmon,
            fill: false,
            data: [],
        }]
    };

    for (let i = historial.length-1; i > 0; i--) {
        lineChartData.datasets[0].data.push(parseFloat(historial[i]["Media 95"]).toFixed(3));
        lineChartData.datasets[1].data.push(parseFloat(historial[i]["Media 98"]).toFixed(3));
        lineChartData.datasets[2].data.push(parseFloat(historial[i]["Media Diesel"]).toFixed(3));
        lineChartData.datasets[3].data.push(parseFloat(historial[i]["Media Diesel A"]).toFixed(3));
    }

    var ctx = document.getElementById('canvas').getContext('2d');

    window.myLine = Chart.Line(ctx, {
        data: lineChartData,
        options: {
            title: {
                display: true,
                text: 'Historico de precios de la ultima semana'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        stepSize: 0.02
                    }
                }]
            }
        }
    });
}