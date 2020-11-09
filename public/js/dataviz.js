var ctx = document.getElementById('chartBar');

var numFemale = ctx.dataset.female;
var numMale = ctx.dataset.male;
console.log(numFemale)
console.log(numMale)

/* var data = [ numMale, numFemale ] */

var labels = [ 'Homme', 'Femme' ]

var firstChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            data: [numMale, numFemale],
            backgroundColor: [
                '#fab1a0',
                '#ffeaa7',
            ],
            borderWidth: 1
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
        legend: {
            display: false,
        }
    }
});


var ctx = document.getElementById('doughnut');

var messLu = ctx.dataset.lu;
var messNonLu = ctx.dataset.nonlu;

var data = [ messLu, messNonLu ]

var labels = [ 'Lu', 'Non lu' ]

var firstChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            label: 'Messages',
            data: data,
            backgroundColor: [
                '#833471',
                '#FDA7DF',
            ],
            borderWidth: 1
        }]
    },
    options: {
        /* scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        } */
    }
});

var ctx = document.getElementById('chartpie');

var nbExp = ctx.dataset.exp
var nbNonExp = ctx.dataset.nonexp

var data = [nbExp,nbNonExp]

var labels = ['expédiées', 'non expédiées']

var firstChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            label: 'Messages',
            data: data,
            backgroundColor: [
                '#55efc4',
                '#00cec9',
            ],
            borderWidth: 1
        }]
    },
    options: {
        /* scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        } */
    }
});

var ctx = document.getElementById('linechart');

var data = JSON.parse(ctx.dataset.ca); //Transforme en obj

var userCountByMonthLabels = [];
var userCountByMonthDataResults = [];

for (var i = 0; i < data.length; i++) {
    var date = new Date((data[i]._id.year), (data[i]._id.month -1), 1 );//Récupère date
    var month = date.toLocaleString('fr-FR', {month: 'long'});//Formate mois

    userCountByMonthLabels.push(month);//Push le mois

    userCountByMonthDataResults.push(data[i].CA);//Push le chiffre d'affaires
}

var firstChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: userCountByMonthLabels,
        datasets: [{
            data: userCountByMonthDataResults,
            backgroundColor: '#ff7675',
            borderColor: '#d63031'
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
        legend: {
            display: false,
        }
    }
});