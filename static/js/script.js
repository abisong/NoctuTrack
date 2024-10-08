let visits = [];
let intakes = [];
let urineOutputs = [];

function loadSyntheticData() {
    fetch('/synthetic_data')
        .then(response => response.json())
        .then(data => {
            visits = data.visits;
            intakes = data.intakes;
            urineOutputs = data.urineOutputs;
            localStorage.setItem('visits', JSON.stringify(visits));
            localStorage.setItem('intakes', JSON.stringify(intakes));
            localStorage.setItem('urineOutputs', JSON.stringify(urineOutputs));
            updateReport();
        })
        .catch(error => console.error('Error loading synthetic data:', error));
}

// Rest of the script.js content remains the same

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('trackButton').addEventListener('click', trackVisit);
    document.getElementById('generateReport').addEventListener('click', generateDetailedReport);
    document.getElementById('clearReport').addEventListener('click', clearReport);
    document.getElementById('generateTimeRangeReport').addEventListener('click', generateTimeRangeReport);
    document.getElementById('clearTimeRangeReport').addEventListener('click', clearTimeRangeReport);
    document.getElementById('trackLiquidButton').addEventListener('click', trackLiquid);
    document.getElementById('trackFoodButton').addEventListener('click', trackFood);
    document.getElementById('trackUrineButton').addEventListener('click', trackUrine);
    
    loadSyntheticData();
});
